<?php

namespace App\Services\Payment;

use App\Models\Cart;
use App\Models\Course;
use App\Models\Transaction;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
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

        $response = $this->httpClient()
            ->post("{$this->baseUrl}/api/auth/v1/token", [
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

        $checkoutPayload = [
            'merchant_order_reference'  => $merchantOrderReference,
            'order_amount'              => [
                'value'    => $amountPaise,
                'currency' => 'INR',
            ],
            'integration_mode'           => 'REDIRECT',
            'pre_auth'                  => false,
            'callback_url'              => route('pinelabs.webhook', ['transaction_id' => $transaction->id]),
            'failure_callback_url'      => route('pinelabs.webhook', ['transaction_id' => $transaction->id]),
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

        $checkoutResponse = $this->postCheckoutOrder($token, $checkoutPayload);

        if (!$checkoutResponse->successful()) {
            $transaction->update(['status' => 'failed']);
            Log::error('Pine Labs checkout API failed', [
                'status' => $checkoutResponse->status(),
                'body'   => $checkoutResponse->json(),
            ]);
            throw new Exception($this->checkoutErrorMessage($checkoutResponse));
        }

        $checkoutData = $checkoutResponse->json();

        // Response may have redirect_url at top level or under data
        $redirectUrl = $checkoutData['redirect_url'] ?? $checkoutData['data']['redirect_url'] ?? null;
        $pinelabsOrderId = $checkoutData['order_id'] ?? $checkoutData['data']['order_id'] ?? null;

        if ($pinelabsOrderId) {
            $transaction->update(['pinelabs_order_id' => $pinelabsOrderId]);
        }

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
        $orderId = $request->input('order_id');
        $merchantOrderReference = $request->input('merchant_order_reference');
        $transactionId = $request->input('transaction_id');

        if (!$orderId && !$merchantOrderReference && !$transactionId) {
            return ['success' => false, 'error' => 'Order reference missing'];
        }

        $transaction = $transactionId ? Transaction::find($transactionId) : null;

        if (!$transaction && $orderId) {
            $transaction = Transaction::where('pinelabs_order_id', $orderId)->first();
        }

        if (!$transaction && $merchantOrderReference) {
            $transaction = Transaction::where('pinelabs_order_id', $merchantOrderReference)->first();
        }

        if (!$transaction) {
            return ['success' => false, 'error' => 'Transaction not found'];
        }

        if ($orderId && $transaction->pinelabs_order_id !== $orderId) {
            $transaction->update(['pinelabs_order_id' => $orderId]);
        }

        if (!$this->hasValidSignature($request)) {
            $transaction->update(['status' => 'failed']);
            return ['success' => false, 'error' => 'Invalid Pine Labs signature'];
        }

        $latestOrder = $orderId ? $this->fetchOrder($orderId) : null;
        $status = strtoupper((string) (
            $latestOrder['status']
            ?? $request->input('status')
            ?? $request->input('payment_status')
            ?? ''
        ));
        $responseCode = (string) $request->input('response_code');
        $success = in_array($status, ['PROCESSED', 'AUTHORIZED', 'SUCCESS'], true)
            || in_array($responseCode, ['00', '000', '200'], true);

        if (!$success) {
            $transaction->update(['status' => 'failed']);
            return ['success' => false, 'error' => 'Payment not successful'];
        }

        DB::beginTransaction();
        try {
            $transaction->update([
                'status'               => 'completed',
                'pinelabs_payment_id'   => $this->paymentIdFromOrder($latestOrder) ?? $request->input('payment_id') ?? $request->input('pine_pg_transaction_id'),
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

    private function pluralHeaders(): array
    {
        return [
            'Request-ID' => (string) Str::uuid(),
            'Request-Timestamp' => now()->utc()->format('Y-m-d\TH:i:s.v\Z'),
        ];
    }

    private function httpClient(?string $token = null): PendingRequest
    {
        $request = Http::acceptJson()
            ->withHeaders($this->pluralHeaders())
            ->withOptions($this->sslOptions());

        return $token ? $request->withToken($token) : $request;
    }

    private function postCheckoutOrder(string $token, array $payload): Response
    {
        $response = $this->httpClient($token)
            ->post("{$this->baseUrl}/api/checkout/v1/orders", $payload);

        if ($response->successful() || !$this->isPineLabsTimeout($response)) {
            return $response;
        }

        Log::warning('Retrying Pine Labs checkout after upstream timeout', [
            'status' => $response->status(),
            'trace_id' => $response->json('traceId'),
            'merchant_order_reference' => $payload['merchant_order_reference'] ?? null,
        ]);

        usleep(500000);

        return $this->httpClient($token)
            ->post("{$this->baseUrl}/api/checkout/v1/orders", $payload);
    }

    private function isPineLabsTimeout(Response $response): bool
    {
        $body = strtolower($response->body());

        return str_contains($body, 'readtimeoutexception')
            || str_contains($body, 'timeout');
    }

    private function checkoutErrorMessage(Response $response): string
    {
        if ($this->isPineLabsTimeout($response)) {
            return 'Pine Labs checkout service timed out while creating the payment link. Please try again in a minute. If it repeats, ask Pine Labs support to check the merchant configuration for this UAT account.';
        }

        return 'Pine Labs checkout failed: ' . $response->body();
    }

    private function sslOptions(): array
    {
        if (!filter_var(config('services.pinelabs.verify_ssl', true), FILTER_VALIDATE_BOOLEAN)) {
            return ['verify' => false];
        }

        $caCertPath = config('services.pinelabs.ca_cert_path');

        if ($caCertPath && is_file($caCertPath)) {
            return ['verify' => $caCertPath];
        }

        return [];
    }

    private function hasValidSignature(Request $request): bool
    {
        $signature = $request->input('signature');

        if (!$signature) {
            Log::warning('Pine Labs callback received without signature', [
                'order_id' => $request->input('order_id'),
                'transaction_id' => $request->input('transaction_id'),
            ]);
            return true;
        }

        $payload = collect($request->except('signature', 'transaction_id', '_token'))
            ->filter(fn ($value) => $value !== null && $value !== '')
            ->sortKeys()
            ->map(fn ($value, $key) => $key . '=' . $value)
            ->implode('&');

        $secret = ctype_xdigit($this->clientSecret) && strlen($this->clientSecret) % 2 === 0
            ? hex2bin($this->clientSecret)
            : $this->clientSecret;

        $expected = strtoupper(hash_hmac('sha256', $payload, $secret));

        return hash_equals($expected, strtoupper((string) $signature));
    }

    private function fetchOrder(string $orderId): ?array
    {
        try {
            $response = $this->httpClient($this->getAccessToken())
                ->get("{$this->baseUrl}/api/pay/v1/orders/{$orderId}");

            if (!$response->successful()) {
                Log::warning('Pine Labs order status fetch failed', [
                    'order_id' => $orderId,
                    'status' => $response->status(),
                    'body' => $response->json(),
                ]);
                return null;
            }

            return $response->json('data') ?? $response->json();
        } catch (Exception $e) {
            Log::warning('Pine Labs order status fetch error', [
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    private function paymentIdFromOrder(?array $order): ?string
    {
        if (!$order || empty($order['payments']) || !is_array($order['payments'])) {
            return null;
        }

        return $order['payments'][0]['id'] ?? null;
    }
}
