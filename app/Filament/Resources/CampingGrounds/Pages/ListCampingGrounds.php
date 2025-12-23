<?php

namespace App\Filament\Resources\CampingGrounds\Pages;

use App\Filament\Resources\CampingGrounds\CampingGroundResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCampingGrounds extends ListRecords
{
    protected static string $resource = CampingGroundResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
