<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard(): Response
    {
        // Calculate stats
        $totalUsers = User::count();
        $totalCourses = Course::count();
        $totalOrders = Transaction::where('status', 'completed')->count();
        $totalRevenue = Transaction::where('status', 'completed')->sum('amount') ?? 0;

        // Calculate percentage changes (comparing last 30 days with previous 30 days)
        $last30Days = Carbon::now()->subDays(30);
        $previous30Days = Carbon::now()->subDays(60);

        $usersLastMonth = User::where('created_at', '>=', $last30Days)->count();
        $usersPreviousMonth = User::whereBetween('created_at', [$previous30Days, $last30Days])->count();
        $usersChange = $usersPreviousMonth > 0 
            ? round((($usersLastMonth - $usersPreviousMonth) / $usersPreviousMonth) * 100) 
            : ($usersLastMonth > 0 ? 100 : 0);

        $coursesLastMonth = Course::where('created_at', '>=', $last30Days)->count();
        $coursesPreviousMonth = Course::whereBetween('created_at', [$previous30Days, $last30Days])->count();
        $coursesChange = $coursesPreviousMonth > 0 
            ? round((($coursesLastMonth - $coursesPreviousMonth) / $coursesPreviousMonth) * 100) 
            : ($coursesLastMonth > 0 ? 100 : 0);

        $revenueLastMonth = Transaction::where('status', 'completed')
            ->where('created_at', '>=', $last30Days)
            ->sum('amount') ?? 0;
        $revenuePreviousMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$previous30Days, $last30Days])
            ->sum('amount') ?? 0;
        $revenueChange = $revenuePreviousMonth > 0 
            ? round((($revenueLastMonth - $revenuePreviousMonth) / $revenuePreviousMonth) * 100) 
            : ($revenueLastMonth > 0 ? 100 : 0);

        $ordersLastMonth = Transaction::where('status', 'completed')
            ->where('created_at', '>=', $last30Days)
            ->count();
        $ordersPreviousMonth = Transaction::where('status', 'completed')
            ->whereBetween('created_at', [$previous30Days, $last30Days])
            ->count();
        $ordersChange = $ordersPreviousMonth > 0 
            ? round((($ordersLastMonth - $ordersPreviousMonth) / $ordersPreviousMonth) * 100) 
            : ($ordersLastMonth > 0 ? 100 : 0);

        // Get recent users (last 5)
        $recentUsers = User::orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => 'Active', // You can add status field to users table if needed
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    'created_at_formatted' => $user->created_at->diffForHumans(),
                ];
            });

        // Get recent activity (recent transactions/orders)
        $recentActivity = Transaction::with('user')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'type' => 'order',
                    'message' => "New order from {$transaction->user->name}",
                    'amount' => (float) $transaction->amount,
                    'status' => $transaction->status,
                    'created_at' => $transaction->created_at->format('Y-m-d H:i:s'),
                    'created_at_formatted' => $transaction->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalCourses' => $totalCourses,
                'totalRevenue' => (float) $totalRevenue,
                'totalOrders' => $totalOrders,
                'usersChange' => $usersChange,
                'coursesChange' => $coursesChange,
                'revenueChange' => $revenueChange,
                'ordersChange' => $ordersChange,
            ],
            'recentUsers' => $recentUsers,
            'recentActivity' => $recentActivity,
        ]);
    }
}

