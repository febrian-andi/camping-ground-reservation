<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\BlockAvailability;
use App\Models\Reservation;
use App\Models\ReservationStatusHistory;
use App\Models\Payment;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with(['block.campingGround.campingGroundImages'])
            ->where('user_id', Auth::id())
            ->latest()
            ->get()
            ->map(function ($reservation) {
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
                    'total_nights' => $reservation->total_nights,
                    'status' => ucfirst($reservation->status),
                    'total_price' => number_format($reservation->total_price, 0, ',', '.'),
                ];
            });

        return Inertia::render('BookingHistoryPage', [
            'reservations' => $reservations
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'block_id' => 'required|exists:blocks,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'scheduled_check_in_time' => 'required|date_format:H:i',
            'payment_method' => 'required|in:transfer,on_arrival',
            'proof_image' => 'nullable|required_if:payment_method,transfer|image|max:2048',
        ]);

        $block = Block::findOrFail($request->block_id);
        $checkInDate = Carbon::parse($request->check_in_date);
        $checkOutDate = Carbon::parse($request->check_out_date);

        $scheduledCheckInTime = Carbon::createFromFormat('H:i', $request->scheduled_check_in_time);
        // Calculate check-out time: check-in time + 21 hours
        $durationHours = 21;
        $scheduledCheckOutTime = $scheduledCheckInTime->copy()->addHours($durationHours);

        $totalNights = $checkInDate->diffInDays($checkOutDate);

        if ($totalNights < 1) {
            return back()->withErrors(['check_out_date' => 'Durasi menginap minimal 1 malam.']);
        }

        $datesToCheck = [];
        $tempDate = $checkInDate->copy();
        while ($tempDate->lt($checkOutDate)) {
            $datesToCheck[] = $tempDate->format('Y-m-d');
            $tempDate->addDay();
        }

        try {
            DB::beginTransaction();

            // 1. Check Availability (Optimistic locking or explicit locking could be improved here, but transaction helps)
            // We lock the rows for update if they exist, or just check count.
            // A more robust way is to query overlap using a "whereIn" on dates and block_id
            $existingBookings = BlockAvailability::where('block_id', $block->id)
                ->whereIn('date', $datesToCheck)
                ->where('status', '!=', 'cancelled')
                ->lockForUpdate()
                ->count();

            if ($existingBookings > 0) {
                return back()->withErrors(['message' => 'Tidak tersedia pada tanggal yang dipilih.']);
            }

            // 2. Create Reservation
            $reservationNumber = 'CAMPRES-' . strtoupper(Str::random(8));
            // Ensure uniqueness
            while (Reservation::where('reservation_number', $reservationNumber)->exists()) {
                $reservationNumber = 'CAMPRES-' . strtoupper(Str::random(8));
            }

            $totalPrice = $block->daily_price * $totalNights;

            $reservation = Reservation::create([
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
            ]);

            // 3. Create Block Availability Records
            foreach ($datesToCheck as $date) {
                BlockAvailability::create([
                    'block_id' => $block->id,
                    'reservation_id' => $reservation->id,
                    'date' => $date, // Y-m-d matches the date type
                    'status' => 'booked',
                ]);
            }

            // 4. Create Status History
            ReservationStatusHistory::create([
                'reservation_id' => $reservation->id,
                'old_status' => null,
                'new_status' => 'pending',
                'note' => 'Reservasi dibuat oleh user.',
                'created_by' => Auth::id(),
            ]);

            // 5. Create Payment Record
            $proofPath = null;
            if ($request->payment_method === 'transfer' && $request->hasFile('proof_image')) {
                $proofPath = $request->file('proof_image')->store('payment_proofs', 'public');
            }

            Payment::create([
                'reservation_id' => $reservation->id,
                'user_id' => Auth::id(),
                'amount' => $totalPrice,
                'method' => $request->payment_method,
                'status' => 'pending',
                'proof_image' => $proofPath,
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Reservasi berhasil dibuat! Silahkan tunggu proses verifikasi dari admin.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Booking Error: ' . $e->getMessage());
            return back()->withErrors(['message' => 'Terjadi kesalahan saat memproses reservasi. Silahkan coba lagi.']);
        }
    }

    public function checkAvailability(Request $request)
    {
        $request->validate([
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'scheduled_check_in_time' => 'nullable|date_format:H:i',
            'scheduled_check_out_time' => 'nullable|date_format:H:i',
            'camping_ground_id' => 'required|exists:camping_grounds,id',
        ]);

        $checkInDate = Carbon::parse($request->check_in_date);
        $checkOutDate = Carbon::parse($request->check_out_date);

        // 1. Get unavailable blocks from BlockAvailability (dates fully booked/maintenance)
        $datesToCheck = [];
        $tempDate = $checkInDate->copy();
        while ($tempDate->lt($checkOutDate)) {
            $datesToCheck[] = $tempDate->format('Y-m-d');
            $tempDate->addDay();
        }

        $unavailableBlockIds = [];
        if (!empty($datesToCheck)) {
            $unavailableBlockIds = BlockAvailability::whereIn('date', $datesToCheck)
                ->whereIn('status', ['booked', 'maintenance'])
                ->whereHas('block', function ($query) use ($request) {
                    $query->where('camping_ground_id', $request->camping_ground_id);
                })
                ->pluck('block_id')
                ->all();
        }

        // 2. If scheduled_check_in_time is provided, check for time-based conflicts
        // Rule: New booking can only start 3 hours AFTER the previous booking's checkout.
        if ($request->scheduled_check_in_time) {
            // requested check-in timestamp
            $reqCheckIn = Carbon::parse($request->check_in_date . ' ' . $request->scheduled_check_in_time);

            // For check-out time, we estimate it or use simple logic. 
            // We mainly care if any EXISTING reservation conflicts with our START time.
            // Conflict if: Existing CheckOut + 3 Hours > Requested CheckIn
            // Only for reservations that overlap or touch our check-in date.

            $timeConflictBlockIds = Reservation::where('status', '!=', 'cancelled')
                ->whereHas('block', function ($query) use ($request) {
                    $query->where('camping_ground_id', $request->camping_ground_id);
                })
                ->where(function ($query) use ($reqCheckIn) {
                    // Check reservations that might conflict with our start time
                    $query->whereRaw(
                        "ADDTIME(CONCAT(check_out_date, ' ', scheduled_check_out_time), '02:59:00') > ?",
                        [$reqCheckIn->toDateTimeString()]
                    )
                        ->where('check_in_date', '<=', $reqCheckIn->format('Y-m-d'));
                })
                ->pluck('block_id')
                ->all();

            $unavailableBlockIds = array_merge($unavailableBlockIds, $timeConflictBlockIds);
        }


        return response()->json([
            'unavailable_block_ids' => array_values(array_unique($unavailableBlockIds))
        ]);
    }

    public function cancelBooking(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
        ]);

        $reservation = Reservation::findOrFail($request->reservation_id);

        if ($reservation->status !== 'pending') {
            return back()->withErrors(['message' => 'Reservasi tidak dapat dibatalkan karena statusnya bukan "pending".']);
        }


        try {
            DB::beginTransaction();

            // Update reservation status
            $reservation->update([
                'status' => 'cancelled',
            ]);

            // Update block availability status
            $reservation->blockAvailabilities()->update([
                'status' => 'cancelled',
            ]);

            // Update payment status
            $reservation->payments()->update([
                'status' => 'failed',
            ]);

            //Create history for reservation status
            ReservationStatusHistory::create([
                'reservation_id' => $reservation->id,
                'old_status' => 'pending',
                'new_status' => 'cancelled',
                'note' => 'Reservasi dibatalkan oleh user.',
                'created_by' => Auth::id(),
            ]);

            DB::commit();

            return redirect()->route('booking-history')->with('success', 'Reservasi berhasil dibatalkan!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Booking Cancel Error: ' . $e->getMessage());
            return back()->withErrors(['message' => 'Terjadi kesalahan saat membatalkan reservasi. Silahkan coba lagi.']);
        }
    }
}
