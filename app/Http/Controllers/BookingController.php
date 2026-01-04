<?php

namespace App\Http\Controllers;

use App\Services\Reservations\ReservationQueryService;
use App\Services\Reservations\ReservationCreationService;
use App\Services\Reservations\ReservationCancellationService;
use App\Services\Reservations\ReservationQrCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BookingController extends Controller
{
    protected $queryService;
    protected $creationService;
    protected $cancellationService;
    protected $qrCodeService;

    public function __construct(
        ReservationQueryService $queryService,
        ReservationCreationService $creationService,
        ReservationCancellationService $cancellationService,
        ReservationQrCodeService $qrCodeService
    ) {
        $this->queryService = $queryService;
        $this->creationService = $creationService;
        $this->cancellationService = $cancellationService;
        $this->qrCodeService = $qrCodeService;
    }

    public function generateQRCode(string $reservationNumber)
    {
        try {
            $qrCode = $this->qrCodeService->generateQRCode($reservationNumber);
            return response($qrCode)->header('Content-Type', 'image/svg+xml');
        } catch (\Exception $e) {
            return response()->json(['message' => 'QR Code not found'], 404);
        }
    }

    public function index()
    {
        $reservations = $this->queryService->getUserReservations();

        return Inertia::render('BookingHistoryPage', [
            'reservations' => $reservations
        ]);
    }

    public function show(int $id)
    {
        try {
            $data = $this->queryService->getReservationDetail($id);
            return response()->json($data);
        } catch (\Exception $e) {
            $status = $e->getCode() === 401 ? 401 : 404;
            return response()->json(['message' => $e->getMessage()], $status);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'block_id' => 'required|exists:blocks,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'scheduled_check_in_time' => 'required|date_format:H:i',
            'payment_type' => 'required|in:partial_paid,full_paid',
            'payment_method' => 'required|in:transfer,cash,qris',
            'payment_provider' => 'required|string',
            'proof_image' => 'nullable|required|image|max:2048',
        ]);

        try {
            $this->creationService->createReservation(array_merge($validated, [
                'proof_image' => $request->file('proof_image')
            ]));

            return redirect()->back()->with('success', 'Reservasi berhasil dibuat! Silahkan tunggu proses verifikasi dari admin.');
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['check_out_date' => $e->getMessage()]);
        } catch (\Exception $e) {
            Log::error('Booking Error: ' . $e->getMessage());
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    public function checkAvailability(Request $request)
    {
        $validated = $request->validate([
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'scheduled_check_in_time' => 'nullable|date_format:H:i',
            'scheduled_check_out_time' => 'nullable|date_format:H:i',
            'camping_ground_id' => 'required|exists:camping_grounds,id',
        ]);

        $unavailableBlockIds = $this->creationService->checkAvailability($validated);

        return response()->json([
            'unavailable_block_ids' => $unavailableBlockIds
        ]);
    }

    public function cancelBooking(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id',
            'reason' => 'required|string|max:1000',
        ]);

        try {
            $this->cancellationService->submitCancellationRequest($validated);
            return redirect()
                ->route('booking-history')
                ->with('success', 'Permintaan pembatalan berhasil dikirim!');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
