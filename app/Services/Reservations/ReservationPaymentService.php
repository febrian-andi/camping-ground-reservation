<?php

namespace App\Services\Reservations;

use App\Models\Reservation;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Exception;

class ReservationPaymentService
{
    protected $paymentRepository;

    public function __construct(PaymentRepositoryInterface $paymentRepository)
    {
        $this->paymentRepository = $paymentRepository;
    }

    public function markAsFullPaid(Reservation $reservation, array $paymentData, int $userId)
    {
        $totalPaid = $reservation->getTotalPaidAttribute();
        $remainingBalance = $reservation->total_price - $totalPaid['amount'];

        if ($remainingBalance <= 0) {
            throw new Exception('Reservation is already fully paid');
        }

        DB::beginTransaction();

        try {
            $this->paymentRepository->create([
                'reservation_id' => $reservation->id,
                'user_id' => $userId,
                'amount' => $remainingBalance,
                'method' => $paymentData['method'],
                'payment_provider' => $paymentData['payment_provider'] ?? null,
                'status' => 'verified',
            ]);

            $reservation->update(['payment_status' => 'full_paid']);

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
