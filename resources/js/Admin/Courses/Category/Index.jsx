import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import Toast from '@/Admin/components/Toast';
import DataTable from '@/Admin/components/DataTable';

export default function Index({ categories, totalCategories }) {
    const { flash } = usePage().props;
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = (categoryId, categoryName) => {
        setDeleteCategoryId({ id: categoryId, name: categoryName });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteCategoryId) {
            router.delete(`/admin/categories/${deleteCategoryId.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeleteCategoryId(null);
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setDeleteCategoryId(null);
    };

    return (
        <AdminLayout title="Categories Management">
            <Head title="Categories Management" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Total Categories: <span className="font-semibold text-emerald-600">{totalCategories}</span>
                        </p>
                    </div>
                    <Link
                        href="/admin/categories/create"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Category</span>
                    </Link>
                </div>

                {/* Categories Table */}
                <DataTable
                    columns={[
                        {
                            key: 'id',
                            label: 'ID',
                            render: (row) => `#${row.id}`,
                        },
                        {
                            key: 'name',
                            label: 'Name',
                        },
                        {
                            key: 'slug',
                            label: 'Slug',
                        },
                        {
                            key: 'description',
                            label: 'Description',
                            render: (row) =>
                                row.description ? (
                                    <span className="truncate block max-w-xs">{row.description}</span>
                                ) : (
                                    <span className="text-gray-400">—</span>
                                ),
                        },
                        {
                            key: 'courses_count',
                            label: 'Courses',
                            render: (row) => (
                                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                    {row.courses_count}
                                </span>
                            ),
                        },
                        {
                            key: 'actions',
                            label: 'Actions',
                            sortable: false,
                            render: (row) => (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={`/admin/categories/${row.id}/edit`}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(row.id, row.name);
                                        }}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={categories || []}
                    emptyMessage="No categories found"
                    emptyDescription="Create your first category to get started"
                    searchPlaceholder="Search categories..."
                />
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteCategoryId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Category</h3>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteCategoryId.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleDeleteCancel}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

