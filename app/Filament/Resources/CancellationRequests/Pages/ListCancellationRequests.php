<?php

namespace App\Filament\Resources\CancellationRequests\Pages;

use App\Filament\Resources\CancellationRequests\CancellationRequests;
use Filament\Resources\Pages\ListRecords;

class ListCancellationRequests extends ListRecords
{
    protected static string $resource = CancellationRequests::class;

    protected function getHeaderActions(): array
    {
        return [
            //
        ];
    }
}
