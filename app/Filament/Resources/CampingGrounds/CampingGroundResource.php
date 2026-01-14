<?php

namespace App\Filament\Resources\CampingGrounds;

use App\Filament\Resources\CampingGrounds\Pages\CreateCampingGround;
use App\Filament\Resources\CampingGrounds\Pages\EditCampingGround;
use App\Filament\Resources\CampingGrounds\Pages\ListCampingGrounds;
use App\Filament\Resources\CampingGrounds\Schemas\CampingGroundForm;
use App\Filament\Resources\CampingGrounds\Tables\CampingGroundsTable;
use App\Models\CampingGround;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class CampingGroundResource extends Resource
{
    protected static ?string $model = CampingGround::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'Camping Grounds';

    protected static ?int $navigationSort = -15;

    public static function form(Schema $schema): Schema
    {
        return CampingGroundForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CampingGroundsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCampingGrounds::route('/'),
            'create' => CreateCampingGround::route('/create'),
            'edit' => EditCampingGround::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
