<?php

namespace App\Repositories\Eloquent;

use App\Models\Reservation;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ReservationRepository implements ReservationRepositoryInterface
{
    public function getByUser(int $userId)
    {
        return Reservation::with(['block.campingGround.campingGroundImages'])
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }

    public function findWithDetails(int $id)
    {
        return Reservation::with([
            'block.campingGround.campingGroundImages',
            'payments',
            'reservationStatusHistories',
            'reservationCancellationRequest',
            'blockAvailabilities'
        ])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Reservation::create($data);
    }

    public function update(int $id, array $data)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($data);
        return $reservation;
    }

    public function existsByNumber(string $number)
    {
        return Reservation::where('reservation_number', $number)->exists();
    }

    public function findConflictingReservations(int $campingGroundId, string $checkInDate, string $checkOutDate, ?string $reqCheckInDateTime = null)
    {
        // This is complex logic used in checkAvailability
        // Moving the query logic here

        // Base query for block availability conflicts (booked/maintenance) is handled by BlockAvailabilityRepository usually.
        // This method specifically handles the time-based conflicts on the same block if needed, 
        // OR returns reservations that conflict.

        // Actually, ReservationCreationService::checkAvailability calls Reservation::where(...) 
        // to check "Time Conflict".

        $query = Reservation::where('status', '!=', 'cancelled')
            ->whereHas('block', function ($query) use ($campingGroundId) {
                $query->where('camping_ground_id', $campingGroundId);
            });

        if ($reqCheckInDateTime) {
            $query->where(function ($q) use ($reqCheckInDateTime) {
                $q->whereRaw(
                    "ADDTIME(CONCAT(check_out_date, ' ', scheduled_check_out_time), '02:59:00') > ?",
                    [$reqCheckInDateTime]
                )
                    ->where('check_in_date', '<=', substr($reqCheckInDateTime, 0, 10));
            });
        }

        return $query->pluck('block_id')->all();
    }
}
