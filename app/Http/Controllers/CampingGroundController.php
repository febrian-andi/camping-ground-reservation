<?php

namespace App\Http\Controllers;

use App\Models\CampingGround;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampingGroundController extends Controller
{
    public function index()
    {
        return Inertia::render('ExplorePage', [
            'campgrounds' => CampingGround::select(
                'id',
                'name',
                'slug',
                'description',
                'location',
                'base_price',
            )
                ->with('campingGroundImages:id,camping_ground_id,image')
                ->get(),
        ]);
    }

    public function show($slug)
    {
        return Inertia::render('CampingGroundDetailPage', [
            'campground' => CampingGround::select(
                'id',
                'name',
                'slug',
                'description',
                'location',
                'base_price',
                'facilities',
                'rules',
            )
                ->with([
                    'campingGroundImages:id,camping_ground_id,image',
                    'campingGroundLayout:id,camping_ground_id,layout_image',
                    'blocks:id,camping_ground_id,name,daily_price,is_active',
                ])
                ->where('slug', $slug)
                ->first(),
        ]);
    }
}
