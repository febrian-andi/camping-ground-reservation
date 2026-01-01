<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BlockAvailability extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'block_id',
        'date',
        'status',
        'reservation_id',
    ];

    public function block()
    {
        return $this->belongsTo(Block::class);
    }

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
