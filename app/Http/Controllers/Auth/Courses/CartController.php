<?php

namespace App\Http\Controllers\Auth\Courses;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Course;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Display the cart page.
     */
    public function index(): Response
    {
        $cartItems = collect([]);
        $total = 0;

        if (Auth::check()) {
            $cartItems = Cart::where('user_id', Auth::id())
                ->with('course.category')
                ->get();

            $total = $cartItems->sum(function ($item) {
                return $item->course->discount_price ?? $item->course->price;
            });
        }

        // Check which payment gateways are enabled
        $razorpayEnabled = WebsiteSetting::getValue('razorpay_enabled', 'false') === 'true';
        $pinelabsEnabled = WebsiteSetting::getValue('pinelabs_enabled', 'false') === 'true';

        return Inertia::render('User/Pages/courses/Cart', [
            'cartItems' => $cartItems,
            'total' => $total,
            'paymentGateways' => [
                'razorpay' => $razorpayEnabled,
                'pinelabs' => $pinelabsEnabled,
            ],
        ]);
    }

    /**
     * Add a course to cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
        ]);

        $userId = Auth::id();
        $courseId = $request->course_id;

        // Check if course is already in cart
        $existingCart = Cart::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->first();

        if ($existingCart) {
            return back()->with('error', 'Course already in cart.');
        }

        // Check if user already purchased this course
        $course = Course::findOrFail($courseId);
        if ($course->isPurchasedBy($userId)) {
            return back()->with('error', 'You have already purchased this course.');
        }

        Cart::create([
            'user_id' => $userId,
            'course_id' => $courseId,
        ]);

        return back()->with('success', 'Course added to cart successfully.');
    }

    /**
     * Remove a course from cart.
     */
    public function destroy($id)
    {
        $cartItem = Cart::where('user_id', Auth::id())
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->delete();

        return back()->with('success', 'Course removed from cart.');
    }

    /**
     * Get cart count (for API/AJAX requests).
     */
    public function count()
    {
        $count = 0;
        if (Auth::check()) {
            $count = Cart::where('user_id', Auth::id())->count();
        }
        return response()->json(['count' => $count]);
    }
}

