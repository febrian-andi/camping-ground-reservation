<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $superAdminRole = Role::firstWhere('name', 'super_admin');
        $adminRole = Role::firstWhere('name', 'admin');
        $userRole = Role::firstWhere('name', 'user');

        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'phone_number' => '0812345678',
                'password' => Hash::make('12345678'),
            ]
        );
        $superAdmin->assignRole($superAdminRole);

        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'phone_number' => '0812345678',
                'password' => Hash::make('12345678'),
            ]
        );
        $admin->assignRole($adminRole);

        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'User',
                'phone_number' => '0812345678',
                'password' => Hash::make('12345678'),
            ]
        );
        $user->assignRole($userRole);
    }
}
