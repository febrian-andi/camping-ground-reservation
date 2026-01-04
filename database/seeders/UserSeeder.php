<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::firstOrCreate(
            ['name' => 'super_admin', 'guard_name' => 'web']
        );

        $user = User::firstOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin',
                'phone_number' => '0812345678',
                'password' => Hash::make('12345678'),
            ]
        );

        $user->assignRole($role);

        $role = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'web']
        );

        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin',
                'phone_number' => '0812345678',
                'password' => Hash::make('12345678'),
            ]
        );

        $user->assignRole($role);

        $role = Role::firstOrCreate(
            ['name' => 'user', 'guard_name' => 'web']
        );

        $user = User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'User',
                'phone_number' => '0812345678',
                'password' => Hash::make('12345678'),
            ]
        );

        $user->assignRole($role);
    }
}
