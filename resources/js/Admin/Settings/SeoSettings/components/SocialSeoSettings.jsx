import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';

export default function SocialSeoSettings({ settings = {} }) {
    const { flash } = usePage().props;
    const ogImageInputRef = useRef(null);
    const twitterImageInputRef = useRef(null);
    const [ogImagePreview, setOgImagePreview] = useState(null);
    const [twitterImagePreview, setTwitterImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        og_title: settings.og_title || '',
        og_description: settings.og_description || '',
        og_image: null,
        og_type: settings.og_type || 'website',
        og_site_name: settings.og_site_name || '',
        twitter_card: settings.twitter_card || 'summary_large_image',
        twitter_title: settings.twitter_title || '',
        twitter_description: settings.twitter_description || '',
        twitter_image: null,
        twitter_site: settings.twitter_site || '',
    });

    const handleOgImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('og_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOgImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTwitterImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('twitter_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setTwitterImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/settings/seo/social`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setOgImagePreview(null);
                setTwitterImagePreview(null);
                if (ogImageInputRef.current) {
                    ogImageInputRef.current.value = '';
                }
                if (twitterImageInputRef.current) {
                    twitterImageInputRef.current.value = '';
                }
                router.reload({
                    only: ['settings'],
                });
            },
        });
    };

    const ogImageUrl = settings.og_image ? `/uploads/seosettings/${settings.og_image}` : null;
    const twitterImageUrl = settings.twitter_image ? `/uploads/seosettings/${settings.twitter_image}` : null;

    return (
        <AdminLayout title="Social Media SEO Settings">
            <Head title="Social Media SEO Settings" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Back Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Social Media SEO Settings</h1>
                        <p className="text-sm text-gray-600 mt-1">Configure Open Graph and Twitter Card settings</p>
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
                        <form onSubmit={submit} className="space-y-8">
                            {/* Open Graph Section */}
                            <div>
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Open Graph Settings</h2>
                                    <p className="text-sm text-gray-500 mt-1">Configure how your content appears when shared on Facebook and other social platforms</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="og_title" className="block text-sm font-medium text-gray-700 mb-2">
                                            OG Title
                                        </label>
                                        <input
                                            type="text"
                                            id="og_title"
                                            value={data.og_title}
                                            onChange={(e) => setData('og_title', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.og_title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter Open Graph title"
                                            maxLength={255}
                                        />
                                        {errors.og_title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.og_title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="og_description" className="block text-sm font-medium text-gray-700 mb-2">
                                            OG Description
                                        </label>
                                        <textarea
                                            id="og_description"
                                            rows={3}
                                            value={data.og_description}
                                            onChange={(e) => setData('og_description', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.og_description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter Open Graph description"
                                            maxLength={500}
                                        />
                                        {errors.og_description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.og_description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="og_image" className="block text-sm font-medium text-gray-700 mb-2">
                                            OG Image
                                        </label>
                                        <div className="space-y-4">
                                            {(ogImagePreview || ogImageUrl) && (
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={ogImagePreview || ogImageUrl}
                                                        alt={ogImagePreview ? "New OG Image Preview" : "Current OG Image"}
                                                        className="h-32 w-32 object-contain border border-gray-200 rounded-lg p-2 bg-gray-50"
                                                    />
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-medium">
                                                            {ogImagePreview ? "New OG Image Preview" : "Current OG Image"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Recommended size: 1200x630px
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <input
                                                    ref={ogImageInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleOgImageChange}
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => ogImageInputRef.current?.click()}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    {data.og_image ? data.og_image.name : 'Choose OG Image'}
                                                </button>
                                                {data.og_image && (
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        Selected: {data.og_image.name} ({(data.og_image.size / 1024).toFixed(2)} KB)
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {errors.og_image && (
                                            <p className="mt-1 text-sm text-red-600">{errors.og_image}</p>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="og_type" className="block text-sm font-medium text-gray-700 mb-2">
                                                OG Type
                                            </label>
                                            <select
                                                id="og_type"
                                                value={data.og_type}
                                                onChange={(e) => setData('og_type', e.target.value)}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                    errors.og_type ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            >
                                                <option value="website">Website</option>
                                                <option value="article">Article</option>
                                                <option value="product">Product</option>
                                                <option value="business">Business</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="og_site_name" className="block text-sm font-medium text-gray-700 mb-2">
                                                OG Site Name
                                            </label>
                                            <input
                                                type="text"
                                                id="og_site_name"
                                                value={data.og_site_name}
                                                onChange={(e) => setData('og_site_name', e.target.value)}
                                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                    errors.og_site_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="Site Name"
                                                maxLength={255}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Twitter Card Section */}
                            <div>
                                <div className="mb-6 pb-4 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold text-gray-900">Twitter Card Settings</h2>
                                    <p className="text-sm text-gray-500 mt-1">Configure how your content appears when shared on Twitter</p>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="twitter_card" className="block text-sm font-medium text-gray-700 mb-2">
                                            Twitter Card Type
                                        </label>
                                        <select
                                            id="twitter_card"
                                            value={data.twitter_card}
                                            onChange={(e) => setData('twitter_card', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.twitter_card ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="summary">Summary</option>
                                            <option value="summary_large_image">Summary Large Image</option>
                                            <option value="app">App</option>
                                            <option value="player">Player</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="twitter_title" className="block text-sm font-medium text-gray-700 mb-2">
                                            Twitter Title
                                        </label>
                                        <input
                                            type="text"
                                            id="twitter_title"
                                            value={data.twitter_title}
                                            onChange={(e) => setData('twitter_title', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.twitter_title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter Twitter card title"
                                            maxLength={255}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="twitter_description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Twitter Description
                                        </label>
                                        <textarea
                                            id="twitter_description"
                                            rows={3}
                                            value={data.twitter_description}
                                            onChange={(e) => setData('twitter_description', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.twitter_description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Enter Twitter card description"
                                            maxLength={500}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="twitter_image" className="block text-sm font-medium text-gray-700 mb-2">
                                            Twitter Image
                                        </label>
                                        <div className="space-y-4">
                                            {(twitterImagePreview || twitterImageUrl) && (
                                                <div className="flex items-center space-x-4">
                                                    <img
                                                        src={twitterImagePreview || twitterImageUrl}
                                                        alt={twitterImagePreview ? "New Twitter Image Preview" : "Current Twitter Image"}
                                                        className="h-32 w-32 object-contain border border-gray-200 rounded-lg p-2 bg-gray-50"
                                                    />
                                                    <div>
                                                        <p className="text-sm text-gray-600 font-medium">
                                                            {twitterImagePreview ? "New Twitter Image Preview" : "Current Twitter Image"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Recommended size: 1200x675px
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            <div>
                                                <input
                                                    ref={twitterImageInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleTwitterImageChange}
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => twitterImageInputRef.current?.click()}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    {data.twitter_image ? data.twitter_image.name : 'Choose Twitter Image'}
                                                </button>
                                                {data.twitter_image && (
                                                    <p className="mt-2 text-sm text-gray-600">
                                                        Selected: {data.twitter_image.name} ({(data.twitter_image.size / 1024).toFixed(2)} KB)
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {errors.twitter_image && (
                                            <p className="mt-1 text-sm text-red-600">{errors.twitter_image}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="twitter_site" className="block text-sm font-medium text-gray-700 mb-2">
                                            Twitter Site (@username)
                                        </label>
                                        <input
                                            type="text"
                                            id="twitter_site"
                                            value={data.twitter_site}
                                            onChange={(e) => setData('twitter_site', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.twitter_site ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="@yourusername"
                                            maxLength={255}
                                        />
                                        <p className="mt-1 text-xs text-gray-500">
                                            Your Twitter username without @ symbol
                                        </p>
                                    </div>
                                </div>
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

