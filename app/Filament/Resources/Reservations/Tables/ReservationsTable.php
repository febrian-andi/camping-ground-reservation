<?php

namespace App\Filament\Resources\Reservations\Tables;

use App\Helpers\DateHelper;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ReservationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('created_at')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state) . ' WIB')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('reservation_number')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('block.campingGround.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('block.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('check_in_date')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y') . ' WIB')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('scheduled_check_in_time')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i') . ' WIB')
                    ->sortable(),
                TextColumn::make('check_out_date')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y') . ' WIB')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('scheduled_check_out_time')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i') . ' WIB')
                    ->sortable(),
                TextColumn::make('total_nights')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('total_price')
                    ->money('IDR')
                    ->sortable(),
                TextColumn::make('actual_check_in_time')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i') . ' WIB')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('actual_check_out_time')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i') . ' WIB')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('status')
                    ->badge()
                    ->searchable()
                    ->sortable()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'success',
                        'completed' => 'info',
                        'rejected' => 'danger',
                        'cancelled' => 'gray',
                    }),
                TextColumn::make('payment_status')
                    ->badge()
                    ->searchable()
                    ->sortable()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'partial_paid' => 'warning',
                        'full_paid' => 'success',
                        'failed' => 'danger',
                        'refunded' => 'gray',
                    }),
                TextColumn::make('deleted_at')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state) . ' WIB')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state) . ' WIB')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                TrashedFilter::make(),
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'completed' => 'Completed',
                        'rejected' => 'Rejected',
                        'cancelled' => 'Cancelled',
                    ]),
                SelectFilter::make('payment_status')
                    ->options([
                        'unpaid' => 'Unpaid',
                        'partial_paid' => 'Partial Paid',
                        'full_paid' => 'Full Paid',
                        'failed' => 'Failed',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                ]),
            ]);
    }
}
