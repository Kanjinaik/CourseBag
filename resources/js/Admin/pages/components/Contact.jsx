import { Head, useForm, usePage, router, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';

export default function Contact({ page = null }) {
    const { flash } = usePage().props;

    // Parse contact info from page content
    const getContactInfo = (pageData) => {
        if (!pageData || !pageData.content || pageData.content.trim() === '') {
            return {
                address: '',
                phone1: '',
                phone2: '',
                email1: '',
                email2: '',
                hours1: '',
                hours2: '',
                hours3: '',
            };
        }

        try {
            const parsed = JSON.parse(pageData.content);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                return {
                    address: parsed.address || '',
                    phone1: parsed.phone1 || '',
                    phone2: parsed.phone2 || '',
                    email1: parsed.email1 || '',
                    email2: parsed.email2 || '',
                    hours1: parsed.hours1 || '',
                    hours2: parsed.hours2 || '',
                    hours3: parsed.hours3 || '',
                };
            }
        } catch (e) {
            console.warn('Failed to parse contact info JSON:', e);
        }

        return {
            address: '',
            phone1: '',
            phone2: '',
            email1: '',
            email2: '',
            hours1: '',
            hours2: '',
            hours3: '',
        };
    };

    // Initialize with default values
    const defaultPageData = {
        title: 'Contact Information',
        content: '',
        is_active: true,
    };

    const initialPageData = page || defaultPageData;
    const initialContactInfo = getContactInfo(initialPageData);

    const { data, setData, put, processing, errors } = useForm({
        title: initialPageData.title || 'Contact Information',
        content: initialPageData.content || '',
        is_active: initialPageData.is_active !== undefined ? Boolean(initialPageData.is_active) : true,
        contactInfo: initialContactInfo,
    });

    // Update form when page data changes
    useEffect(() => {
        if (page) {
            const updatedContactInfo = getContactInfo(page);
            setData({
                title: page.title || 'Contact Information',
                content: page.content || '',
                is_active: page.is_active !== undefined ? Boolean(page.is_active) : true,
                contactInfo: updatedContactInfo,
            }, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    // Helper function to update contactInfo field
    const updateContactInfo = (field, value) => {
        const currentContactInfo = data.contactInfo || {
            address: '',
            phone1: '',
            phone2: '',
            email1: '',
            email2: '',
            hours1: '',
            hours2: '',
            hours3: '',
        };
        setData('contactInfo', {
            ...currentContactInfo,
            [field]: value,
        });
    };

    const submit = (e) => {
        e.preventDefault();
        
        // Ensure contactInfo exists and is an object
        let contactInfo = data.contactInfo;
        
        if (!contactInfo || typeof contactInfo !== 'object' || Array.isArray(contactInfo)) {
            contactInfo = {
                address: '',
                phone1: '',
                phone2: '',
                email1: '',
                email2: '',
                hours1: '',
                hours2: '',
                hours3: '',
            };
        }
        
        // Clean up null/undefined values
        const cleanedContactInfo = {
            address: contactInfo.address || '',
            phone1: contactInfo.phone1 || '',
            phone2: contactInfo.phone2 || '',
            email1: contactInfo.email1 || '',
            email2: contactInfo.email2 || '',
            hours1: contactInfo.hours1 || '',
            hours2: contactInfo.hours2 || '',
            hours3: contactInfo.hours3 || '',
        };
        
        // Convert contactInfo to JSON string
        const contentJson = JSON.stringify(cleanedContactInfo);
        
        // Prepare the data to submit
        const submitData = {
            title: data.title || '',
            content: contentJson,
            is_active: data.is_active !== undefined ? Boolean(data.is_active) : true,
        };
        
        // Update form data first
        setData({
            ...data,
            content: contentJson,
        });
        
        // Submit using router.put with explicit data to ensure it's sent
        router.put(`/admin/pages/contact`, submitData, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ 
                    only: ['page'],
                });
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
                console.error('Submitted data:', submitData);
            },
        });
    };

    return (
        <AdminLayout title="Contact Information">
            <Head title="Contact Information" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
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

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Contact Information</h1>
                        <p className="text-sm text-gray-600 mt-1">Manage your Contact Information page content</p>
                    </div>
                    <Link
                        href="/admin/pages"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Back to Pages</span>
                    </Link>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Page Content</h2>
                            <p className="text-sm text-gray-500 mt-1">Edit content for Contact Information page</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Page Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    Page Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                        errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter page title"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* Contact Page Special Form */}
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="address"
                                        rows={3}
                                        value={data.contactInfo?.address || ''}
                                        onChange={(e) => updateContactInfo('address', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter address (use line breaks for multiple lines)"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone1" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone 1 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="phone1"
                                            value={data.contactInfo?.phone1 || ''}
                                            onChange={(e) => updateContactInfo('phone1', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.phone1 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="+91 12345 67890"
                                        />
                                        {errors.phone1 && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone1}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="phone2" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone 2
                                        </label>
                                        <input
                                            type="text"
                                            id="phone2"
                                            value={data.contactInfo?.phone2 || ''}
                                            onChange={(e) => updateContactInfo('phone2', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.phone2 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="+91 98765 43210"
                                        />
                                        {errors.phone2 && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone2}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="email1" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email 1 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email1"
                                            value={data.contactInfo?.email1 || ''}
                                            onChange={(e) => updateContactInfo('email1', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.email1 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="support@coursebag.com"
                                        />
                                        {errors.email1 && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email1}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="email2" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email 2
                                        </label>
                                        <input
                                            type="email"
                                            id="email2"
                                            value={data.contactInfo?.email2 || ''}
                                            onChange={(e) => updateContactInfo('email2', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.email2 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="info@coursebag.com"
                                        />
                                        {errors.email2 && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email2}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Business Hours <span className="text-red-500">*</span>
                                    </label>
                                    <div>
                                        <input
                                            type="text"
                                            value={data.contactInfo?.hours1 || ''}
                                            onChange={(e) => updateContactInfo('hours1', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-2 ${
                                                errors.hours1 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={data.contactInfo?.hours2 || ''}
                                            onChange={(e) => updateContactInfo('hours2', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 mb-2 ${
                                                errors.hours2 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Saturday: 10:00 AM - 4:00 PM"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            value={data.contactInfo?.hours3 || ''}
                                            onChange={(e) => updateContactInfo('hours3', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                                errors.hours3 ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="Sunday: Closed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Active Status */}
                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                                        Active Status
                                    </label>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 ml-6">
                                    Page will be visible to users when active
                                </p>
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

