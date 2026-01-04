<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Contracts\CampingGroundRepositoryInterface;
use App\Repositories\Eloquent\CampingGroundRepository;
use App\Repositories\Contracts\ReservationRepositoryInterface;
use App\Repositories\Eloquent\ReservationRepository;
use App\Repositories\Contracts\BlockRepositoryInterface;
use App\Repositories\Eloquent\BlockRepository;
use App\Repositories\Contracts\BlockAvailabilityRepositoryInterface;
use App\Repositories\Eloquent\BlockAvailabilityRepository;
use App\Repositories\Contracts\PaymentRepositoryInterface;
use App\Repositories\Eloquent\PaymentRepository;
use App\Repositories\Contracts\CancellationRepositoryInterface;
use App\Repositories\Eloquent\CancellationRepository;
use App\Repositories\Contracts\ReservationStatusHistoryRepositoryInterface;
use App\Repositories\Eloquent\ReservationStatusHistoryRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
        $this->app->bind(CampingGroundRepositoryInterface::class, CampingGroundRepository::class);
        $this->app->bind(ReservationRepositoryInterface::class, ReservationRepository::class);
        $this->app->bind(BlockRepositoryInterface::class, BlockRepository::class);
        $this->app->bind(BlockAvailabilityRepositoryInterface::class, BlockAvailabilityRepository::class);
        $this->app->bind(PaymentRepositoryInterface::class, PaymentRepository::class);
        $this->app->bind(CancellationRepositoryInterface::class, CancellationRepository::class);
        $this->app->bind(ReservationStatusHistoryRepositoryInterface::class, ReservationStatusHistoryRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
