import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import ReactQuill from 'react-quill';
import Toast from '@/Admin/components/Toast';

export default function RefundPolicy({ page = null }) {
    const { flash } = usePage().props;

    const pageData = page || {
        title: 'Refund Policy',
        content: '',
        is_active: true,
    };

    const { data, setData, put, processing, errors } = useForm({
        title: pageData.title || 'Refund Policy',
        content: pageData.content || '',
        is_active: pageData.is_active !== undefined ? Boolean(pageData.is_active) : true,
    });

    useEffect(() => {
        setData({
            title: pageData.title || 'Refund Policy',
            content: pageData.content || '',
            is_active: pageData.is_active !== undefined ? Boolean(pageData.is_active) : true,
        }, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const submit = (e) => {
        e.preventDefault();
        
        const submitData = { 
            title: data.title || '',
            content: data.content || '',
            is_active: data.is_active,
        };
        
        put(`/admin/pages/refund-policy`, submitData, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ 
                    only: ['page'],
                });
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
            },
        });
    };

    return (
        <AdminLayout title="Refund Policy">
            <Head title="Refund Policy" />
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
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Refund Policy</h1>
                    <p className="text-sm text-gray-600 mt-1">Manage your Refund Policy page content</p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                        <div className="mb-6 pb-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">Page Content</h2>
                            <p className="text-sm text-gray-500 mt-1">Edit content for Refund Policy page</p>
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

                            {/* Page Content - Rich Text Editor */}
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                    Page Content <span className="text-red-500">*</span>
                                </label>
                                <div className={errors.content ? 'border-2 border-red-500 rounded-lg' : ''}>
                                    <ReactQuill
                                        theme="snow"
                                        value={data.content}
                                        onChange={(value) => setData('content', value)}
                                        modules={{
                                            toolbar: [
                                                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                                [{ 'font': [] }],
                                                [{ 'size': [] }],
                                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
                                                ['link', 'image', 'video'],
                                                [{ 'color': [] }, { 'background': [] }],
                                                [{ 'align': [] }],
                                                ['clean']
                                            ],
                                        }}
                                        formats={[
                                            'header', 'font', 'size',
                                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                                            'list', 'bullet', 'indent',
                                            'link', 'image', 'video',
                                            'color', 'background',
                                            'align'
                                        ]}
                                        style={{ minHeight: '300px' }}
                                        placeholder="Enter page content..."
                                    />
                                </div>
                                {errors.content && (
                                    <p className="mt-1 text-sm text-red-600">{errors.content}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Use the toolbar to format your content with rich text editing
                                </p>
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

