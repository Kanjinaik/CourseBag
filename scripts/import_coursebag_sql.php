<?php

declare(strict_types=1);

if ($argc < 2) {
    fwrite(STDERR, "Usage: php scripts/import_coursebag_sql.php path/to/coursebag.sql\n");
    exit(1);
}

$sqlPath = $argv[1];
$databasePath = __DIR__ . '/../database/database.sqlite';

if (!is_file($sqlPath)) {
    fwrite(STDERR, "SQL file not found: {$sqlPath}\n");
    exit(1);
}

if (!is_file($databasePath)) {
    fwrite(STDERR, "SQLite database not found: {$databasePath}\n");
    exit(1);
}

$backupPath = $databasePath . '.bak-' . date('Ymd-His');
if (!copy($databasePath, $backupPath)) {
    fwrite(STDERR, "Could not create backup: {$backupPath}\n");
    exit(1);
}

$source = file_get_contents($sqlPath);
if ($source === false) {
    fwrite(STDERR, "Could not read SQL file: {$sqlPath}\n");
    exit(1);
}

$tables = [
    'admins',
    'users',
    'categories',
    'courses',
    'pages',
    'website_settings',
    'transactions',
    'course_user',
    'carts',
];

$deleteOrder = array_reverse($tables);
$pdo = new PDO('sqlite:' . $databasePath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

function splitRows(string $values): array
{
    $rows = [];
    $current = '';
    $depth = 0;
    $quote = null;
    $escape = false;

    $length = strlen($values);
    for ($i = 0; $i < $length; $i++) {
        $char = $values[$i];

        if ($escape) {
            $current .= $char;
            $escape = false;
            continue;
        }

        if ($quote !== null) {
            if ($char === '\\') {
                $current .= $char;
                $escape = true;
                continue;
            }

            if ($char === $quote) {
                $quote = null;
            }

            $current .= $char;
            continue;
        }

        if ($char === "'" || $char === '"') {
            $quote = $char;
            $current .= $char;
            continue;
        }

        if ($char === '(') {
            $depth++;
            if ($depth > 1) {
                $current .= $char;
            }
            continue;
        }

        if ($char === ')') {
            $depth--;
            if ($depth === 0) {
                $rows[] = $current;
                $current = '';
                continue;
            }
            $current .= $char;
            continue;
        }

        if ($depth > 0) {
            $current .= $char;
        }
    }

    return $rows;
}

function parseRow(string $row): array
{
    $values = [];
    $current = '';
    $quote = null;
    $escape = false;
    $length = strlen($row);

    for ($i = 0; $i < $length; $i++) {
        $char = $row[$i];

        if ($escape) {
            $current .= match ($char) {
                'n' => "\n",
                'r' => "\r",
                't' => "\t",
                '0' => "\0",
                default => $char,
            };
            $escape = false;
            continue;
        }

        if ($quote !== null) {
            if ($char === '\\') {
                $escape = true;
                continue;
            }

            if ($char === $quote) {
                $quote = null;
                continue;
            }

            $current .= $char;
            continue;
        }

        if ($char === "'" || $char === '"') {
            $quote = $char;
            continue;
        }

        if ($char === ',') {
            $values[] = normalizeValue($current);
            $current = '';
            continue;
        }

        $current .= $char;
    }

    $values[] = normalizeValue($current);

    return $values;
}

function normalizeValue(string $value): mixed
{
    $value = trim($value);

    if (strcasecmp($value, 'NULL') === 0) {
        return null;
    }

    return $value;
}

function insertStatements(string $sql): array
{
    $statements = [];
    $current = '';
    $quote = null;
    $escape = false;
    $length = strlen($sql);

    for ($i = 0; $i < $length; $i++) {
        $char = $sql[$i];
        $current .= $char;

        if ($escape) {
            $escape = false;
            continue;
        }

        if ($quote !== null) {
            if ($char === '\\') {
                $escape = true;
                continue;
            }

            if ($char === $quote) {
                $quote = null;
            }

            continue;
        }

        if ($char === "'" || $char === '"') {
            $quote = $char;
            continue;
        }

        if ($char === ';') {
            if (preg_match('/INSERT INTO `/i', $current, $match, PREG_OFFSET_CAPTURE)) {
                $statements[] = substr($current, $match[0][1]);
            }
            $current = '';
        }
    }

    return $statements;
}

try {
    $pdo->beginTransaction();
    $pdo->exec('PRAGMA foreign_keys = OFF');

    foreach ($deleteOrder as $table) {
        $pdo->exec("DELETE FROM {$table}");
    }

    if ($pdo->query("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'sqlite_sequence'")->fetchColumn()) {
        foreach ($tables as $table) {
            $stmt = $pdo->prepare('DELETE FROM sqlite_sequence WHERE name = ?');
            $stmt->execute([$table]);
        }
    }

    $inserted = array_fill_keys($tables, 0);

    foreach (insertStatements($source) as $insertStatement) {
        if (!preg_match('/INSERT INTO `([^`]+)` \(([^)]+)\) VALUES\s*(.*);/s', $insertStatement, $match)) {
            continue;
        }

        $table = $match[1];
        if (!in_array($table, $tables, true)) {
            continue;
        }

        $columns = array_map(
            static fn (string $column): string => trim($column, " `\t\n\r\0\x0B"),
            explode(',', $match[2])
        );

        $placeholders = implode(', ', array_fill(0, count($columns), '?'));
        $columnSql = implode(', ', array_map(static fn (string $column): string => '"' . $column . '"', $columns));
        $statement = $pdo->prepare("INSERT INTO {$table} ({$columnSql}) VALUES ({$placeholders})");

        foreach (splitRows($match[3]) as $row) {
            $values = parseRow($row);
            if (count($values) !== count($columns)) {
                throw new RuntimeException("Column/value count mismatch for {$table}");
            }

            $statement->execute($values);
            $inserted[$table]++;
        }
    }

    $pdo->exec('PRAGMA foreign_keys = ON');
    $pdo->commit();

    echo "Backup created: {$backupPath}\n";
    foreach ($tables as $table) {
        $count = (int) $pdo->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
        echo str_pad($table, 18) . " imported={$inserted[$table]} total={$count}\n";
    }
} catch (Throwable $exception) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    copy($backupPath, $databasePath);
    fwrite(STDERR, "Import failed, database restored from backup.\n");
    fwrite(STDERR, $exception->getMessage() . "\n");
    exit(1);
}
