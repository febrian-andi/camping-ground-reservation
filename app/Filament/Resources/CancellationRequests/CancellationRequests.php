<?php

namespace App\Filament\Resources\CancellationRequests;

use App\Filament\Resources\CancellationRequests\Pages\ListCancellationRequests;
use App\Models\ReservationCancellationRequest;
use App\Services\Reservations\ReservationCancellationService;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class CancellationRequests extends Resource
{
    protected static ?string $model = ReservationCancellationRequest::class;

    protected static ?string $navigationLabel = 'Cancellation Requests';

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-x-circle';

    protected static string|\UnitEnum|null $navigationGroup = 'Reservations';

    protected static ?int $navigationSort = -9;

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reservation.reservation_number')
                    ->label('Reservation Number')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('reservation.user.name')
                    ->label('Name')
                    ->searchable(),
                TextColumn::make('reason')
                    ->label('Reason')
                    ->limit(50)
                    ->tooltip(fn($record) => $record->reason),
                TextColumn::make('requested_at')
                    ->label('Requested At')
                    ->dateTime('d M Y H:i'),
                TextColumn::make('status')
                    ->label('Cancellation Status')
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                    }),
                TextColumn::make('decidedBy.name')
                    ->label('Decided By')
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('decided_at')
                    ->label('Decided At')
                    ->dateTime('d M Y H:i')
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                    ]),
            ])
            ->recordActions([
                Action::make('view')
                    ->label('View')
                    ->icon('heroicon-o-eye')
                    ->url(fn(ReservationCancellationRequest $record) => \App\Filament\Resources\Reservations\ReservationResource::getUrl('view', ['record' => $record->reservation_id])),

                Action::make('approve')
                    ->label('Approve')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn(ReservationCancellationRequest $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->schema([
                        FileUpload::make('proof_image')
                            ->label('Proof Image')
                            ->image()
                            ->required()
                            ->directory('images/cancellation-refunds')
                            ->helperText('Please upload proof of the refund.'),
                    ])
                    ->action(function (ReservationCancellationRequest $record, ReservationCancellationService $service) {
                        try {
                            $service->approve($record);
                            Notification::make()
                                ->title('Cancellation Request Approved')
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title('Error')
                                ->body($e->getMessage())
                                ->danger()
                                ->send();
                        }
                    }),
                Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->visible(fn(ReservationCancellationRequest $record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->action(function (ReservationCancellationRequest $record, ReservationCancellationService $service) {
                        try {
                            $service->reject($record);
                            Notification::make()
                                ->title('Cancellation Request Rejected')
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title('Error')
                                ->body($e->getMessage())
                                ->danger()
                                ->send();
                        }
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCancellationRequests::route('/'),
        ];
    }
}
