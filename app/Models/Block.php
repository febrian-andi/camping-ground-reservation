<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Block extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'camping_ground_id',
        'layout_id',
        'name',
        'daily_price',
        'is_active',
        'is_rentable',
    ];

    public function campingGround()
    {
        return $this->belongsTo(CampingGround::class);
    }
}
