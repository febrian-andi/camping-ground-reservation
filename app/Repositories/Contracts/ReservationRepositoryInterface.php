<?php

namespace App\Repositories\Contracts;

interface ReservationRepositoryInterface
{
    public function getByUser(int $userId);
    public function findWithDetails(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function existsByNumber(string $number);
    public function findConflictingReservations(int $campingGroundId, string $checkInDate, string $checkOutDate, ?string $reqCheckInDateTime = null);
}
