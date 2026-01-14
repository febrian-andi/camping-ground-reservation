<?php

namespace App\Filament\Resources\CheckInCheckOuts\Pages;

use App\Filament\Resources\CheckInCheckOuts\CheckInCheckOutResource;
use App\Models\Reservation;
use App\Services\Reservations\ReservationStatusService;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ManageRecords;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;

class ManageCheckInCheckOuts extends ManageRecords
{
    protected static string $resource = CheckInCheckOutResource::class;

    public function getTitle(): string
    {
        return 'Check-In / Check-Out';
    }


    // protected function getHeaderActions(): array
    // {
    //     return [
    //         Action::make('scan_qr')
    //             ->label('Scan QR')
    //             ->icon('heroicon-o-qr-code')
    //             ->modalContent(view('filament.pages.qr-scanner'))
    //             ->modalSubmitAction(false)
    //             ->modalCancelAction(false)
    //             ->slideOver(),
    //         CreateAction::make(),
    //     ];
    // }

    public function handleQrScan($code)
    {
        $reservation = Reservation::where('reservation_number', $code)->first();

        if (! $reservation) {
            Notification::make()
                ->title('Reservation Not Found')
                ->body("No reservation found for code: {$code}")
                ->danger()
                ->send();
            return;
        }

        if ($reservation->status !== 'confirmed' || $reservation->payment_status !== 'full_paid') {
            Notification::make()
                ->title('Invalid Reservation Status')
                ->body('Reservation must be Confirmed and Fully Paid.')
                ->danger()
                ->send();
            return;
        }

        if ($reservation->actual_check_in_time === null) {
            // Check In
            $reservation->update(['actual_check_in_time' => now()]);
            Notification::make()
                ->title('Check-in Successful')
                ->body("Reservation {$reservation->reservation_number} checked in.")
                ->success()
                ->send();
        } elseif ($reservation->actual_check_out_time === null) {
            // Check Out
            $reservation->update(['actual_check_out_time' => now()]);
            app(ReservationStatusService::class)->changeStatus($reservation->id, 'completed');

            Notification::make()
                ->title('Check-out Successful')
                ->body("Reservation {$reservation->reservation_number} checked out.")
                ->success()
                ->send();
        } else {
            Notification::make()
                ->title('Already Completed')
                ->body("Reservation {$reservation->reservation_number} already checked out.")
                ->warning()
                ->send();
        }

        // Refresh the table to show updates
        $this->dispatch('$refresh');
    }

    public function getTabs(): array
    {
        return [
            'all' => Tab::make('All'),
            'to_check_in' => Tab::make('To Check-In')
                ->modifyQueryUsing(fn(Builder $query) => $query->whereNull('actual_check_in_time')),
            'to_check_out' => Tab::make('To Check-Out')
                ->modifyQueryUsing(fn(Builder $query) => $query->whereNotNull('actual_check_in_time')->whereNull('actual_check_out_time')),
            'completed' => Tab::make('Completed')
                ->modifyQueryUsing(fn(Builder $query) => $query->whereNotNull('actual_check_out_time')),
        ];
    }
}
