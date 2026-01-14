<?php

namespace App\Services\Payments;

use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\Contracts\ReservationStatusHistoryRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PaymentStatusService
{
    protected $paymentRepository;
    protected $statusHistoryRepository;

    public function __construct(
        PaymentRepositoryInterface $paymentRepository,
        ReservationStatusHistoryRepositoryInterface $statusHistoryRepository
    ) {
        $this->paymentRepository = $paymentRepository;
        $this->statusHistoryRepository = $statusHistoryRepository;
    }

    public function changeStatus(int $id, string $status)
    {
        if (! in_array($status, ['pending', 'verified', 'failed', 'refunded'])) {
            throw new \InvalidArgumentException('Invalid payment status');
        }

        DB::beginTransaction();
        try {

            $payment = $this->paymentRepository->find($id);

            if (! $payment) {
                throw new \InvalidArgumentException('Payment not found');
            }

            if ($payment->status === $status) {
                throw new \InvalidArgumentException('Payment status is already ' . $status);
            }

            $payment->update(['status' => $status]);

            switch ($status) {
                case 'pending':
                    $payment->reservation->update(['payment_status' => 'pending']);
                    break;
                case 'verified':
                    $payment->amount === $payment->reservation->total_price
                        ? $payment->reservation->update(['payment_status' => 'full_paid'])
                        : $payment->reservation->update(['payment_status' => 'partial_paid']);
                    break;
                case 'failed':
                    $payment->reservation->update(['payment_status' => 'failed']);
                    $this->statusHistoryRepository->create([
                        'reservation_id' => $payment->reservation_id,
                        'old_status' => $payment->reservation->status,
                        'new_status' => $status,
                        'note' => 'Verifikasi pembayaran ' . $payment->amount . ' ditolak oleh ' . Auth::user()->name,
                        'created_by' => Auth::user()->id,
                    ]);
                    break;
                case 'refunded':
                    $payment->reservation->update(['payment_status' => 'refunded']);
                    break;
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
