<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class reservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reservation_number',
        'user_id',
        'block_id',
        'check_in_date',
        'check_out_date',
        'scheduled_check_in_time',
        'scheduled_check_out_time',
        'actual_check_in_time',
        'actual_check_out_time',
        'total_nights',
        'total_price',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function block()
    {
        return $this->belongsTo(Block::class);
    }

    public function reservationStatusHistories()
    {
        return $this->hasMany(ReservationStatusHistory::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function blockAvailabilities()
    {
        return $this->hasMany(BlockAvailability::class);
    }
}
