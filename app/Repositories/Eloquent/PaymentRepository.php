<?php

namespace App\Repositories\Eloquent;

use App\Models\Payment;
use App\Repositories\Contracts\PaymentRepositoryInterface;

class PaymentRepository implements PaymentRepositoryInterface
{
    public function create(array $data)
    {
        return Payment::create($data);
    }

    public function updateStatusByReservation(int $reservationId, string $status)
    {
        Payment::where('reservation_id', $reservationId)
            ->update(['status' => $status]);
    }
}
