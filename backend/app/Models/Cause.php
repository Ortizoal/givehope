<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cause extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'description', 'image_url', 'goal_amount', 'raised_amount', 'status'];

    protected $casts = [
        'goal_amount' => 'decimal:2',
        'raised_amount' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($cause) {
            if (empty($cause->slug)) {
                $cause->slug = Str::slug($cause->title);
            }
        });
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    public function getProgressPercentAttribute(): float
    {
        if ($this->goal_amount <= 0) return 0;
        return min(100, round(($this->raised_amount / $this->goal_amount) * 100, 1));
    }

    protected $appends = ['progress_percent'];
}
