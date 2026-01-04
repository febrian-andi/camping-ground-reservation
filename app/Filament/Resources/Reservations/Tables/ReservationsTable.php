<?php

namespace App\Filament\Resources\Reservations\Tables;

use App\Helpers\DateHelper;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TrashedFilter;
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
                    ->sortable(),
                TextColumn::make('reservation_number')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->sortable(),
                TextColumn::make('block.campingGround.name')
                    ->sortable(),
                TextColumn::make('block.name')
                    ->sortable(),
                TextColumn::make('check_in_date')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y') . ' WIB')
                    ->sortable(),
                TextColumn::make('scheduled_check_in_time')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'H:i') . ' WIB')
                    ->sortable(),
                TextColumn::make('check_out_date')
                    ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y') . ' WIB')
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
                    ->sortable()
                    ->color(fn(string $state): string => match ($state) {
                        'pending' => 'warning',
                        'confirmed' => 'success',
                        'completed' => 'info',
                        'rejected' => 'danger',
                        'cancelled' => 'gray',
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
