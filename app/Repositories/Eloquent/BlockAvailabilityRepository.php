<?php

namespace App\Repositories\Eloquent;

use App\Models\BlockAvailability;
use App\Repositories\Contracts\BlockAvailabilityRepositoryInterface;

class BlockAvailabilityRepository implements BlockAvailabilityRepositoryInterface
{
    public function createMany(array $data)
    {
        // $data is expected to be an array of arrays for bulk insert, 
        // OR we can loop. Eloquent createMany works on relationships. 
        // But for Model::insert or loop:
        foreach ($data as $item) {
            BlockAvailability::create($item);
        }
    }

    public function checkAvailability(int $blockId, array $dates)
    {
        return BlockAvailability::where('block_id', $blockId)
            ->whereIn('date', $dates)
            ->where('status', '!=', 'cancelled')
            ->count();
    }

    public function findConflictingBlocks(array $dates, int $campingGroundId)
    {
        return BlockAvailability::whereIn('date', $dates)
            ->whereIn('status', ['booked', 'maintenance'])
            ->whereHas('block', function ($query) use ($campingGroundId) {
                $query->where('camping_ground_id', $campingGroundId);
            })
            ->pluck('block_id')
            ->all();
    }

    public function updateStatusForReservation(int $reservationId, string $status)
    {
        BlockAvailability::where('reservation_id', $reservationId)
            ->update(['status' => $status]);
    }
}
