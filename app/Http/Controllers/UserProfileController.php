<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserProfileController extends Controller
{
    public function index()
    {

        return Inertia::render('ProfilePage');
    }
}
