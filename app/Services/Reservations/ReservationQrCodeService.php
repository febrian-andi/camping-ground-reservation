<?php

namespace App\Services\Reservations;

use App\Models\Reservation;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class ReservationQrCodeService
{
    public function generateQRCode(string $reservationNumber)
    {
        $reservation = Reservation::where('reservation_number', $reservationNumber)->firstOrFail();
        return QrCode::format('svg')->size(200)->generate($reservation->reservation_number);
    }
}
