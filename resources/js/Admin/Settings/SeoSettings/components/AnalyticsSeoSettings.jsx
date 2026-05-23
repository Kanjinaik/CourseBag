import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';

export default function AnalyticsSeoSettings({ settings = {} }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        google_analytics_id: settings.google_analytics_id || '',
        google_tag_manager_id: settings.google_tag_manager_id || '',
        facebook_pixel_id: settings.facebook_pixel_id || '',
        custom_head_code: settings.custom_head_code || '',
        custom_body_code: settings.custom_body_code || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/settings/seo/analytics`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({
                    only: ['settings'],
                });
            },
        });
    };

    return (
        <AdminLayout title="Analytics & Tracking Settings">
            <Head title="Analytics & Tracking Settings" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Back Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Analytics & Tracking Settings</h1>
                        <p className="text-sm text-gray-600 mt-1">Manage Google Analytics and other tracking codes</p>
                    </div>
                    <Link
                        href="/admin/settings/seo"
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← Back to SEO Settings
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

            <Toast />

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Tracking Codes</h2>
                            <p className="text-sm text-gray-500 mt-1">Add tracking codes and scripts to your website</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Google Analytics */}
                            <div>
                                <label htmlFor="google_analytics_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Google Analytics ID (G-XXXXXXXXXX)
                                </label>
                                <input
                                    type="text"
                                    id="google_analytics_id"
                                    value={data.google_analytics_id}
                                    onChange={(e) => setData('google_analytics_id', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.google_analytics_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="G-XXXXXXXXXX"
                                    maxLength={255}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Enter your Google Analytics 4 measurement ID (e.g., G-XXXXXXXXXX)
                                </p>
                                {errors.google_analytics_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.google_analytics_id}</p>
                                )}
                            </div>

                            {/* Google Tag Manager */}
                            <div>
                                <label htmlFor="google_tag_manager_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Google Tag Manager ID (GTM-XXXXXXX)
                                </label>
                                <input
                                    type="text"
                                    id="google_tag_manager_id"
                                    value={data.google_tag_manager_id}
                                    onChange={(e) => setData('google_tag_manager_id', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.google_tag_manager_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="GTM-XXXXXXX"
                                    maxLength={255}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Enter your Google Tag Manager container ID (e.g., GTM-XXXXXXX)
                                </p>
                                {errors.google_tag_manager_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.google_tag_manager_id}</p>
                                )}
                            </div>

                            {/* Facebook Pixel */}
                            <div>
                                <label htmlFor="facebook_pixel_id" className="block text-sm font-medium text-gray-700 mb-2">
                                    Facebook Pixel ID
                                </label>
                                <input
                                    type="text"
                                    id="facebook_pixel_id"
                                    value={data.facebook_pixel_id}
                                    onChange={(e) => setData('facebook_pixel_id', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.facebook_pixel_id ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter Facebook Pixel ID"
                                    maxLength={255}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Enter your Facebook Pixel ID for tracking conversions
                                </p>
                                {errors.facebook_pixel_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.facebook_pixel_id}</p>
                                )}
                            </div>

                            {/* Custom Head Code */}
                            <div>
                                <label htmlFor="custom_head_code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Head Code
                                </label>
                                <textarea
                                    id="custom_head_code"
                                    rows={6}
                                    value={data.custom_head_code}
                                    onChange={(e) => setData('custom_head_code', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.custom_head_code ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="<!-- Custom code to add in &lt;head&gt; section -->"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Custom HTML/JavaScript code to add in the &lt;head&gt; section
                                </p>
                                {errors.custom_head_code && (
                                    <p className="mt-1 text-sm text-red-600">{errors.custom_head_code}</p>
                                )}
                            </div>

                            {/* Custom Body Code */}
                            <div>
                                <label htmlFor="custom_body_code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Custom Body Code
                                </label>
                                <textarea
                                    id="custom_body_code"
                                    rows={6}
                                    value={data.custom_body_code}
                                    onChange={(e) => setData('custom_body_code', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.custom_body_code ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="<!-- Custom code to add before &lt;/body&gt; tag -->"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Custom HTML/JavaScript code to add before the closing &lt;/body&gt; tag
                                </p>
                                {errors.custom_body_code && (
                                    <p className="mt-1 text-sm text-red-600">{errors.custom_body_code}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
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

