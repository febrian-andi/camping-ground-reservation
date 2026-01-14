<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
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
        'payment_status',
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

    public function getTotalPaidAttribute(): array
    {
        $totalAmount = $this->payments()
            ->where('status', 'verified')
            ->sum('amount');

        $percentage = $this->total_price > 0
            ? ($totalAmount / $this->total_price) * 100
            : 0;

        return [
            'amount' => $totalAmount,
            'percentage' => round($percentage, 2),
        ];
    }

    public function blockAvailabilities()
    {
        return $this->hasMany(BlockAvailability::class);
    }

    public function reservationCancellationRequest()
    {
        return $this->hasOne(ReservationCancellationRequest::class);
    }
}
