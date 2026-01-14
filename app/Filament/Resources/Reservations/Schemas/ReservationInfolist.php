<?php

namespace App\Filament\Resources\Reservations\Schemas;

use App\Helpers\DateHelper;
use App\Models\Reservation;
use App\Models\ReservationCancellationRequest;
use App\Services\Payments\PaymentStatusService;
use App\Services\Reservations\ReservationCancellationService;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Schemas\Schema;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Support\Enums\Alignment;
use Filament\Support\Enums\FontWeight;
use Filament\Support\Enums\TextSize;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Facades\Storage;

class ReservationInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('ReservationDetails')
                    ->tabs([

                        // Reservation Information
                        Tabs\Tab::make('Reservation Information')
                            ->id('reservation-information')
                            ->schema([
                                TextEntry::make('reservation_number'),
                                TextEntry::make('user.name')->label('Name'),
                                TextEntry::make('block.campingGround.name')
                                    ->label('Camping Ground'),
                                TextEntry::make('block.name')->label('Block'),
                                TextEntry::make('check_in_date')
                                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y')),
                                TextEntry::make('check_out_date')
                                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y')),
                                TextEntry::make('scheduled_check_in_time')
                                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i')),
                                TextEntry::make('scheduled_check_out_time')
                                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i')),
                                TextEntry::make('actual_check_in_time')
                                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i'))
                                    ->placeholder('-'),
                                TextEntry::make('actual_check_out_time')
                                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i'))
                                    ->placeholder('-'),
                                TextEntry::make('total_nights')->numeric(),
                                TextEntry::make('created_at')
                                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y H:i'))
                                    ->placeholder('-'),
                                TextEntry::make('deleted_at')
                                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y H:i'))
                                    ->visible(fn(Reservation $record): bool => $record->trashed()),
                            ])
                            ->columns(2),

                        // Payment History
                        Tabs\Tab::make('Payment History')
                            ->id('payment-history')
                            ->schema([
                                TextEntry::make('total_price')
                                    ->money('IDR')
                                    ->size(TextSize::Large)
                                    ->weight(FontWeight::Bold),
                                TextEntry::make('total_paid_info')
                                    ->label('Total Paid')
                                    ->placeholder('-')
                                    ->color('info')
                                    ->size(TextSize::Large)
                                    ->weight(FontWeight::Bold)
                                    ->getStateUsing(function ($record) {
                                        if (! $record?->total_paid) {
                                            return '-';
                                        }

                                        $amount = number_format($record->total_paid['amount'] ?? 0, 2, ',', '.');
                                        $percentage = $record->total_paid['percentage'] ?? '-';

                                        return "IDR {$amount} ({$percentage}%)";
                                    }),
                                RepeatableEntry::make('payments')
                                    ->label('Payment History')
                                    ->schema([
                                        TextEntry::make('amount')
                                            ->label('Amount')
                                            ->money('IDR'),
                                        TextEntry::make('proof_image')
                                            ->label('Proof of Transfer')
                                            ->placeholder('-')
                                            ->formatStateUsing(fn($state) => $state ? 'Lihat' : '-')
                                            ->suffixAction(
                                                Action::make('view_proof')
                                                    ->icon('heroicon-o-eye')
                                                    ->color('info')
                                                    ->modalHeading('Proof of Transfer')
                                                    ->modalContent(fn($record) => new HtmlString(
                                                        '<div style="display: flex; justify-content: center;">
                                                            <img src="' . Storage::url($record->proof_image) . '" style="max-width: 100%; max-height: 80vh; border-radius: 8px;" />
                                                        </div>'
                                                    ))
                                                    ->visible(fn($record) => $record->proof_image)
                                                    ->modalSubmitAction(false)
                                                    ->modalCancelAction(fn($action) => $action->label('Tutup'))
                                            ),
                                        TextEntry::make('method')
                                            ->label('Method')
                                            ->badge()
                                            ->color('info')
                                            ->placeholder('Transfer/Cash/Qris'),
                                        TextEntry::make('payment_provider')
                                            ->label('Provider')
                                            ->placeholder('Bank Name/Provider Name'),
                                        TextEntry::make('created_info')
                                            ->label('Created')
                                            ->placeholder('-')
                                            ->getStateUsing(function ($record) {
                                                if (! $record?->created_at) {
                                                    return '-';
                                                }

                                                $userName = $record->user->name ?? '-';
                                                $createdAt = DateHelper::wib($record->created_at, 'd M Y H:i');

                                                return "{$userName} • {$createdAt}";
                                            }),
                                        TextEntry::make('status')
                                            ->label('Status')
                                            ->badge()
                                            ->color(fn(string $state): string => match ($state) {
                                                'pending' => 'warning',
                                                'verified' => 'success',
                                                'failed' => 'danger',
                                                'refunded' => 'gray',
                                            })
                                            ->suffixActions([
                                                Action::make('verify_payment')
                                                    ->icon('heroicon-o-check-circle')
                                                    ->color('success')
                                                    ->requiresConfirmation()
                                                    ->visible(fn($record) => $record->status === 'pending')
                                                    ->action(function ($record, Action $action) {
                                                        try {
                                                            app(PaymentStatusService::class)
                                                                ->changeStatus($record->id, 'verified');

                                                            Notification::make()
                                                                ->title('Payment Verified')
                                                                ->success()
                                                                ->send();

                                                            $record->refresh();
                                                            $action->getLivewire()->getRecord()->refresh();
                                                        } catch (\Exception $e) {
                                                            Notification::make()
                                                                ->title('Error Verifying Payment')
                                                                ->body($e->getMessage())
                                                                ->danger()
                                                                ->send();
                                                        }
                                                    }),
                                                Action::make('reject_payment')
                                                    ->icon('heroicon-o-x-circle')
                                                    ->color('danger')
                                                    ->requiresConfirmation()
                                                    ->visible(fn($record) => $record->status === 'pending')
                                                    ->action(function ($record, Action $action) {
                                                        try {
                                                            app(PaymentStatusService::class)
                                                                ->changeStatus($record->id, 'failed');

                                                            Notification::make()
                                                                ->title('Payment Failed')
                                                                ->danger()
                                                                ->send();

                                                            $record->refresh();
                                                            $action->getLivewire()->getRecord()->refresh();
                                                        } catch (\Exception $e) {
                                                            Notification::make()
                                                                ->title('Error')
                                                                ->body($e->getMessage())
                                                                ->danger()
                                                                ->send();
                                                        }
                                                    })
                                            ])
                                    ])
                                    ->columns(2),
                            ])
                            ->columns(1),

                        // Status History
                        Tabs\Tab::make('Status History')
                            ->id('status-history')
                            ->schema([
                                RepeatableEntry::make('reservationStatusHistories')
                                    ->label('Status History')
                                    ->schema([
                                        TextEntry::make('new_status')
                                            ->label('Status')
                                            ->badge()
                                            ->color(fn(string $state): string => match ($state) {
                                                'pending' => 'warning',
                                                'confirmed' => 'success',
                                                'verified' => 'success',
                                                'completed' => 'info',
                                                'rejected' => 'danger',
                                                'refunded' => 'gray',
                                                'cancelled' => 'gray',
                                            }),
                                        TextEntry::make('note')
                                            ->label('Note'),
                                        TextEntry::make('createdBy.name')
                                            ->label('Created By'),
                                        TextEntry::make('created_at')
                                            ->label('Created At')
                                            ->placeholder('-')
                                            ->formatStateUsing(fn($state) => $state ? DateHelper::wib($state, 'd M Y H:i') : '-'),
                                    ])
                                    ->columns(2),
                            ])
                            ->columns(1),

                        // Cancellation Request
                        Tabs\Tab::make('Cancellation Request')
                            ->id('cancellation-request')
                            ->schema([
                                TextEntry::make('reservationCancellationRequest.reason')
                                    ->label("Reason")
                                    ->placeholder("No data"),
                                TextEntry::make('reservationCancellationRequest.requested_at')
                                    ->label("Requested At")
                                    ->formatStateUsing(fn($state) => $state ? DateHelper::wib($state, 'd M Y H:i') : '-')
                                    ->placeholder("No data"),
                                TextEntry::make('reservationCancellationRequest.decided_at')
                                    ->label("Decided At")
                                    ->visible(
                                        fn($record) =>
                                        $record?->reservationCancellationRequest &&
                                            $record->reservationCancellationRequest->status !== 'pending'
                                    )
                                    ->formatStateUsing(
                                        fn($state) =>
                                        $state ? DateHelper::wib($state, 'd M Y H:i') : '-'
                                    )
                                    ->placeholder('No data'),
                                TextEntry::make('user.name')
                                    ->label("Decided By")
                                    ->visible(
                                        fn($record) =>
                                        $record?->reservationCancellationRequest &&
                                            $record->reservationCancellationRequest->status !== 'pending'
                                    )
                                    ->placeholder("No data"),
                                TextEntry::make('reservationCancellationRequest.status')
                                    ->label('Status')
                                    ->badge()
                                    ->placeholder("No data")
                                    ->color(fn(string $state): string => match ($state) {
                                        'pending' => 'warning',
                                        'approved' => 'success',
                                        'rejected' => 'danger',
                                    }),
                                Actions::make([
                                    Action::make('approve')
                                        ->label('Approve')
                                        ->icon('heroicon-o-check')
                                        ->color('success')
                                        ->visible(
                                            fn($record) =>
                                            $record?->status !== 'cancelled' &&
                                                $record?->reservationCancellationRequest &&
                                                $record->reservationCancellationRequest->status === 'pending'
                                        )
                                        ->requiresConfirmation()
                                        ->schema([
                                            FileUpload::make('proof_image')
                                                ->label('Proof Image')
                                                ->image()
                                                ->required()
                                                ->directory('images/cancellation-refunds')
                                                ->helperText('Please upload proof of the refund.'),
                                        ])
                                        ->action(function (
                                            Reservation $record,
                                            ReservationCancellationService $service,
                                            Action $action,
                                            array $data
                                        ) {
                                            try {
                                                $service->approve(
                                                    $record->reservationCancellationRequest,
                                                    $data
                                                );

                                                Notification::make()
                                                    ->title('Cancellation Request Approved')
                                                    ->success()
                                                    ->send();

                                                $record->refresh();
                                                $action->getLivewire()->getRecord()->refresh();
                                            } catch (\Throwable $e) {
                                                Notification::make()
                                                    ->title('Error Approve Cancellation')
                                                    ->body($e->getMessage() ?? 'Something went wrong. Please try again later.')
                                                    ->danger()
                                                    ->send();

                                                return;
                                            }
                                        }),
                                    Action::make('reject')
                                        ->label('Reject')
                                        ->icon('heroicon-o-x-mark')
                                        ->color('danger')
                                        ->visible(
                                            fn($record) =>
                                            $record?->status !== 'cancelled' &&
                                                $record?->reservationCancellationRequest &&
                                                $record->reservationCancellationRequest->status === 'pending'
                                        )
                                        ->requiresConfirmation()
                                        ->action(function (
                                            Reservation $record,
                                            ReservationCancellationService $service,
                                            Action $action
                                        ) {
                                            try {
                                                $service->reject($record->reservationCancellationRequest);

                                                Notification::make()
                                                    ->title('Cancellation Request Rejected')
                                                    ->success()
                                                    ->send();

                                                $record->refresh();
                                                $action->getLivewire()->getRecord()->refresh();
                                            } catch (\Throwable $e) {
                                                Notification::make()
                                                    ->title('Error Reject Cancellation')
                                                    ->body($e->getMessage() ?? 'Something went wrong. Please try again later.')
                                                    ->danger()
                                                    ->send();

                                                return;
                                            }
                                        }),
                                ])
                                    ->alignment(Alignment::Start),
                            ])
                            ->columns(1),

                        // Status Summary
                        Tabs\Tab::make('Status Summary')
                            ->id('summary-status')
                            ->schema([
                                TextEntry::make('status')
                                    ->label('Reservation Status')
                                    ->badge()
                                    ->color(fn(string $state): string => match ($state) {
                                        'pending' => 'warning',
                                        'confirmed' => 'success',
                                        'completed' => 'info',
                                        'rejected' => 'danger',
                                        'cancelled' => 'gray',
                                    }),
                                TextEntry::make('payment_status')
                                    ->label('Payment Status')
                                    ->badge()
                                    ->color(fn(string $state): string => match ($state) {
                                        'pending' => 'warning',
                                        'partial_paid' => 'warning',
                                        'full_paid' => 'success',
                                        'failed' => 'danger',
                                        'refunded' => 'gray',
                                    }),
                            ])
                            ->columns(2),
                    ])
                    ->columnSpanFull()
                    ->id('reservation-tabs')
                    ->persistTabInQueryString()
            ]);
    }
}
