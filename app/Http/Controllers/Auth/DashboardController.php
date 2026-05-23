<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the user dashboard.
     */
    public function index(): Response
    {
        $user = Auth::user();

        // Get statistics
        $totalCourses = $user->courses()->count();
        $totalTransactions = $user->transactions()->count();
        $totalSpent = $user->transactions()
            ->where('status', 'completed')
            ->sum('amount');
        $cartItemsCount = $user->cartItems()->count();

        // Get recent courses (last 5)
        $recentCourses = $user->courses()
            ->with('category')
            ->orderBy('course_user.purchased_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                    'feature_image' => $course->feature_image ? Storage::url($course->feature_image) : null,
                    'category' => $course->category ? $course->category->name : null,
                    'purchased_at' => $course->pivot->purchased_at,
                ];
            });

        // Get recent transactions (last 5)
        $recentTransactions = $user->transactions()
            ->with('courses')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'razorpay_order_id' => $transaction->razorpay_order_id,
                    'amount' => (float) $transaction->amount,
                    'currency' => $transaction->currency,
                    'status' => $transaction->status,
                    'courses_count' => count($transaction->course_ids ?? []),
                    'created_at' => $transaction->created_at,
                ];
            });

        // Get completed transactions count
        $completedTransactions = $user->transactions()
            ->where('status', 'completed')
            ->count();

        return Inertia::render('User/Pages/Dashboard', [
            'stats' => [
                'totalCourses' => $totalCourses,
                'totalTransactions' => $totalTransactions,
                'completedTransactions' => $completedTransactions,
                'totalSpent' => (float) $totalSpent,
                'cartItemsCount' => $cartItemsCount,
            ],
            'recentCourses' => $recentCourses,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}

