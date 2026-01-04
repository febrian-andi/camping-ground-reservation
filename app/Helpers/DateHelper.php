<?php

namespace App\Helpers;

use Carbon\Carbon;

class DateHelper
{
    public static function wib($date, string $format = 'd M Y H:i'): string
    {
        return $date
            ? Carbon::parse($date)
            ->timezone('Asia/Jakarta')
            ->format($format)
            : '-';
    }
}
