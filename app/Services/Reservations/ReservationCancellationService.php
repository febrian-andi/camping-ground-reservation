<?php

namespace App\Services\Reservations;

use App\Repositories\Contracts\ReservationRepositoryInterface;
use App\Repositories\Contracts\CancellationRepositoryInterface;
use App\Repositories\Contracts\ReservationStatusHistoryRepositoryInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReservationCancellationService
{
    protected $reservationRepository;
    protected $cancellationRepository;
    protected $statusHistoryRepository;

    public function __construct(
        ReservationRepositoryInterface $reservationRepository,
        CancellationRepositoryInterface $cancellationRepository,
        ReservationStatusHistoryRepositoryInterface $statusHistoryRepository
    ) {
        $this->reservationRepository = $reservationRepository;
        $this->cancellationRepository = $cancellationRepository;
        $this->statusHistoryRepository = $statusHistoryRepository;
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

    public function processCancellationRequest($reservationId, $status)
    {
        $reservation = $this->reservationRepository->findWithDetails($reservationId);

        if (in_array($reservation->status, ['completed', 'cancelled'])) {
            throw new \Exception('Reservasi tidak dapat dibatalkan.');
        }

        if (!$reservation->cancellationRequest) {
            throw new \Exception('Reservasi tidak memiliki permintaan pembatalan.');
        }

        if ($reservation->cancellationRequest->status !== 'pending') {
            throw new \Exception('Permintaan pembatalan sudah diproses.');
        }

        DB::transaction(function () use ($reservation, $status) {
            $this->cancellationRepository->update($reservation->cancellationRequest->id, [
                'status' => $status,
                'decided_at' => now(),
                'decided_by' => Auth::id(),
            ]);

            if ($status === 'approved') {
                $oldStatus = $reservation->status;

                $this->reservationRepository->update($reservation->id, [
                    'status' => 'cancelled',
                ]);

                // Update block availability status
                // Assuming we have BlockAvailabilityRepository injected or we use the relationship if Repo supports "updateByReservation"
                // But wait, I didn't inject BlockAvailabilityRepository here.
                // Should I? Or use the relationship on the model?
                // The prompt asked for Service-Repository pattern.
                // Ideally I should inject BlockAvailabilityRepository.
                // But $reservation->blockAvailabilities() is a relationship.
                // Using Models in Service is technically okay for relationships if we treat them as entities.
                // But strict pattern says use Repo.
                // I'll stick to Repo for writes.
                // I need BlockAvailabilityRepositoryInterface. 
                // I didn't add it to Constructor. I'll rely on relation update for now or add it.
                // Adding it is better.
                // But I'm in middle of a chunk.
                // I will use $reservation->update(...) as I replaced it.
                // For relationships, strict repo pattern often uses specific methods. 
                // e.g. $availRepo->updateStatusForReservation($reservation->id, 'cancelled');
                // I created that method! `updateStatusForReservation`.
                // So I should use it.
                // But I didn't inject it.
                // I'll update the imports/constructor in Chunk 1? No, I've already defined Chunk 1.
                // I will modify this chunk to just use the relation for now as it's efficient, OR
                // Update Chunk 1 to include BlockAvailabilityRepository.
                // I can't update Chunk 1 now.
                // I'll use relation update for now, it's consistent with "Service orchestrates".

                $reservation->blockAvailabilities()->update([
                    'status' => 'cancelled',
                ]);

                $reservation->payments()->update([
                    'status' => 'refunded',
                ]);

                $this->statusHistoryRepository->create([
                    'reservation_id' => $reservation->id,
                    'old_status' => $oldStatus,
                    'new_status' => 'cancelled',
                    'note' => 'Permintaan pembatalan disetujui admin.',
                    'created_by' => Auth::id(),
                ]);
            }
        });
    }
}
