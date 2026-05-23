<?php

namespace App\Http\Controllers\Admin\Courses;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of all orders (completed transactions).
     */
    public function index(): Response
    {
        $orders = Transaction::where('status', 'completed')
            ->with(['user', 'courses.category'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'user' => [
                        'id' => $transaction->user->id,
                        'name' => $transaction->user->name,
                        'email' => $transaction->user->email,
                    ],
                    'razorpay_order_id' => $transaction->razorpay_order_id,
                    'razorpay_payment_id' => $transaction->razorpay_payment_id,
                    'amount' => (float) $transaction->amount,
                    'currency' => $transaction->currency,
                    'status' => $transaction->status,
                    'courses' => $transaction->courses->map(function ($course) {
                        return [
                            'id' => $course->id,
                            'title' => $course->title,
                            'category' => $course->category ? $course->category->name : null,
                        ];
                    }),
                    'courses_count' => $transaction->courses->count(),
                    'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
                    'created_at_formatted' => $transaction->created_at->format('d M Y, h:i A'),
                ];
            });

        return Inertia::render('Admin/Courses/orders/Index', [
            'orders' => $orders,
            'totalOrders' => Transaction::where('status', 'completed')->count(),
            'totalRevenue' => (float) (Transaction::where('status', 'completed')->sum('amount') ?? 0),
        ]);
    }
}

