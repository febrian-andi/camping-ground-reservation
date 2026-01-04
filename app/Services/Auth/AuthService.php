<?php

namespace App\Services\Auth;

use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthService
{
    protected $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data)
    {
        $user = $this->userRepository->create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone_number' => $data['phone_number'] ?? null,
        ]);

        if (method_exists($user, 'assignRole')) {
            $user->assignRole('user');
        }

        return $user;
    }

    public function attemptLogin(array $credentials, bool $remember = false)
    {
        return Auth::attempt($credentials, $remember);
    }

    public function loginUser($user)
    {
        Auth::login($user);
    }

    public function logout()
    {
        Auth::logout();
    }
}
