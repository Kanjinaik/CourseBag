<?php

namespace App\Http\Controllers\Auth\Courses;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Transaction;
use App\Services\Payment\RazorpayService;
use App\Services\Payment\PinelabsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Exception;

class PaymentController extends Controller
{
    public function createOrder(Request $request)
    {
        // Immediate logging to see if method is called
        \Log::info('PAYMENT CONTROLLER CALLED - START', [
            'timestamp' => now(),
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip(),
            'user_id' => auth()->id(),
            'csrf_token' => $request->header('X-CSRF-TOKEN'),
            'session_id' => session()->getId(),
            'all_headers' => $request->headers->all()
        ]);

        \Log::info('Payment createOrder called', [
            'request_data' => $request->all(),
            'user_id' => auth()->id(),
            'headers' => $request->headers->all(),
            'method' => $request->method(),
            'url' => $request->fullUrl()
        ]);

        // Handle GET requests (redirect to cart with error)
        if ($request->method() === 'GET') {
            \Log::warning('GET request to createOrder - redirecting to cart', [
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'referer' => $request->header('referer')
            ]);
            return redirect()->route('cart.index')->with('error', 'Please select courses and proceed to checkout from the cart page.');
        }

        $rules = [
            'gateway' => 'required|in:razorpay,pinelabs',
        ];

        if ($request->boolean('custom_course')) {
            $rules['course_name'] = 'required|string|max:255';
            $rules['amount'] = 'required|numeric|min:1|max:999999.99';
        } else {
            $rules['course_ids'] = 'required|array';
            $rules['course_ids.*'] = 'exists:courses,id';
        }

        $request->validate($rules);

        try {
            // Check authentication
            if (!Auth::check()) {
                \Log::error('User not authenticated for payment', [
                    'user_id' => Auth::id(),
                    'auth_check' => Auth::check(),
                    'session_id' => session()->getId()
                ]);
                throw new Exception('User not authenticated');
            }

            \Log::info('Creating payment service', ['gateway' => $request->gateway]);

            try {
                $service = $this->getPaymentService($request->gateway);
                \Log::info('Payment service created successfully', ['service_class' => get_class($service)]);
            } catch (Exception $e) {
                \Log::error('Failed to create payment service', [
                    'gateway' => $request->gateway,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }

            \Log::info('Calling createOrder on service', ['service_class' => get_class($service)]);

            $orderData = $request->boolean('custom_course')
                ? [
                    'course_ids' => [],
                    'course_name' => $request->course_name,
                    'amount' => $request->amount,
                ]
                : [
                    'course_ids' => $request->course_ids,
                ];

            $result = $service->createOrder($orderData);

            \Log::info('Order created successfully', ['result' => $result]);

            return response()->json($result);

        } catch (Exception $e) {
            \Log::error('Payment createOrder failed', [
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'gateway' => $request->gateway ?? 'unknown',
                'course_ids' => $request->course_ids ?? [],
                'stack_trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function paymentSuccess(Request $request)
    {
        // Determine gateway from request parameters
        $gateway = $this->determineGateway($request);

        try {
            $service = $this->getPaymentService($gateway);

            // Find transaction - different logic for different gateways
            $transaction = $this->findTransaction($request, $gateway);

            if (!$transaction) {
                throw new Exception('Transaction not found');
            }

            // For PineLabs, the service handles verification and fulfillment internally
            if ($gateway === 'pinelabs') {
                $verification = $service->verifyPayment($request);

                if (!$verification['success']) {
                    throw new Exception('Payment verification failed');
                }

                // PineLabs service already updates transaction and adds courses
                return redirect()->route('mycourses.index')
                    ->with('success', 'Payment successful! Courses have been added to your account.');
            }

            // Razorpay verification (existing logic)
            $verification = $service->verifyPayment($request);

            if (!$verification['success']) {
                throw new Exception($verification['error'] ?? 'Payment verification failed');
            }

            DB::beginTransaction();

            $updateData = ['status' => 'completed'];

            if ($gateway === 'razorpay') {
                $updateData['razorpay_payment_id'] = $verification['payment_id'];
                $updateData['razorpay_signature'] = $verification['signature'];
            }

            $transaction->update($updateData);

            $this->fulfillOrder($transaction);

            DB::commit();

            return redirect()->route('mycourses.index')
                ->with('success', 'Payment successful! Courses have been added to your account.');

        } catch (Exception $e) {
            DB::rollBack();
            if (isset($transaction)) {
                $transaction->update(['status' => 'failed']);
            }

            return redirect()->route('cart.index')
                ->with('error', 'Payment failed: ' . $e->getMessage());
        }
    }

    public function paymentFailure(Request $request)
    {
        if ($request->has('transaction_id')) {
            $transaction = Transaction::find($request->transaction_id);
            if ($transaction) {
                $transaction->update(['status' => 'failed']);
            }
        }
        return redirect()->route('cart.index')
            ->with('error', 'Payment failed. Please try again.');
    }

    /**
     * Pine Labs webhook / callback – called when payment status is updated.
     */
    /**
     * Pine Labs callback: GET = user redirect after payment, POST = server webhook.
     */
    public function pinelabsWebhook(Request $request)
    {
        \Log::info('Pine Labs webhook received', ['method' => $request->method(), 'input' => $request->all()]);

        try {
            $service = $this->getPaymentService('pinelabs');
            $verification = $service->verifyPayment($request);
            if ($verification['success']) {
                if ($request->isMethod('GET')) {
                    return redirect()->route('mycourses.index')
                        ->with('success', 'Payment successful! Courses have been added to your account.');
                }
                return response()->json(['received' => true], 200);
            }
        } catch (Exception $e) {
            \Log::error('Pine Labs webhook error', ['error' => $e->getMessage()]);
        }

        if ($request->isMethod('GET')) {
            return redirect()->route('cart.index')
                ->with('error', 'Payment could not be completed. Please try again.');
        }
        return response()->json(['received' => true], 200);
    }

    private function determineGateway(Request $request): string
    {
        // Check for PineLabs specific parameters
        if ($request->has(['order_id', 'response_code']) ||
            $request->has('merchant_order_reference') ||
            $request->has('payment_status')) {
            return 'pinelabs';
        }

        // Default to Razorpay for backward compatibility
        return 'razorpay';
    }

    private function findTransaction(Request $request, string $gateway): ?Transaction
    {
        // Try transaction_id first (passed from frontend)
        if ($request->has('transaction_id')) {
            return Transaction::find($request->transaction_id);
        }

        // Gateway-specific lookup
        if ($gateway === 'razorpay') {
            $orderId = $request->input('razorpay_order_id');
            if ($orderId) {
                return Transaction::where('razorpay_order_id', $orderId)->first();
            }
        } elseif ($gateway === 'pinelabs') {
            $orderRef = $request->input('merchant_order_reference') ?? $request->input('order_id');
            if ($orderRef) {
                return Transaction::where('pinelabs_order_id', $orderRef)->first();
            }
        }

        return null;
    }

    private function getPaymentService($gateway)
    {
        switch ($gateway) {
            case 'razorpay':
                return new RazorpayService();
            case 'pinelabs':
                return new PinelabsService();
            default:
                throw new Exception('Invalid payment gateway selected.');
        }
    }

    private function fulfillOrder(Transaction $transaction)
    {
        $userId = $transaction->user_id;
        $courseIds = $transaction->course_ids;

        foreach ($courseIds as $courseId) {
            $exists = DB::table('course_user')
                ->where('user_id', $userId)
                ->where('course_id', $courseId)
                ->exists();

            if (!$exists) {
                DB::table('course_user')->insert([
                    'user_id' => $userId,
                    'course_id' => $courseId,
                    'transaction_id' => $transaction->id,
                    'purchased_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        Cart::where('user_id', $userId)
            ->whereIn('course_id', $courseIds)
            ->delete();
    }
}

