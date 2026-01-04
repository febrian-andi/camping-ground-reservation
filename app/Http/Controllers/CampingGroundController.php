<?php

namespace App\Http\Controllers;

use App\Services\CampingGrounds\CampingGroundService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampingGroundController extends Controller
{
    protected $campingGroundService;

    public function __construct(CampingGroundService $campingGroundService)
    {
        $this->campingGroundService = $campingGroundService;
    }

    public function index()
    {
        return Inertia::render('ExplorePage', [
            'campgrounds' => $this->campingGroundService->getExploreData(),
        ]);
    }

    public function show($slug)
    {
        return Inertia::render('CampingGroundDetailPage', [
            'campground' => $this->campingGroundService->getDetailBySlug($slug),
        ]);
    }
}
