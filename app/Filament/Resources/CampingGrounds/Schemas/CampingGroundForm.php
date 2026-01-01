<?php

namespace App\Filament\Resources\CampingGrounds\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\RichEditor;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CampingGroundForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Tabs')
                    ->columnSpanFull()
                    ->tabs([
                        Tab::make('General Information')
                            ->schema([
                                TextInput::make('name')
                                    ->required(),
                                RichEditor::make('description')
                                    ->required()
                                    ->toolbarButtons([
                                        'bold',
                                        'italic',
                                        'underline',
                                        'strike',
                                        'h1',
                                        'h2',
                                        'h3',
                                        'link',
                                        'bulletList',
                                        'orderedList',
                                        'blockquote',
                                        'undo',
                                        'redo',
                                    ])
                                    ->extraAttributes(['style' => 'min-height: 150px;'])
                                    ->columnSpanFull(),
                                TextInput::make('location')
                                    ->required(),
                                TextInput::make('base_price')
                                    ->required()
                                    ->numeric()
                                    ->prefix('IDR'),
                                Repeater::make('facilities')
                                    ->label('Facilities')
                                    ->schema([
                                        TextInput::make('facility')
                                            ->required()
                                            ->placeholder('e.g. Toilet, Electricity, Water'),
                                    ])
                                    ->columnSpanFull()
                                    ->default([]),
                                Repeater::make('rules')
                                    ->label('Rules')
                                    ->schema([
                                        TextInput::make('rule')
                                            ->required()
                                            ->placeholder('e.g. No smoking, No fire'),
                                    ])
                                    ->columnSpanFull()
                                    ->default([]),
                                Toggle::make('is_active')
                                    ->default(true)
                                    ->required(),
                            ]),
                        Tab::make('Image')
                            ->schema([
                                Repeater::make('camping_ground_images')
                                    ->relationship('campingGroundImages')
                                    ->minItems(1)
                                    ->schema([
                                        FileUpload::make('image')
                                            ->image()
                                            ->disk('public')
                                            ->visibility('public')
                                            ->directory('images/camping_ground')
                                            ->getUploadedFileNameForStorageUsing(function ($file) {
                                                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                                                $slug = Str::slug($originalName);
                                                $random = Str::random(4);

                                                $uploadDate = date('Y-m-d');

                                                $extension = $file->getClientOriginalExtension();

                                                return "{$uploadDate}-{$slug}-{$random}.{$extension}";
                                            })
                                            ->required()
                                    ])->columnSpan('full'),
                            ]),
                        Tab::make('Layout')
                            ->schema([
                                Repeater::make('camping_ground_layout')
                                    ->relationship('campingGroundLayout')
                                    ->schema([
                                        FileUpload::make('layout_image')
                                            ->image()
                                            ->disk('public')
                                            ->visibility('public')
                                            ->directory('images/camping_ground_layout')
                                            ->getUploadedFileNameForStorageUsing(function ($file) {
                                                $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                                                $slug = Str::slug($originalName);
                                                $random = Str::random(4);
                                                $uploadDate = date('Y-m-d');
                                                $extension = $file->getClientOriginalExtension();
                                                return "{$uploadDate}-{$slug}-{$random}.{$extension}";
                                            })
                                            ->required()
                                    ])
                                    ->minItems(1)
                                    ->maxItems(1)
                            ]),
                        Tab::make('Block')
                            ->schema([
                                Repeater::make('blocks')
                                    ->relationship('blocks')
                                    ->minItems(1)
                                    ->schema([
                                        TextInput::make('name')
                                            ->required(),
                                        TextInput::make('daily_price')
                                            ->required()
                                            ->numeric()
                                            ->prefix('IDR'),
                                        Toggle::make('is_active')
                                            ->default(true)
                                            ->required(),
                                    ])
                                    ->columnSpanFull()
                                    ->default([]),
                            ]),
                    ])
            ]);
    }
}
