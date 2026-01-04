<?php

namespace App\Filament\Resources\Reservations\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\TimePicker;
use Filament\Schemas\Schema;

class ReservationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('reservation_number')
                    ->required(),
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('block_id')
                    ->required()
                    ->numeric(),
                DatePicker::make('check_in_date')
                    ->required(),
                DatePicker::make('check_out_date')
                    ->required(),
                TimePicker::make('scheduled_check_in_time')
                    ->required(),
                TimePicker::make('scheduled_check_out_time')
                    ->required(),
                TimePicker::make('actual_check_in_time'),
                TimePicker::make('actual_check_out_time'),
                TextInput::make('total_nights')
                    ->required()
                    ->numeric()
                    ->default(1),
                TextInput::make('total_price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                Select::make('status')
                    ->options([
            'pending' => 'Pending',
            'confirmed' => 'Confirmed',
            'rejected' => 'Rejected',
            'cancelled' => 'Cancelled',
            'completed' => 'Completed',
        ])
                    ->default('pending')
                    ->required(),
            ]);
    }
}
