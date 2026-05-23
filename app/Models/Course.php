<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'course_details',
        'course_includes',
        'category_id',
        'feature_image',
        'price',
        'discount_price',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    /**
     * Get the category that owns the course.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Get the users who purchased this course.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_user')
            ->withPivot('transaction_id', 'purchased_at')
            ->withTimestamps();
    }

    /**
     * Get the cart items for this course.
     */
    public function cartItems(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Check if user has purchased this course.
     */
    public function isPurchasedBy($userId): bool
    {
        return $this->users()->where('user_id', $userId)->exists();
    }
}
