<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if admin user already exists
        $admin = Admin::where('email', 'admin@admin.com')->first();

        if (!$admin) {
            Admin::create([
                'name' => 'Admin User',
                'email' => 'admin@admin.com',
                'password' => Hash::make('123456789'),
                'email_verified_at' => now(),
            ]);

            $this->command->info('Admin user created successfully!');
            $this->command->info('Email: admin@admin.com');
            $this->command->info('Password: 123456789');
        } else {
            $this->command->warn('Admin user already exists!');
        }
    }
}

