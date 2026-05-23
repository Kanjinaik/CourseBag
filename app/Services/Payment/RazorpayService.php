<?php

namespace App\Services\Payment;

use App\Models\Course;
use App\Models\Transaction;
use Razorpay\Api\Api;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Exception;

class RazorpayService implements PaymentGatewayInterface
{
    private $razorpay;
    
    public function __construct()
    {
        $keyId = config('razorpay.key_id') ?: env('RAZORPAY_KEY_ID');
        $keySecret = config('razorpay.key_secret') ?: env('RAZORPAY_KEY_SECRET');
        
        if ($keyId && $keySecret) {
            try {
                $this->razorpay = new Api($keyId, $keySecret);
            } catch (Exception $e) {
                \Log::error('Razorpay initialization failed: ' . $e->getMessage());
            }
        }
    }

    public function createOrder(array $data)
    {
        if (!$this->razorpay) {
            throw new Exception('Razorpay is not configured.');
        }

        $userId = Auth::id();
        $courseIds = $data['course_ids'] ?? [];
        $customCourseName = $data['course_name'] ?? null;

        if ($customCourseName) {
            $total = (float) $data['amount'];
        } else {
            // Get courses and calculate total
            $courses = Course::whereIn('id', $courseIds)->get();
            $total = $courses->sum(function ($course) {
                return $course->discount_price ?? $course->price;
            });
        }

        $amountInPaise = (int)($total * 100);

        try {
            $orderData = [
                'receipt' => 'order_' . time(),
                'amount' => $amountInPaise,
                'currency' => 'INR',
                'notes' => [
                    'user_id' => $userId,
                    'course_ids' => $courseIds,
                    'course_name' => $customCourseName,
                ],
            ];

            $razorpayOrder = $this->razorpay->order->create($orderData);

            $transaction = Transaction::create([
                'user_id' => $userId,
                'razorpay_order_id' => $razorpayOrder['id'],
                'amount' => $total,
                'currency' => 'INR',
                'status' => 'pending',
                'course_ids' => $courseIds,
                'notes' => $customCourseName ? 'Manual course payment: ' . $customCourseName : null,
                'payment_gateway' => 'razorpay',
            ]);

            return [
                'order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'],
                'key_id' => config('razorpay.key_id') ?: env('RAZORPAY_KEY_ID'),
                'transaction_id' => $transaction->id,
                'gateway' => 'razorpay'
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to create Razorpay order: ' . $e->getMessage());
        }
    }

    public function verifyPayment(Request $request)
    {
        if (!$this->razorpay) {
            throw new Exception('Razorpay is not configured.');
        }

        $attributes = [
            'razorpay_order_id' => $request->razorpay_order_id,
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature' => $request->razorpay_signature,
        ];

        try {
            $this->razorpay->utility->verifyPaymentSignature($attributes);
            return [
                'success' => true,
                'payment_id' => $request->razorpay_payment_id,
                'signature' => $request->razorpay_signature,
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
