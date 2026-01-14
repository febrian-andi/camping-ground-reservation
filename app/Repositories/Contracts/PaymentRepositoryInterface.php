<?php

namespace App\Repositories\Contracts;

interface PaymentRepositoryInterface
{
    public function create(array $data);
    public function find(int $id);
}
