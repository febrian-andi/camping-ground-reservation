<?php

namespace App\Filament\Resources\Reservations\Pages;

use App\Filament\Resources\Reservations\ReservationResource;
use App\Models\Reservation;
use App\Services\Reservations\ReservationStatusService;
use App\Services\Reservations\ReservationPaymentService;
use Filament\Actions\Action;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;
use Filament\Schemas\Components\Utilities\Get as UtilitiesGet;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\HtmlString;

class ViewReservation extends ViewRecord
{
    protected static string $resource = ReservationResource::class;

    public function getSubheading(): string | Htmlable | null
    {
        $record = $this->getRecord();

        return match (true) {
            $record->status === 'cancelled'
            => $this->badge('Status : Reservation Cancelled', 'danger'),

            $record->status === 'rejected'
            => $this->badge('Status : Reservation Rejected', 'danger'),

            $record->status === 'completed'
            => $this->badge('Status : Reservation Completed', 'success'),

            $record->status === 'confirmed' && $record->payment_status === 'full_paid'
            => $this->badge('Status : Confirmed (Paid in Full)', 'success'),

            $record->status === 'confirmed' && $record->payment_status === 'partial_paid'
            => $this->badge('Status : Confirmed (Partially Paid/50%)', 'success'),

            default => null,
        };
    }

    protected function badge(string $text, string $color): HtmlString
    {
        return new HtmlString(
            view('filament::components.badge', [
                'color' => $color,
                'slot'  => $text,
            ])->render()
        );
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('verify_payments')
                ->label('Review payment before approval')
                ->color('warning')
                ->icon('heroicon-o-clock')
                ->visible(
                    fn(Reservation $record) =>
                    $record->status === 'pending'
                        && $record->payments()->where('status', 'pending')->exists()
                )
                ->action(
                    fn(Reservation $record) =>
                    redirect()->route(
                        'filament.admin.resources.reservations.view',
                        ['record' => $record->getKey(), 'tab' => 'payment-history::tab']
                    )
                ),

            Action::make('approve')
                ->color('success')
                ->icon('heroicon-o-check-circle')
                ->requiresConfirmation()
                ->visible(
                    fn(Reservation $record) =>
                    $record->status === 'pending'
                        && ! $record->payments()->whereNotIn('status', ['success', 'verified'])->exists()
                )
                ->action(function (Reservation $record) {
                    try {
                        app(ReservationStatusService::class)->changeStatus($record->id, 'confirmed');

                        Notification::make()
                            ->title('Reservation confirmed')
                            ->success()
                            ->send();

                        $record->refresh();
                    } catch (\Exception $e) {
                        Notification::make()
                            ->title('Error')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            Action::make('reject')
                ->color('danger')
                ->icon('heroicon-o-x-circle')
                ->requiresConfirmation()
                ->schema([
                    Textarea::make('reason')->required(),
                ])
                ->visible(
                    fn(Reservation $record) =>
                    $record->status === 'pending'
                        && ! $record->payments()->whereNotIn('status', ['success', 'verified'])->exists()
                )
                ->action(function (Reservation $record, array $data) {
                    try {
                        app(ReservationStatusService::class)
                            ->changeStatus($record->id, 'rejected', $data['reason']);

                        Notification::make()
                            ->title('Reservation rejected')
                            ->danger()
                            ->send();

                        $record->refresh();
                    } catch (\Exception $e) {
                        Notification::make()
                            ->title('Error')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            Action::make('mark_as_full_paid')
                ->label('Mark as Full Paid')
                ->color('success')
                ->icon('heroicon-o-check-badge')
                ->requiresConfirmation()
                ->modalHeading('Mark Reservation as Fully Paid')
                ->modalDescription('This will create a new verified payment for the remaining balance and mark the reservation as fully paid.')
                ->schema([
                    Select::make('method')
                        ->label('Payment Method')
                        ->options([
                            'TRANSFER' => 'Transfer',
                            'QRIS' => 'QRIS',
                            'CASH' => 'Cash',
                        ])
                        ->live()
                        ->required(),
                    Select::make('payment_provider')
                        ->label('Payment Provider')
                        ->options([
                            'BCA' => 'BCA',
                            'BRI' => 'BRI',
                            'MANDIRI' => 'MANDIRI',
                            'BNI' => 'BNI',
                        ])
                        ->visible(fn(UtilitiesGet $get) => $get('method') === 'TRANSFER')
                        ->required(),
                ])
                ->visible(
                    fn(Reservation $record) =>
                    $record->status === 'confirmed'
                        && $record->payment_status === 'partial_paid'
                )
                ->action(function (Reservation $record, array $data, Action $action) {
                    try {
                        app(ReservationPaymentService::class)->markAsFullPaid(
                            $record,
                            $data,
                            Auth::user()->id
                        );

                        Notification::make()
                            ->title('Reservation marked as full paid')
                            ->success()
                            ->send();

                        $action->getRecord()->refresh();
                    } catch (\Exception $e) {
                        Notification::make()
                            ->title($e->getMessage())
                            ->warning()
                            ->send();
                    }
                }),

            EditAction::make(),
        ];
    }
}
