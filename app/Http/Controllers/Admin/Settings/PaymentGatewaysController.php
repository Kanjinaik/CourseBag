<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class PaymentGatewaysController extends Controller
{
    /**
     * Display a listing of payment gateways.
     */
    public function index(): Response
    {
        $razorpayEnabled = WebsiteSetting::getValue('razorpay_enabled', 'false') === 'true';
        $razorpayKeyId = env('RAZORPAY_KEY_ID', '');
        $razorpayKeySecret = env('RAZORPAY_KEY_SECRET', '');
        
        $pinelabsEnabled = WebsiteSetting::getValue('pinelabs_enabled', 'false') === 'true';
        $pinelabsMerchantId = env('PINELABS_MERCHANT_ID', '');
        $pinelabsClientId = env('PINELABS_CLIENT_ID', '');
        $pinelabsClientSecret = env('PINELABS_CLIENT_SECRET', '');

        $gateways = [
            [
                'id' => 'razorpay',
                'name' => 'Razorpay',
                'description' => 'Accept payments via Razorpay payment gateway',
                'icon' => 'credit-card',
                'enabled' => $razorpayEnabled && !empty($razorpayKeyId) && !empty($razorpayKeySecret),
            ],
            [
                'id' => 'pinelabs',
                'name' => 'PineLabs',
                'description' => 'Accept payments via PineLabs Plural payment gateway',
                'icon' => 'credit-card',
                'enabled' => $pinelabsEnabled && !empty($pinelabsMerchantId) && !empty($pinelabsClientId) && !empty($pinelabsClientSecret),
            ],
        ];

        return Inertia::render('Admin/Settings/Payments/Index', [
            'gateways' => $gateways,
        ]);
    }

    /**
     * Show the form for editing a payment gateway.
     */
    public function show(string $gateway): Response
    {
        $validGateways = ['razorpay', 'pinelabs'];
        
        if (!in_array($gateway, $validGateways)) {
            abort(404);
        }

        if ($gateway === 'razorpay') {
            $gatewayData = [
                'id' => 'razorpay',
                'name' => 'Razorpay',
                'description' => 'Accept payments via Razorpay payment gateway',
                'key_id' => env('RAZORPAY_KEY_ID', ''),
                'key_secret' => env('RAZORPAY_KEY_SECRET', ''),
                'is_enabled' => WebsiteSetting::getValue('razorpay_enabled', 'false') === 'true',
            ];
        } else {
            $gatewayData = [
                'id' => 'pinelabs',
                'name' => 'PineLabs',
                'description' => 'Accept payments via PineLabs Plural payment gateway',
                'merchant_id' => env('PINELABS_MERCHANT_ID', ''),
                'client_id' => env('PINELABS_CLIENT_ID', ''),
                'client_secret' => env('PINELABS_CLIENT_SECRET', ''),
                'payment_url' => env('PINELABS_PAYMENT_URL', 'https://pluraluat.v2.pinepg.in'),
                'is_enabled' => WebsiteSetting::getValue('pinelabs_enabled', 'false') === 'true',
            ];
        }

        return Inertia::render('Admin/Settings/Payments/Edit', [
            'gateway' => $gatewayData,
        ]);
    }

    /**
     * Update payment gateway settings.
     */
    public function update(Request $request, string $gateway): RedirectResponse
    {
        $validGateways = ['razorpay', 'pinelabs'];
        
        if (!in_array($gateway, $validGateways)) {
            abort(404);
        }

        if ($gateway === 'razorpay') {
            $validated = $request->validate([
                'key_id' => 'required|string|max:255',
                'key_secret' => 'required|string|max:255',
                'is_enabled' => 'nullable',
            ]);
        } else {
            $validated = $request->validate([
                'merchant_id' => 'nullable|string|max:255',
                'client_id' => 'nullable|string|max:255',
                'client_secret' => 'nullable|string|max:255',
                'payment_url' => 'nullable|url|max:255',
                'is_enabled' => 'nullable',
            ]);
        }

        // Convert is_enabled to boolean
        $isEnabled = $validated['is_enabled'] ?? false;
        if (is_string($isEnabled)) {
            $isEnabled = in_array(strtolower($isEnabled), ['1', 'true', 'on', 'yes']);
        } else {
            $isEnabled = (bool) $isEnabled;
        }
        $validated['is_enabled'] = $isEnabled;

        // Store enabled status in database
        WebsiteSetting::setValue($gateway . '_enabled', $isEnabled ? 'true' : 'false');

        // Update .env file
        $envFile = base_path('.env');
        
        if (!File::exists($envFile)) {
            return redirect()
                ->route('admin.settings.payments.show', $gateway)
                ->with('error', '.env file not found.');
        }

        $envContent = File::get($envFile);
        $lines = explode("\n", $envContent);

        if ($gateway === 'razorpay') {
            $keysToUpdate = [
                'RAZORPAY_KEY_ID' => $validated['key_id'],
                'RAZORPAY_KEY_SECRET' => $validated['key_secret'],
            ];
        } else {
            $keysToUpdate = [
                'PINELABS_MERCHANT_ID' => $validated['merchant_id'] ?? '',
                'PINELABS_CLIENT_ID' => $validated['client_id'] ?? '',
                'PINELABS_CLIENT_SECRET' => $validated['client_secret'] ?? '',
                'PINELABS_PAYMENT_URL' => $validated['payment_url'] ?? 'https://pluraluat.v2.pinepg.in',
            ];
        }

        $found = [];
        foreach ($lines as $index => $line) {
            $trimmedLine = trim($line);
            foreach ($keysToUpdate as $key => $value) {
                if (strpos($trimmedLine, $key . '=') === 0) {
                    $lines[$index] = $key . '=' . $value;
                    $found[$key] = true;
                }
            }
        }

        // Add missing keys
        foreach ($keysToUpdate as $key => $value) {
            if (!isset($found[$key])) {
                $lines[] = $key . '=' . $value;
            }
        }

        File::put($envFile, implode("\n", $lines));
        
        // Clear config cache to reload .env values
        \Artisan::call('config:clear');
        
        return redirect()
            ->route('admin.settings.payments.show', $gateway)
            ->with('success', 'Payment gateway settings updated successfully.');
    }

    /**
     * Toggle payment gateway enabled status (for dynamic updates).
     */
    public function toggleStatus(Request $request, string $gateway)
    {
        $validGateways = ['razorpay', 'pinelabs'];
        
        if (!in_array($gateway, $validGateways)) {
            return response()->json(['error' => 'Invalid gateway'], 404);
        }

        $request->validate([
            'is_enabled' => 'required|boolean',
        ]);

        $isEnabled = $request->boolean('is_enabled');
        WebsiteSetting::setValue($gateway . '_enabled', $isEnabled ? 'true' : 'false');

        return response()->json([
            'success' => true,
            'is_enabled' => $isEnabled,
            'message' => $isEnabled ? 'Payment gateway enabled successfully.' : 'Payment gateway disabled successfully.',
        ]);
    }
}

