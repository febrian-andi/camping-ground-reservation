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
        return Inertia::render('Auth/LoginPage');
    })->name('login');

    Route::post('/login', [AuthController::class, 'store']);


    Route::get('/register', function () {
        return Inertia::render('Auth/RegisterPage');
    })->name('register');

    Route::post('/register', [AuthController::class, 'create']);
});

/**
 * =========================
 * USER PAGES
 * =========================
 */
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::get('/explore', [CampingGroundController::class, 'index'])->name('explore');
    Route::get('/profile', [UserProfileController::class, 'index'])->name('profile');
    Route::get('/booking-history', [BookingController::class, 'index'])->name('booking-history');
    Route::get('/camping-ground-detail/{slug}', [CampingGroundController::class, 'show'])->name('camping-ground-detail');
});

/**
 * =========================
 * USER ACTIONS (FORM)
 * =========================
 */
Route::middleware(['auth', 'role:user'])->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])
        ->name('logout');
    Route::post('/booking', [BookingController::class, 'store'])->name('booking.store');
    Route::post('/booking/cancel', [BookingController::class, 'cancelBooking'])->name('booking.cancel');
});

/**
 * =========================
 * USER API (AJAX / FETCH)
 * =========================
 */
Route::middleware(['auth', 'role:user'])
    ->prefix('api/user')
    ->group(function () {
        Route::get('/booking/check-availability', [BookingController::class, 'checkAvailability'])
            ->name('api.user.booking.check-availability');

        Route::get('/booking/detail/{booking}', [BookingController::class, 'show'])
            ->name('api.user.booking.show');

        Route::get('/booking/{reservation}/qrcode', [BookingController::class, 'generateQRCode'])
            ->name('api.user.booking.qrcode');
    });
