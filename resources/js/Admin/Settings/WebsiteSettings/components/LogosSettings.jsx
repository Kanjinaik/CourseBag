import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';

export default function LogosSettings({ mainLogo = null, favicon = null }) {
    const { flash } = usePage().props;
    const mainLogoInputRef = useRef(null);
    const faviconInputRef = useRef(null);
    const [mainLogoPreview, setMainLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        main_logo: null,
        favicon: null,
    });

    const handleMainLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('main_logo', file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFaviconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('favicon', file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setFaviconPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();

        // Check if at least one file is selected
        if (!data.main_logo && !data.favicon) {
            alert('Please select at least one file to upload.');
            return;
        }

        post(`/admin/settings/website/logos`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setMainLogoPreview(null);
                setFaviconPreview(null);
                // Clear file inputs
                if (mainLogoInputRef.current) {
                    mainLogoInputRef.current.value = '';
                }
                if (faviconInputRef.current) {
                    faviconInputRef.current.value = '';
                }
                // Clear form data
                setData({
                    main_logo: null,
                    favicon: null,
                });
            },
        });
    };

    return (
        <AdminLayout title="Logos Settings">
            <Head title="Logos Settings" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Back Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Logos Settings</h1>
                        <p className="text-sm text-gray-600 mt-1">Manage your website logo and favicon</p>
                    </div>
                    <Link
                        href="/admin/settings/website"
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← Back to Settings
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
                            <h2 className="text-lg font-semibold text-gray-900">Logo & Favicon</h2>
                            <p className="text-sm text-gray-500 mt-1">Upload your website logo and favicon</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Main Logo */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Main Logo
                                </label>
                                <div className="space-y-4">
                                    {/* Current Logo or Preview */}
                                    {(mainLogoPreview || mainLogo) && (
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={mainLogoPreview || mainLogo}
                                                alt={mainLogoPreview ? "New Logo Preview" : "Current Logo"}
                                                className="h-20 object-contain border border-gray-200 rounded-lg p-2 bg-gray-50"
                                            />
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {mainLogoPreview ? "New Logo Preview" : "Current Logo"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {mainLogoPreview ? "This will replace the current logo after saving" : "Upload a new logo to replace this one"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <input
                                            ref={mainLogoInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleMainLogoChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => mainLogoInputRef.current?.click()}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            {data.main_logo ? data.main_logo.name : 'Choose Logo File'}
                                        </button>
                                        {data.main_logo && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                Selected: {data.main_logo.name} ({(data.main_logo.size / 1024).toFixed(2)} KB)
                                            </p>
                                        )}
                                    </div>
                                    {errors.main_logo && (
                                        <p className="mt-1 text-sm text-red-600">{errors.main_logo}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Recommended size: 200x50px. Supported formats: JPEG, PNG, JPG, GIF, SVG. Max size: 2MB
                                    </p>
                                </div>
                            </div>

                            {/* Favicon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Favicon (Icon)
                                </label>
                                <div className="space-y-4">
                                    {/* Current Favicon or Preview */}
                                    {(faviconPreview || favicon) && (
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={faviconPreview || favicon}
                                                alt={faviconPreview ? "New Favicon Preview" : "Current Favicon"}
                                                className="h-16 w-16 object-contain border border-gray-200 rounded-lg p-2 bg-gray-50"
                                            />
                                            <div>
                                                <p className="text-sm text-gray-600 font-medium">
                                                    {faviconPreview ? "New Favicon Preview" : "Current Favicon"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {faviconPreview ? "This will replace the current favicon after saving" : "Upload a new favicon to replace this one"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <input
                                            ref={faviconInputRef}
                                            type="file"
                                            accept="image/*,.ico"
                                            onChange={handleFaviconChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => faviconInputRef.current?.click()}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            {data.favicon ? data.favicon.name : 'Choose Favicon File'}
                                        </button>
                                        {data.favicon && (
                                            <p className="mt-2 text-sm text-gray-600">
                                                Selected: {data.favicon.name} ({(data.favicon.size / 1024).toFixed(2)} KB)
                                            </p>
                                        )}
                                    </div>
                                    {errors.favicon && (
                                        <p className="mt-1 text-sm text-red-600">{errors.favicon}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Recommended size: 32x32px or 16x16px. Supported formats: JPEG, PNG, JPG, GIF, ICO. Max size: 512KB
                                    </p>
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

