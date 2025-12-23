<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

Route::get('/login', function () {
    return Inertia::render('auth/LoginPage');
})->name('login');

Route::get('/register', function () {
    return Inertia::render('auth/RegisterPage');
})->name('register');

Route::middleware(['auth'])->group(function () {
    Route::get('/explore', function () {
        return Inertia::render('ExplorePage');
    })->name('explore');

    Route::get('/camping-ground-detail', function () {
        return Inertia::render('CampingGroundDetailPage');
    })->name('camping-ground-detail');

    Route::get('/booking-history', function () {
        return Inertia::render('BookingHistoryPage');
    })->name('booking-history');

    Route::get('/profile', function () {
        return Inertia::render('ProfilePage');
    })->name('profile');
});
