<?php

namespace App\Services\Payment;

use App\Models\Cart;
use App\Models\Course;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Exception;

class PinelabsService implements PaymentGatewayInterface
{
    private string $clientId;
    private string $clientSecret;
    private string $merchantId;
    private string $baseUrl;

    private ?string $accessToken = null;
    private ?int $tokenExpiresAt = null;

    public function __construct()
    {
        $this->clientId     = config('services.pinelabs.client_id');
        $this->clientSecret = config('services.pinelabs.client_secret');
        $this->merchantId   = config('services.pinelabs.merchant_id');
        $this->baseUrl      = rtrim(config('services.pinelabs.base_url'), '/');

        if (!$this->clientId || !$this->clientSecret || !$this->merchantId || !$this->baseUrl) {
            throw new Exception('Pine Labs configuration missing');
        }
    }

    /* ================= ACCESS TOKEN ================= */

    private function getAccessToken(): string
    {
        if ($this->accessToken && $this->tokenExpiresAt > time()) {
            return $this->accessToken;
        }

        $response = Http::acceptJson()->post("{$this->baseUrl}/api/auth/v1/token", [
            'client_id'     => $this->clientId,
            'client_secret' => $this->clientSecret,
            'grant_type'    => 'client_credentials',
        ]);

        if (!$response->successful()) {
            Log::error('Pine Labs token request failed', [
                'status' => $response->status(),
                'body'   => $response->json(),
            ]);
            throw new Exception('Failed to get Pine Labs access token: ' . $response->body());
        }

        $data = $response->json();
        if (!isset($data['access_token'])) {
            throw new Exception('Failed to get Pine Labs access token');
        }

        $this->accessToken = $data['access_token'];
        $this->tokenExpiresAt = time() + ($data['expires_in'] ?? 3600) - 60;

        return $this->accessToken;
    }

    /* ================= CREATE ORDER ================= */

    public function createOrder(array $data): array
    {
        $user = Auth::user();
        if (!$user || !$user->email) {
            throw new Exception('User email required');
        }

        $customCourseName = $data['course_name'] ?? null;
        $courseIds = $data['course_ids'] ?? [];

        if ($customCourseName) {
            $amount = (float) $data['amount'];
        } else {
            $courses = Course::whereIn('id', $courseIds)->get();
            if ($courses->isEmpty()) {
                throw new Exception('No valid courses found');
            }

            $amount = (float) $courses->sum(fn ($c) => $c->discount_price ?? $c->price);
        }

        $amount = max(1.0, $amount);
        // Pine Labs: value in paise (integer), minimum 100 paise = ₹1
        $amountPaise = (int) round($amount * 100);
        $amountPaise = max(100, $amountPaise);

        $merchantOrderReference = (string) Str::uuid();

        $transaction = Transaction::create([
            'user_id'              => $user->id,
            'pinelabs_order_id'    => $merchantOrderReference,
            'amount'               => $amount,
            'currency'             => 'INR',
            'status'               => 'pending',
            'course_ids'           => $courseIds,
            'notes'                => $customCourseName ? 'Manual course payment: ' . $customCourseName : null,
            'payment_gateway'      => 'pinelabs',
        ]);

        $token = $this->getAccessToken();

        /* ---------- Generate Checkout Link (single step – no separate Create Order) ---------- */
        /* Base URL from .env PINELABS_PAYMENT_URL (e.g. https://pluraluat.v2.pinepg.in) */
        /* Customer: first_name, last_name letters only min 1; customer_id max 19; mobile 9–20 digits, national only if country 91 */

        $userName = trim((string) ($user->name ?? ''));
        $userName = preg_replace('/[^a-zA-Z\s]/', '', $userName);
        $nameParts = $userName !== '' ? array_filter(explode(' ', $userName, 2)) : [];
        $firstName = isset($nameParts[0]) ? Str::limit(trim($nameParts[0]), 50, '') : '';
        $lastName = isset($nameParts[1]) ? Str::limit(trim($nameParts[1]), 50, '') : '';
        $firstName = $firstName !== '' ? $firstName : 'Customer';
        $lastName = $lastName !== '' ? $lastName : 'User';

        $mobileDigits = preg_replace('/\D/', '', (string) ($user->phone ?? '9999999999'));
        if (strlen($mobileDigits) >= 12 && str_starts_with($mobileDigits, '91')) {
            $mobileDigits = substr($mobileDigits, 2);
        }
        $mobileNumber = strlen($mobileDigits) >= 9 ? substr($mobileDigits, 0, 20) : '9999999999';

        $customerId = Str::limit((string) $user->id, 19, '');
        $merchantId = ctype_digit((string) $this->merchantId) ? (int) $this->merchantId : $this->merchantId;

        $checkoutPayload = [
            'merchant_id'               => $merchantId,
            'merchant_order_reference'  => $merchantOrderReference,
            'order_amount'              => [
                'value'    => $amountPaise,
                'currency' => 'INR',
            ],
            'pre_auth'                  => false,
            'callback_url'              => route('pinelabs.webhook'),
            'purchase_details'          => [
                'customer' => [
                    'customer_id'   => $customerId,
                    'email_id'      => $user->email,
                    'first_name'    => $firstName,
                    'last_name'    => $lastName,
                    'mobile_number' => $mobileNumber,
                    'country_code'  => '91',
                ],
            ],
        ];

        $checkoutResponse = Http::withToken($token)
            ->acceptJson()
            ->post("{$this->baseUrl}/api/checkout/v1/orders", $checkoutPayload);

        if (!$checkoutResponse->successful()) {
            Log::error('Pine Labs checkout API failed', [
                'status' => $checkoutResponse->status(),
                'body'   => $checkoutResponse->json(),
            ]);
            throw new Exception('Pine Labs checkout failed: ' . $checkoutResponse->body());
        }

        $checkoutData = $checkoutResponse->json();

        // Response may have redirect_url at top level or under data
        $redirectUrl = $checkoutData['redirect_url'] ?? $checkoutData['data']['redirect_url'] ?? null;
        if (!$redirectUrl) {
            Log::error('Pine Labs checkout session failed', $checkoutData);
            throw new Exception('Pine Labs checkout URL not returned');
        }

        return [
            'transaction_id' => $transaction->id,
            'gateway'        => 'pinelabs',
            'gateway_data'   => [
                'action_url'  => $redirectUrl,
                'is_redirect' => true,
            ],
        ];
    }

