<?php

declare(strict_types=1);

namespace App\Policies;

use Illuminate\Foundation\Auth\User as AuthUser;
use App\Models\CampingGround;
use Illuminate\Auth\Access\HandlesAuthorization;

class CampingGroundPolicy
{
    use HandlesAuthorization;
    
    public function viewAny(AuthUser $authUser): bool
    {
        return $authUser->can('ViewAny:CampingGround');
    }

    public function view(AuthUser $authUser, CampingGround $campingGround): bool
    {
        return $authUser->can('View:CampingGround');
    }

    public function create(AuthUser $authUser): bool
    {
        return $authUser->can('Create:CampingGround');
    }

    public function update(AuthUser $authUser, CampingGround $campingGround): bool
    {
        return $authUser->can('Update:CampingGround');
    }

    public function delete(AuthUser $authUser, CampingGround $campingGround): bool
    {
        return $authUser->can('Delete:CampingGround');
    }

    public function restore(AuthUser $authUser, CampingGround $campingGround): bool
    {
        return $authUser->can('Restore:CampingGround');
    }

    public function forceDelete(AuthUser $authUser, CampingGround $campingGround): bool
    {
        return $authUser->can('ForceDelete:CampingGround');
    }

    public function forceDeleteAny(AuthUser $authUser): bool
    {
        return $authUser->can('ForceDeleteAny:CampingGround');
    }

    public function restoreAny(AuthUser $authUser): bool
    {
        return $authUser->can('RestoreAny:CampingGround');
    }

    public function replicate(AuthUser $authUser, CampingGround $campingGround): bool
    {
        return $authUser->can('Replicate:CampingGround');
    }

    public function reorder(AuthUser $authUser): bool
    {
        return $authUser->can('Reorder:CampingGround');
    }

}