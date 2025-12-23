<?php

namespace App\Filament\Resources\CampingGrounds\Pages;

use App\Filament\Resources\CampingGrounds\CampingGroundResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Resources\Pages\EditRecord;

class EditCampingGround extends EditRecord
{
    protected static string $resource = CampingGroundResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
