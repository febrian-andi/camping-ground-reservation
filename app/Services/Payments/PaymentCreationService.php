<?php

namespace App\Services\Payments;

use App\Models\Payment;

class PaymentCreationService
{
    public function create($data)
    {
        return Payment::create($data);
    }
}
