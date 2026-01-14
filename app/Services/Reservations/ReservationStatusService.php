<?php

namespace App\Services\Reservations;

use App\Models\Reservation;
use App\Models\ReservationStatusHistory;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use App\Repositories\Contracts\ReservationStatusHistoryRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReservationStatusService
{
    protected $reservationRepository;
    protected $paymentRepository;
    protected $statusHistoryRepository;

    public function __construct(
        ReservationRepositoryInterface $reservationRepository,
        PaymentRepositoryInterface $paymentRepository,
        ReservationStatusHistoryRepositoryInterface $statusHistoryRepository
    ) {
        $this->reservationRepository = $reservationRepository;
        $this->paymentRepository = $paymentRepository;
        $this->statusHistoryRepository = $statusHistoryRepository;
    }

    public function createStatusHistory(string $id, string $oldStatus, string $newStatus, ?string $note = null)
    {
        $this->statusHistoryRepository->create([
            'reservation_id' => $id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'note' => $note,
            'created_by' => Auth::user()->id,
        ]);
    }

    public function changeStatus(string $id, string $status, ?string $note = null)
    {
        if (! in_array($status, ['pending', 'confirmed', 'completed', 'rejected', 'cancelled'])) {
            throw new \InvalidArgumentException('Invalid status');
        }

        DB::beginTransaction();
        try {

            $reservation = $this->reservationRepository->findWithDetails($id);
            $reservation->update(['status' => $status]);

            if ($status === 'rejected') {
                $this->reservationRepository->update($reservation->id, ['status' => 'rejected']);
                $note = 'Reservasi ditolak oleh ' . Auth::user()->name;
            } else if ($status === 'confirmed') {
                $this->reservationRepository->update($reservation->id, ['status' => 'confirmed']);
                $note = 'Reservasi dikonfirmasi oleh ' . Auth::user()->name;
            } else if ($status === 'cancelled') {
                $this->reservationRepository->update($reservation->id, ['status' => 'cancelled']);
                $note = 'Pengajuan pembatalan dikonfirmasi oleh ' . Auth::user()->name;
            } else if ($status === 'completed') {
                $this->reservationRepository->update($reservation->id, ['status' => 'completed']);
                $note = 'Pengunjung telah check-out';
            }

            $this->createStatusHistory($reservation->id, $reservation->status, $status, $note);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
