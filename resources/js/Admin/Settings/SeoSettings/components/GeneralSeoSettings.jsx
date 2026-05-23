import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';

export default function GeneralSeoSettings({ settings = {} }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        site_title: settings.site_title || '',
        meta_title: settings.meta_title || '',
        meta_description: settings.meta_description || '',
        meta_keywords: settings.meta_keywords || '',
        meta_author: settings.meta_author || '',
        robots: settings.robots || 'index, follow',
        canonical_url: settings.canonical_url || '',
        schema_markup: settings.schema_markup || '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/settings/seo/general`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({
                    only: ['settings'],
                });
            },
        });
    };

    return (
        <AdminLayout title="General SEO Settings">
            <Head title="General SEO Settings" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Back Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">General SEO Settings</h1>
                        <p className="text-sm text-gray-600 mt-1">Manage meta tags, titles, and descriptions</p>
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
                            <h2 className="text-lg font-semibold text-gray-900">Meta Tags & Basic SEO</h2>
                            <p className="text-sm text-gray-500 mt-1">Configure your website's meta tags and basic SEO settings</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Meta Title */}
                            <div>
                                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Title
                                </label>
                                <input
                                    type="text"
                                    id="meta_title"
                                    value={data.meta_title}
                                    onChange={(e) => setData('meta_title', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.meta_title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter meta title for SEO (recommended: 50-60 characters)"
                                    maxLength={255}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Used for search engines. {data.meta_title.length}/255 characters
                                </p>
                                {errors.meta_title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.meta_title}</p>
                                )}
                            </div>

                            {/* Site Title */}
                            <div>
                                <label htmlFor="site_title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Site Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="site_title"
                                    value={data.site_title}
                                    onChange={(e) => setData('site_title', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.site_title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter your site title (e.g., CourseBag)"
                                    maxLength={255}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    This will be used as the main title for your website. {data.site_title.length}/255 characters
                                </p>
                                {errors.site_title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.site_title}</p>
                                )}
                            </div>

                            {/* Meta Description */}
                            <div>
                                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="meta_description"
                                    rows={3}
                                    value={data.meta_description}
                                    onChange={(e) => setData('meta_description', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.meta_description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter meta description (recommended: 150-160 characters)"
                                    maxLength={500}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    {data.meta_description.length}/500 characters
                                </p>
                                {errors.meta_description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.meta_description}</p>
                                )}
                            </div>

                            {/* Meta Keywords */}
                            <div>
                                <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Keywords
                                </label>
                                <input
                                    type="text"
                                    id="meta_keywords"
                                    value={data.meta_keywords}
                                    onChange={(e) => setData('meta_keywords', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.meta_keywords ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="keyword1, keyword2, keyword3"
                                    maxLength={500}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Separate keywords with commas
                                </p>
                                {errors.meta_keywords && (
                                    <p className="mt-1 text-sm text-red-600">{errors.meta_keywords}</p>
                                )}
                            </div>

                            {/* Meta Author */}
                            <div>
                                <label htmlFor="meta_author" className="block text-sm font-medium text-gray-700 mb-2">
                                    Meta Author
                                </label>
                                <input
                                    type="text"
                                    id="meta_author"
                                    value={data.meta_author}
                                    onChange={(e) => setData('meta_author', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.meta_author ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Author name"
                                    maxLength={255}
                                />
                                {errors.meta_author && (
                                    <p className="mt-1 text-sm text-red-600">{errors.meta_author}</p>
                                )}
                            </div>

                            {/* Robots Meta */}
                            <div>
                                <label htmlFor="robots" className="block text-sm font-medium text-gray-700 mb-2">
                                    Robots Meta Tag
                                </label>
                                <select
                                    id="robots"
                                    value={data.robots}
                                    onChange={(e) => setData('robots', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.robots ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="index, follow">Index, Follow</option>
                                    <option value="index, nofollow">Index, No Follow</option>
                                    <option value="noindex, follow">No Index, Follow</option>
                                    <option value="noindex, nofollow">No Index, No Follow</option>
                                </select>
                                {errors.robots && (
                                    <p className="mt-1 text-sm text-red-600">{errors.robots}</p>
                                )}
                            </div>

                            {/* Canonical URL */}
                            <div>
                                <label htmlFor="canonical_url" className="block text-sm font-medium text-gray-700 mb-2">
                                    Canonical URL
                                </label>
                                <input
                                    type="url"
                                    id="canonical_url"
                                    value={data.canonical_url}
                                    onChange={(e) => setData('canonical_url', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.canonical_url ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="https://example.com"
                                    maxLength={500}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    The canonical URL for your homepage
                                </p>
                                {errors.canonical_url && (
                                    <p className="mt-1 text-sm text-red-600">{errors.canonical_url}</p>
                                )}
                            </div>

                            {/* Schema Markup */}
                            <div>
                                <label htmlFor="schema_markup" className="block text-sm font-medium text-gray-700 mb-2">
                                    Schema Markup (JSON-LD)
                                </label>
                                <textarea
                                    id="schema_markup"
                                    rows={8}
                                    value={data.schema_markup}
                                    onChange={(e) => setData('schema_markup', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.schema_markup ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder='{"@context": "https://schema.org", "@type": "Organization", ...}'
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Enter valid JSON-LD schema markup for structured data
                                </p>
                                {errors.schema_markup && (
                                    <p className="mt-1 text-sm text-red-600">{errors.schema_markup}</p>
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

