import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PaymentsIndex({ gateways = [] }) {
    const [togglingStates, setTogglingStates] = useState({});

    const handleToggleStatus = async (gatewayId, currentStatus) => {
        const newStatus = !currentStatus;
        setTogglingStates(prev => ({ ...prev, [gatewayId]: true }));

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch(`/admin/settings/payments/${gatewayId}/toggle-status`, {
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
                router.reload({ only: ['gateways'], preserveScroll: true });
            } else {
                alert(result.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Failed to update status. Please try again.');
        } finally {
            setTogglingStates(prev => ({ ...prev, [gatewayId]: false }));
        }
    };
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'credit-card':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
        }
    };

    return (
        <AdminLayout title="Payment Gateways">
            <Head title="Payment Gateways" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Payment Gateways</h1>
                        <p className="text-sm text-gray-600 mt-1">Manage payment gateway integrations and API keys</p>
                    </div>
                    <Link
                        href="/admin/settings/website"
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← Back to Settings
                    </Link>
                </div>

                {/* Gateways Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {gateways.map((gateway) => {
                        const isToggling = togglingStates[gateway.id] || false;
                        return (
                            <div
                                key={gateway.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                                {getIcon(gateway.icon)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {gateway.name}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">
                                                {gateway.description}
                                            </p>
                                            
                                            {/* Status Switch */}
                                            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-gray-700">Status:</span>
                                                    {isToggling ? (
                                                        <span className="text-sm text-gray-500 flex items-center">
                                                            <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                            Updating...
                                                        </span>
                                                    ) : (
                                                        <span className={`text-sm font-medium ${
                                                            gateway.enabled ? 'text-green-600' : 'text-gray-500'
                                                        }`}>
                                                            {gateway.enabled ? '✓ Enabled' : '✗ Disabled'}
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleToggleStatus(gateway.id, gateway.enabled);
                                                    }}
                                                    disabled={isToggling}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                        gateway.enabled ? 'bg-emerald-600' : 'bg-gray-200'
                                                    }`}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                            gateway.enabled ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Configure Button */}
                                            <Link
                                                href={`/admin/settings/payments/${gateway.id}`}
                                                className="inline-flex items-center justify-center w-full px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                Configure Settings
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AdminLayout>
    );
}

