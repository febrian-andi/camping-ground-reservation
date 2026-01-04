<?php

namespace App\Http\Controllers;

use App\Services\Auth\AuthService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if ($this->authService->attemptLogin($credentials)) {
            $request->session()->regenerate();
            $user = $request->user();

            if ($user->hasAnyRole(['admin', 'super_admin'])) {
                return Inertia::location(
                    filament()->getPanel('admin')->getUrl()
                );
            }

            return Inertia::location(route('explore'));
        }

        throw ValidationException::withMessages([
            'email' => 'Email atau kata sandi salah.',
        ]);
    }

    public function destroy(Request $request)
    {
        $this->authService->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone_number' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $this->authService->register($request->only('name', 'phone_number', 'email', 'password'));

        $this->authService->loginUser($user);

        return redirect()->route('explore');
    }
}
