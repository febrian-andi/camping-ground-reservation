<?php

namespace App\Repositories\Contracts;

interface CampingGroundRepositoryInterface
{
    public function getAllWithImages();
    public function getBySlugWithDetails(string $slug);
}
