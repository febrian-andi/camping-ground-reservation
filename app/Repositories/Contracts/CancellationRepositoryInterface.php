<?php

namespace App\Repositories\Contracts;

interface CancellationRepositoryInterface
{
    public function create(array $data);
    public function findByReservationId(int $reservationId);
    public function updateStatus(int $id, string $status); // May need more fields like decided_at
    public function update(int $id, array $data);
}
