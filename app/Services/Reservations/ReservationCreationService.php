<?php

namespace App\Services\Reservations;

use App\Repositories\Contracts\BlockRepositoryInterface;
use App\Repositories\Contracts\BlockAvailabilityRepositoryInterface;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use App\Repositories\Contracts\ReservationStatusHistoryRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReservationCreationService
{
    protected $blockRepository;
    protected $blockAvailabilityRepository;
    protected $reservationRepository;
    protected $paymentRepository;
    protected $statusHistoryRepository;

    public function __construct(
        BlockRepositoryInterface $blockRepository,
        BlockAvailabilityRepositoryInterface $blockAvailabilityRepository,
        ReservationRepositoryInterface $reservationRepository,
        PaymentRepositoryInterface $paymentRepository,
        ReservationStatusHistoryRepositoryInterface $statusHistoryRepository
    ) {
        $this->blockRepository = $blockRepository;
        $this->blockAvailabilityRepository = $blockAvailabilityRepository;
        $this->reservationRepository = $reservationRepository;
        $this->paymentRepository = $paymentRepository;
        $this->statusHistoryRepository = $statusHistoryRepository;
    }

    public function createReservation($data)
    {
        $block = $this->blockRepository->find($data['block_id']);
        $checkInDate = Carbon::parse($data['check_in_date']);
        $checkOutDate = Carbon::parse($data['check_out_date']);

        $scheduledCheckInTime = Carbon::createFromFormat('H:i', $data['scheduled_check_in_time']);
        $durationHours = 21;
        $scheduledCheckOutTime = $scheduledCheckInTime->copy()->addHours($durationHours);

        $totalNights = $checkInDate->diffInDays($checkOutDate);

        if ($totalNights < 1) {
            throw new \InvalidArgumentException('Durasi menginap minimal 1 malam.');
        }

        $datesToCheck = [];
        $tempDate = $checkInDate->copy();
        while ($tempDate->lt($checkOutDate)) {
            $datesToCheck[] = $tempDate->format('Y-m-d');
            $tempDate->addDay();
        }

        DB::beginTransaction();
        try {
            $existingBookings = $this->blockAvailabilityRepository->checkAvailability($block->id, $datesToCheck);


            if ($existingBookings > 0) {
                throw new \Exception('Tidak tersedia pada tanggal yang dipilih.');
            }

            $reservationNumber = 'CAMPRES-' . strtoupper(Str::random(8));
            while ($this->reservationRepository->existsByNumber($reservationNumber)) {
                $reservationNumber = 'CAMPRES-' . strtoupper(Str::random(8));
            }

            $totalPrice = $block->daily_price * $totalNights;

            $reservation = $this->reservationRepository->create([
                'reservation_number' => $reservationNumber,
                'user_id' => Auth::id(),
                'block_id' => $block->id,
                'check_in_date' => $checkInDate->format('Y-m-d'),
                'check_out_date' => $checkOutDate->format('Y-m-d'),
                'scheduled_check_in_time' => $scheduledCheckInTime->format('H:i:s'),
                'scheduled_check_out_time' => $scheduledCheckOutTime->format('H:i:s'),
                'total_nights' => $totalNights,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            $availabilityData = [];
            foreach ($datesToCheck as $date) {
                $availabilityData[] = [
                    'block_id' => $block->id,
                    'reservation_id' => $reservation->id,
                    'date' => $date,
                    'status' => 'booked',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            $this->blockAvailabilityRepository->createMany($availabilityData);

            $this->statusHistoryRepository->create([
                'reservation_id' => $reservation->id,
                'old_status' => null,
                'new_status' => 'pending',
                'note' => 'Reservasi dibuat oleh ' . Auth::user()->name . '.',
                'created_by' => Auth::id(),
            ]);

            $amount = $data['payment_type'] === 'partial_paid' ? $totalPrice * 0.5 : $totalPrice;

            $proofPath = $data['proof_image']->store('payment_proofs', 'public');

            $this->paymentRepository->create([
                'reservation_id' => $reservation->id,
                'user_id' => Auth::id(),
                'amount' => $amount,
                'method' => $data['payment_method'],
                'payment_provider' => $data['payment_provider'],
                'status' => 'pending',
                'proof_image' => $proofPath,
            ]);

            DB::commit();
            return $reservation;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function checkAvailability($data)
    {
        $checkInDate = Carbon::parse($data['check_in_date']);
        $checkOutDate = Carbon::parse($data['check_out_date']);

        $datesToCheck = [];
        $tempDate = $checkInDate->copy();
        while ($tempDate->lt($checkOutDate)) {
            $datesToCheck[] = $tempDate->format('Y-m-d');
            $tempDate->addDay();
        }

        $unavailableBlockIds = [];
        if (!empty($datesToCheck)) {
            $unavailableBlockIds = $this->blockAvailabilityRepository->findConflictingBlocks($datesToCheck, $data['camping_ground_id']);
        }

        if (isset($data['scheduled_check_in_time'])) {
            $reqCheckIn = Carbon::parse($data['check_in_date'] . ' ' . $data['scheduled_check_in_time']);

            $timeConflictBlockIds = $this->reservationRepository->findConflictingReservations(
                $data['camping_ground_id'],
                $data['check_in_date'],
                $data['check_out_date'],
                $reqCheckIn->toDateTimeString()
            );

            $unavailableBlockIds = array_merge($unavailableBlockIds, $timeConflictBlockIds);
        }

        return array_values(array_unique($unavailableBlockIds));
    }
}
