<?php

namespace App\Repositories\Contracts;

interface BlockAvailabilityRepositoryInterface
{
    public function createMany(array $data);
    public function checkAvailability(int $blockId, array $dates);
    public function findConflictingBlocks(array $dates, int $campingGroundId);
    public function updateStatusForReservation(int $reservationId, string $status);
}