    /**
     * Verify Pine Labs payment from success redirect or webhook.
     * Updates transaction and fulfills order (adds courses to user).
     */
    public function verifyPayment(Request $request): array
    {
        $orderRef = $request->input('merchant_order_reference') ?? $request->input('order_id');
        if (!$orderRef) {
            return ['success' => false, 'error' => 'Order reference missing'];
        }

        $transaction = Transaction::where('pinelabs_order_id', $orderRef)->first();
        if (!$transaction) {
            return ['success' => false, 'error' => 'Transaction not found'];
        }

        $responseCode = $request->input('response_code');
        $paymentStatus = $request->input('payment_status');
        $success = ($responseCode === '00' || $responseCode === '000' || $paymentStatus === 'SUCCESS' || $paymentStatus === 'success');

        if (!$success) {
            $transaction->update(['status' => 'failed']);
            return ['success' => false, 'error' => 'Payment not successful'];
        }

        DB::beginTransaction();
        try {
            $transaction->update([
                'status'               => 'completed',
                'pinelabs_payment_id'   => $request->input('payment_id') ?? $request->input('transaction_id'),
            ]);

            $userId = $transaction->user_id;
            $courseIds = $transaction->course_ids ?? [];

            foreach ($courseIds as $courseId) {
                $exists = DB::table('course_user')
                    ->where('user_id', $userId)
                    ->where('course_id', $courseId)
                    ->exists();
                if (!$exists) {
                    DB::table('course_user')->insert([
                        'user_id'        => $userId,
                        'course_id'      => $courseId,
                        'transaction_id' => $transaction->id,
                        'purchased_at'   => now(),
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ]);
                }
            }

            Cart::where('user_id', $userId)->whereIn('course_id', $courseIds)->delete();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Pine Labs fulfillment failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return ['success' => false, 'error' => $e->getMessage()];
        }

        return ['success' => true];
    }
}
