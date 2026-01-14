<?php

namespace App\Services\Reservations;

use App\Models\ReservationCancellationRequest;
use App\Repositories\Contracts\CancellationRepositoryInterface;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use App\Services\Payments\PaymentCreationService;
use App\Services\Reservations\ReservationStatusService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReservationCancellationService
{
    protected $reservationRepository;
    protected $cancellationRepository;
    protected $reservationStatusService;
    protected $paymentCreationService;

    public function __construct(
        ReservationRepositoryInterface $reservationRepository,
        CancellationRepositoryInterface $cancellationRepository,
        ReservationStatusService $reservationStatusService,
        PaymentCreationService $paymentCreationService
    ) {
        $this->reservationRepository = $reservationRepository;
        $this->cancellationRepository = $cancellationRepository;
        $this->reservationStatusService = $reservationStatusService;
        $this->paymentCreationService = $paymentCreationService;
    }

    public function submitCancellationRequest($data)
    {
        $reservation = $this->reservationRepository->findWithDetails($data['reservation_id']);

        if ($reservation->user_id !== Auth::id()) {
            throw new \Exception('Anda tidak memiliki izin untuk membatalkan reservasi ini.');
        }

        if ($reservation->status === 'completed') {
            throw new \Exception('Pengajuan pembatalan tidak dapat dibuat karena status reservasi sudah selesai.');
        }

        if ($reservation->status === 'confirmed' && $reservation->actual_check_in_time !== null) {
            throw new \Exception('Pengajuan pembatalan tidak dapat dibuat karena status reservasi sudah check-in.');
        }

        if ($reservation->status === 'cancelled') {
            throw new \Exception('Status reservasi sudah dibatalkan.');
        }


        $reservationCancellationRequest = $this->cancellationRepository->findByReservationId($reservation->id);

        if ($reservationCancellationRequest) {
            throw new \Exception('Reservasi sudah memiliki permintaan pembatalan.');
        }

        return $this->cancellationRepository->create([
            'reservation_id' => $reservation->id,
            'reason' => $data['reason'],
            'status' => 'pending',
            'requested_at' => now(),
        ]);
    }

    public function approve(ReservationCancellationRequest $request, array $refundData = [])
    {
        try {
            DB::beginTransaction();

            $payments = $request->reservation->payments()->where('status', 'verified')->get();
            $totalAmount = $payments->sum('amount');

            if ($totalAmount === 0) {
                throw new \Exception('Tidak ada pembayaran yang ditemukan untuk reservasi ini.');
            }

            $this->reservationStatusService->changeStatus(
                $request->reservation_id,
                'cancelled',
            );

            $request->reservation->update([
                'payment_status' => 'refunded',
            ]);

            $totalRefundAmount = $totalAmount;

            if ($totalAmount === $request->reservation->total_price && $request->reservation->payment_status === 'full_paid') {
                $totalRefundAmount = $totalAmount * 0.5;
            }

            $this->paymentCreationService->create([
                'reservation_id' => $request->reservation_id,
                'user_id' => Auth::id(),
                'amount' => $totalRefundAmount,
                'method' => 'transfer',
                'payment_provider' => null,
                'status' => 'refunded',
                'proof_image' => $refundData['proof_image'] ?? null,
                'created_at' => now(),
            ]);

            $request->reservation->blockAvailabilities()->update([
                'status' => 'cancelled',
            ]);

            $request->update([
                'status' => 'approved',
                'decided_at' => now(),
                'decided_by' => Auth::id(),
            ]);

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function reject(ReservationCancellationRequest $request)
    {
        $request->update([
            'status' => 'rejected',
            'decided_at' => now(),
            'decided_by' => Auth::id(),
        ]);
    }
}
