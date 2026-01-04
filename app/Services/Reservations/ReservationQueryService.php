<?php

namespace App\Services\Reservations;

use App\Repositories\Contracts\ReservationRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class ReservationQueryService
{
    private function formatReservationData($reservation)
    {
        return [
            'id' => $reservation->id,
            'reservation_number' => $reservation->reservation_number,
            'camping_ground_name' => $reservation->block->campingGround->name,
            'camping_ground_image' => $reservation->block->campingGround->campingGroundImages->first()?->image_path
                ? '/storage/' . $reservation->block->campingGround->campingGroundImages->first()->image_path
                : 'https://placehold.co/800x600?text=No+Image',
            'block_name' => $reservation->block->name,
            'check_in_date' => $reservation->check_in_date,
            'check_out_date' => $reservation->check_out_date,
            'scheduled_check_in_time' => $reservation->scheduled_check_in_time,
            'scheduled_check_out_time' => $reservation->scheduled_check_out_time,
            'actual_check_in_time' => $reservation->actual_check_in_time ?? null,
            'actual_check_out_time' => $reservation->actual_check_out_time ?? null,
            'total_nights' => $reservation->total_nights,
            'status' => $reservation->status,
            'payment_status' => $reservation->payment_status,
            'reservation_cancellation_request_status' => $reservation->reservationCancellationRequest->status ?? null,
            'total_price' => number_format($reservation->total_price, 0, ',', '.'),
        ];
    }

    protected $reservationRepository;

    public function __construct(ReservationRepositoryInterface $reservationRepository)
    {
        $this->reservationRepository = $reservationRepository;
    }

    public function getUserReservations()
    {
        return $this->reservationRepository->getByUser(Auth::id())
            ->map(fn($reservation) => $this->formatReservationData($reservation));
    }

    public function getReservationDetail(int $id)
    {
        $reservation = $this->reservationRepository->findWithDetails($id);

        $authorizedUser = Auth::user()->id === $reservation->user_id;

        if (Auth::user()->role === 'user' && !$authorizedUser) {
            throw new \Exception('Unauthorized', 401);
        }

        return array_merge($this->formatReservationData($reservation), [
            'status_history' => $reservation->reservationStatusHistories->map(function ($statusHistory) {
                return [
                    'id' => $statusHistory->id,
                    'new_status' => $statusHistory->new_status,
                    'note' => $statusHistory->note,
                    'created_at' => $statusHistory->created_at,
                ];
            }),
            'payments' => $reservation->payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'method' => $payment->method,
                    'payment_provider' => $payment->payment_provider,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'created_at' => $payment->created_at,
                ];
            }),
            'reservation_cancellation_request' => $reservation->reservationCancellationRequest
                ? [
                    'id' => $reservation->reservationCancellationRequest->id,
                    'status' => $reservation->reservationCancellationRequest->status,
                    'note' => $reservation->reservationCancellationRequest->note,
                    'created_at' => $reservation->reservationCancellationRequest->created_at,
                ]
                : null,
        ]);
    }
}
