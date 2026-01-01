<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CampingGroundController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserProfileController;

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

/**
 * =========================
 * GUEST ONLY
 * =========================
 */
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('auth/LoginPage');
    })->name('login');

    Route::post('/login', [AuthController::class, 'store']);


    Route::get('/register', function () {
        return Inertia::render('auth/RegisterPage');
    })->name('register');

    Route::post('/register', [AuthController::class, 'create']);
});

/**
 * =========================
 * AUTH ONLY
 * =========================
 */
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])
        ->name('logout');

    Route::get('/explore', [CampingGroundController::class, 'index'])
        ->name('explore');

    Route::get('/camping-ground-detail/{slug}', [CampingGroundController::class, 'show'])
        ->name('camping-ground-detail');

    Route::get('/booking-history', [BookingController::class, 'index'])
        ->name('booking-history');

    Route::get('/profile', [UserProfileController::class, 'index'])
        ->name('profile');

    Route::get('/booking/check-availability', [BookingController::class, 'checkAvailability'])
        ->name('booking.check-availability');

    Route::post('/booking', [BookingController::class, 'store'])
        ->name('booking.store');

    Route::post('/booking/cancel', [BookingController::class, 'cancelBooking'])
        ->name('booking.cancel');
});
