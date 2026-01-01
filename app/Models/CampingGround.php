<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CampingGround extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'location',
        'base_price',
        'facilities',
        'rules',
        'is_active',
    ];

    protected $casts = [
        'facilities' => 'array',
        'rules' => 'array',
        'is_active' => 'boolean',
    ];


    protected static function booted()
    {
        static::creating(function ($model) {
            $baseSlug = Str::slug($model->name);
            $slug = $baseSlug;

            while (static::withTrashed()->where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . Str::random(6);
            }

            $model->slug = $slug;
        });

        static::updating(function ($model) {
            if ($model->isDirty('name')) {
                $baseSlug = Str::slug($model->name);
                $slug = $baseSlug;

                while (static::withTrashed()
                    ->where('slug', $slug)
                    ->where('id', '!=', $model->id)
                    ->exists()
                ) {
                    $slug = $baseSlug . '-' . Str::random(6);
                }

                $model->slug = $slug;
            }
        });
    }


    public function campingGroundImages()
    {
        return $this->hasMany(CampingGroundImage::class);
    }

    public function campingGroundLayout()
    {
        return $this->hasOne(CampingGroundLayout::class);
    }

    public function blocks()
    {
        return $this->hasMany(Block::class);
    }
}
