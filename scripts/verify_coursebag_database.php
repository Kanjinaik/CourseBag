<?php

declare(strict_types=1);

$databasePath = __DIR__ . '/../database/database.sqlite';

if (!is_file($databasePath)) {
    fwrite(STDERR, "SQLite database not found: {$databasePath}\n");
    exit(1);
}

$pdo = new PDO('sqlite:' . $databasePath);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

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

foreach ($tables as $table) {
    $count = (int) $pdo->query("SELECT COUNT(*) FROM {$table}")->fetchColumn();
    echo str_pad($table, 18) . $count . PHP_EOL;
}

$stmt = $pdo->prepare('UPDATE admins SET password = ?, updated_at = ? WHERE email = ?');
$stmt->execute([
    password_hash('123456789', PASSWORD_BCRYPT),
    date('Y-m-d H:i:s'),
    'admin@admin.com',
]);

echo 'admin_password=123456789' . PHP_EOL;

foreach (['razorpay_enabled', 'pinelabs_enabled', 'main_logo', 'favicon'] as $key) {
    $stmt = $pdo->prepare('SELECT value FROM website_settings WHERE key = ?');
    $stmt->execute([$key]);
    echo $key . '=' . (string) $stmt->fetchColumn() . PHP_EOL;
}

