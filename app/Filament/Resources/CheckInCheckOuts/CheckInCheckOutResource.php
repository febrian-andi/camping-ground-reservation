<?php

namespace App\Filament\Resources\CheckInCheckOuts;

use App\Filament\Resources\CheckInCheckOuts\Pages\ManageCheckInCheckOuts;
use App\Models\Reservation;
use App\Services\Reservations\ReservationStatusService;
use BackedEnum;
use Carbon\Carbon;
use Filament\Actions\Action;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class CheckInCheckOutResource extends Resource
{
    protected static ?string $model = Reservation::class;

    protected static ?string $navigationLabel = 'Check-in / Check-out';

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-qr-code';

    protected static string|\UnitEnum|null $navigationGroup = 'Reservations';

    protected static ?int $navigationSort = -10;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('reservation_number')
                    ->disabled(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn(Builder $query) => $query->whereIn('status', ['confirmed', 'completed'])->where('payment_status', 'full_paid'))
            ->columns([
                TextColumn::make('reservation_number')
                    ->label('Reservation Number')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('user.name')
                    ->label('Name')
                    ->searchable(),
                TextColumn::make('block.campingGround.name')
                    ->label('Camping Ground')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('block.name')
                    ->label('Block')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('check_in_date')
                    ->label('Check-in Date')
                    ->searchable()
                    ->sortable()
                    ->dateTime('d M Y'),
                TextColumn::make('check_out_date')
                    ->label('Check-out Date')
                    ->searchable()
                    ->sortable()
                    ->dateTime('d M Y'),
                TextColumn::make('scheduled_check_in_time')
                    ->label('Scheduled Check-in Time')
                    ->searchable()
                    ->sortable()
                    ->formatStateUsing(
                        fn($state) =>
                        $state
                            ? Carbon::parse($state)->format('H:i') . ' WIB'
                            : null
                    ),
                TextColumn::make('scheduled_check_out_time')
                    ->label('Scheduled Check-out Time')
                    ->searchable()
                    ->sortable()
                    ->formatStateUsing(
                        fn($state) =>
                        $state
                            ? Carbon::parse($state)->format('H:i') . ' WIB'
                            : null
                    ),
                TextColumn::make('actual_check_in_time')
                    ->label('Actual Check-in Time')
                    ->formatStateUsing(
                        fn($state) =>
                        $state
                            ? Carbon::parse($state)->format('H:i') . ' WIB'
                            : null
                    )
                    ->placeholder('Not Checked In'),
                TextColumn::make('actual_check_out_time')
                    ->label('Actual Check-out Time')
                    ->formatStateUsing(
                        fn($state) =>
                        $state
                            ? Carbon::parse($state)->format('H:i') . ' WIB'
                            : null
                    )
                    ->placeholder('Not Checked Out'),
            ])
            ->recordActions([
                Action::make('check_in')
                    ->label('Check-in')
                    ->icon('heroicon-o-arrow-right-end-on-rectangle')
                    ->color('success')
                    ->visible(fn(Reservation $record) => $record->actual_check_in_time === null)
                    ->action(function (Reservation $record) {
                        try {
                            $record->update([
                                'actual_check_in_time' => now(),
                            ]);

                            Notification::make()
                                ->title('Check-in Successful')
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title('Check-in Failed')
                                ->danger()
                                ->body($e->getMessage())
                                ->send();
                        }
                    })
                    ->requiresConfirmation(),
                Action::make('check_out')
                    ->label('Check-out')
                    ->icon('heroicon-o-arrow-left-start-on-rectangle')
                    ->color('danger')
                    ->visible(fn(Reservation $record) => $record->actual_check_in_time !== null && $record->actual_check_out_time === null)
                    ->action(function (Reservation $record) {
                        try {
                            $record->update([
                                'actual_check_out_time' => now(),
                            ]);

                            app(ReservationStatusService::class)->changeStatus($record->id, 'completed');

                            Notification::make()
                                ->title('Check-out Successful')
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title('Check-out Failed')
                                ->danger()
                                ->body($e->getMessage())
                                ->send();
                        }
                    })
                    ->requiresConfirmation(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageCheckInCheckOuts::route('/'),
        ];
    }
}
