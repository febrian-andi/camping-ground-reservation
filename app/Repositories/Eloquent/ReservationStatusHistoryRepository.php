<?php

namespace App\Repositories\Eloquent;

use App\Models\ReservationStatusHistory;
use App\Repositories\Contracts\ReservationStatusHistoryRepositoryInterface;

class ReservationStatusHistoryRepository implements ReservationStatusHistoryRepositoryInterface
{
    public function create(array $data)
    {
        return ReservationStatusHistory::create($data);
    }
}
