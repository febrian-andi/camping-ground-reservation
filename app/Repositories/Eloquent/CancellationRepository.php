<?php

namespace App\Repositories\Eloquent;

use App\Models\ReservationCancellationRequest;
use App\Repositories\Contracts\CancellationRepositoryInterface;

class CancellationRepository implements CancellationRepositoryInterface
{
    public function create(array $data)
    {
        return ReservationCancellationRequest::create($data);
    }

    public function findByReservationId(int $reservationId)
    {
        return ReservationCancellationRequest::where('reservation_id', $reservationId)->first();
    }

    public function updateStatus(int $id, string $status)
    {
        $request = ReservationCancellationRequest::findOrFail($id);
        $request->update(['status' => $status]);
        return $request;
    }

    public function update(int $id, array $data)
    {
        $request = ReservationCancellationRequest::findOrFail($id);
        $request->update($data);
        return $request;
    }
}
