<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'pinelabs_order_id',
        'pinelabs_payment_id',
        'payment_gateway',
        'amount',
        'currency',
        'status',
        'course_ids',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'course_ids' => 'array',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the courses purchased in this transaction.
     */
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'course_user')
            ->withPivot('purchased_at')
            ->withTimestamps();
    }
}
