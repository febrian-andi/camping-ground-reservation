<?php

namespace App\Services\CampingGrounds;

use App\Repositories\Contracts\CampingGroundRepositoryInterface;

class CampingGroundService
{
    protected $campingGroundRepository;

    public function __construct(CampingGroundRepositoryInterface $campingGroundRepository)
    {
        $this->campingGroundRepository = $campingGroundRepository;
    }

    public function getExploreData()
    {
        return $this->campingGroundRepository->getAllWithImages();
    }

    public function getDetailBySlug(string $slug)
    {
        $campground = $this->campingGroundRepository->getBySlugWithDetails($slug);

        if (!$campground) {
            abort(404);
        }

        return $campground;
    }
}
