<?php

namespace App\Repositories\Eloquent;

use App\Models\Block;
use App\Repositories\Contracts\BlockRepositoryInterface;

class BlockRepository implements BlockRepositoryInterface
{
    public function find(int $id)
    {
        return Block::findOrFail($id);
    }
}
