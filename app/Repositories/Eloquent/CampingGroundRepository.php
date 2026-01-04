<?php

namespace App\Repositories\Eloquent;

use App\Models\CampingGround;
use App\Repositories\Contracts\CampingGroundRepositoryInterface;

class CampingGroundRepository implements CampingGroundRepositoryInterface
{
    public function getAllWithImages()
    {
        return CampingGround::select(
            'id',
            'name',
            'slug',
            'description',
            'location',
            'base_price'
        )
            ->with('campingGroundImages:id,camping_ground_id,image')
            ->get();
    }

    public function getBySlugWithDetails(string $slug)
    {
        return CampingGround::select(
            'id',
            'name',
            'slug',
            'description',
            'location',
            'base_price',
            'facilities',
            'rules'
        )
            ->with([
                'campingGroundImages:id,camping_ground_id,image',
                'campingGroundLayout:id,camping_ground_id,layout_image',
                'blocks:id,camping_ground_id,name,daily_price,is_active',
            ])
            ->where('slug', $slug)
            ->first();
    }
}
