<?php

namespace App\Filament\Resources\Reservations\Schemas;

use App\Helpers\DateHelper;
use App\Models\Reservation;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\RepeatableEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ReservationInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                // ===========================
                // Section 1: Booking/Reservation Information
                // ===========================
                Section::make('Booking Information')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('reservation_number'),
                        TextEntry::make('user.name')->label('User'),
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
                        TextEntry::make('status')
                            ->label('Booking Status')
                            ->badge()
                            ->color(fn(string $state): string => match ($state) {
                                'pending' => 'warning',
                                'confirmed' => 'success',
                                'completed' => 'info',
                                'rejected' => 'danger',
                                'cancelled' => 'gray',
                            }),
                        TextEntry::make('created_at')
                            ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y H:i'))
                            ->placeholder('-'),
                        TextEntry::make('updated_at')
                            ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y H:i'))
                            ->placeholder('-'),
                        TextEntry::make('deleted_at')
                            ->formatStateUsing(fn(string $state): string => DateHelper::wib($state, 'd M Y H:i'))
                            ->visible(fn(Reservation $record): bool => $record->trashed()),
                    ]),

                // ===========================
                // Section 2: Payment Information
                // ===========================
                Section::make('Payment Information')
                    ->columns(1)
                    ->schema([
                        TextEntry::make('total_price')
                            ->money('IDR'),

                        // Repeater untuk history pembayaran
                        RepeatableEntry::make('payments')
                            ->label('Payment History')
                            ->schema([
                                TextEntry::make('amount')
                                    ->label('Amount')
                                    ->money('IDR'),
                                TextEntry::make('payment_type')
                                    ->label('Type') // dp / full
                                    ->placeholder('Partial Payment/Full Payment'),
                                TextEntry::make('payment_method')
                                    ->label('Method')
                                    ->badge()
                                    ->placeholder('Bank Transfer/E-Wallet'),
                                TextEntry::make('payment_provider')
                                    ->label('Provider')
                                    ->placeholder('Bank Name/Provider Name'),
                                TextEntry::make('created_at')
                                    ->label('Created At')
                                    ->formatStateUsing(fn($state) => $state ? DateHelper::wib($state, 'd M Y H:i') : '-'),
                                TextEntry::make('updated_at')
                                    ->label('Updated At')
                                    ->formatStateUsing(fn($state) => $state ? DateHelper::wib($state, 'd M Y H:i') : '-'),
                            ])
                            ->columns(2),
                    ])
            ]);
    }
}
