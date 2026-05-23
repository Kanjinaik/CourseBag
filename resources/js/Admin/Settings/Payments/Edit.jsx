import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';

export default function PaymentGatewayEdit({ gateway }) {
    const { flash } = usePage().props;
    const [isEnabled, setIsEnabled] = useState(gateway.is_enabled || false);
    const [toggling, setToggling] = useState(false);

    const isPinelabs = gateway.id === 'pinelabs';

    const { data, setData, put, processing, errors } = useForm(
        isPinelabs
            ? {
                merchant_id: gateway.merchant_id || '',
                client_id: gateway.client_id || '',
                client_secret: gateway.client_secret || '',
                payment_url: gateway.payment_url || 'https://pluraluat.v2.pinepg.in',
                is_enabled: gateway.is_enabled || false,
            }
            : {
                key_id: gateway.key_id || '',
                key_secret: gateway.key_secret || '',
                is_enabled: gateway.is_enabled || false,
            }
    );

    const handleToggleStatus = async (e) => {
        e.preventDefault();
        const newStatus = !isEnabled;
        setToggling(true);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch(`/admin/settings/payments/${gateway.id}/toggle-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({ is_enabled: newStatus }),
            });

            const result = await response.json();

            if (result.success) {
                setIsEnabled(newStatus);
                setData('is_enabled', newStatus);
                // Don't reload - just update local state
            } else {
                alert(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setToggling(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/settings/payments/${gateway.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout title={`${gateway.name} Settings`}>
            <Head title={`${gateway.name} Settings`} />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Back Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{gateway.name} Settings</h1>
                        <p className="text-sm text-gray-600 mt-1">{gateway.description}</p>
                    </div>
                    <Link
                        href="/admin/settings/payments"
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← Back to Payment Gateways
                    </Link>
                </div>

                {/* Error Messages */}
                {Object.keys(errors).length > 0 && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                        <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Please fix the following errors:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                            {Object.entries(errors).map(([key, message]) => (
                                <li key={key}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">API Configuration</h2>
                            <p className="text-sm text-gray-500 mt-1">Enter your {gateway.name} API credentials</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Hidden input to ensure is_enabled is always sent */}
                            <input type="hidden" name="is_enabled" value={data.is_enabled ? '1' : '0'} />

                            {/* Enable/Disable Switch */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label htmlFor="is_enabled_switch" className="block text-sm font-medium text-gray-900 mb-1">
                                            Payment Gateway Status
                                        </label>
                                        <p className="text-xs text-gray-500">
                                            Enable or disable {gateway.name} payment gateway
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleToggleStatus}
                                        disabled={toggling}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isEnabled ? 'bg-emerald-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                        />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center">
                                    {toggling ? (
                                        <span className="text-sm text-gray-500 flex items-center">
                                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </span>
                                    ) : (
                                        <span className={`text-sm font-medium ${isEnabled ? 'text-emerald-600' : 'text-gray-500'
                                            }`}>
                                            {isEnabled ? '✓ Enabled' : '✗ Disabled'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Fields based on gateway type */}
                            {isPinelabs ? (
                                <>
                                    {/* Merchant ID */}
                                    <div>
                                        <label htmlFor="merchant_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Merchant ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="merchant_id"
                                            value={data.merchant_id}
                                            onChange={(e) => setData('merchant_id', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="Enter your Merchant ID"
                                        />
                                        {errors.merchant_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.merchant_id}</p>
                                        )}
                                    </div>

                                    {/* Client ID */}
                                    <div>
                                        <label htmlFor="client_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Client ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="client_id"
                                            value={data.client_id}
                                            onChange={(e) => setData('client_id', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="Enter your Client ID"
                                        />
                                        {errors.client_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.client_id}</p>
                                        )}
                                    </div>

                                    {/* Client Secret */}
                                    <div>
                                        <label htmlFor="client_secret" className="block text-sm font-medium text-gray-700 mb-2">
                                            Client Secret <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            id="client_secret"
                                            value={data.client_secret}
                                            onChange={(e) => setData('client_secret', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="Enter your Client Secret"
                                        />
                                        {errors.client_secret && (
                                            <p className="mt-1 text-sm text-red-600">{errors.client_secret}</p>
                                        )}
                                    </div>

                                    {/* Payment URL */}
                                    <div>
                                        <label htmlFor="payment_url" className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment API URL <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="url"
                                            id="payment_url"
                                            value={data.payment_url}
                                            onChange={(e) => setData('payment_url', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="https://pluraluat.v2.pinepg.in/api"
                                        />
                                        {errors.payment_url && (
                                            <p className="mt-1 text-sm text-red-600">{errors.payment_url}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            UAT: https://pluraluat.v2.pinepg.in | Production: https://api.pluralpay.in
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Key ID */}
                                    <div>
                                        <label htmlFor="key_id" className="block text-sm font-medium text-gray-700 mb-2">
                                            Key ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="key_id"
                                            value={data.key_id}
                                            onChange={(e) => setData('key_id', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="Enter your Key ID"
                                            required
                                        />
                                        {errors.key_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.key_id}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Your Razorpay Key ID can be found in your Razorpay Dashboard
                                        </p>
                                    </div>

                                    {/* Key Secret */}
                                    <div>
                                        <label htmlFor="key_secret" className="block text-sm font-medium text-gray-700 mb-2">
                                            Key Secret <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            id="key_secret"
                                            value={data.key_secret}
                                            onChange={(e) => setData('key_secret', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                            placeholder="Enter your Key Secret"
                                            required
                                        />
                                        {errors.key_secret && (
                                            <p className="mt-1 text-sm text-red-600">{errors.key_secret}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">
                                            Your Razorpay Key Secret can be found in your Razorpay Dashboard
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-blue-900 mb-1">How to get your API keys?</h4>
                                        {isPinelabs ? (
                                            <>
                                                <p className="text-xs text-blue-800 mb-2">
                                                    1. Log in to your PineLabs Merchant Dashboard
                                                </p>
                                                <p className="text-xs text-blue-800 mb-2">
                                                    2. Navigate to Settings → API Credentials
                                                </p>
                                                <p className="text-xs text-blue-800">
                                                    3. Copy your Merchant ID, Client ID, and Client Secret
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="text-xs text-blue-800 mb-2">
                                                    1. Log in to your Razorpay Dashboard
                                                </p>
                                                <p className="text-xs text-blue-800 mb-2">
                                                    2. Go to Settings → API Keys
                                                </p>
                                                <p className="text-xs text-blue-800">
                                                    3. Copy your Key ID and Key Secret
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <Link
                                    href="/admin/settings/payments"
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Saving...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Save Changes</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
