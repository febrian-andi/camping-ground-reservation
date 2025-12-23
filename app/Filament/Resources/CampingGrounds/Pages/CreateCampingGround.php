<?php

namespace App\Filament\Resources\CampingGrounds\Pages;

use App\Filament\Resources\CampingGrounds\CampingGroundResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCampingGround extends CreateRecord
{
    protected static string $resource = CampingGroundResource::class;

    protected static bool $canCreateAnother = false;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
