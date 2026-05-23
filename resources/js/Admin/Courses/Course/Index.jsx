import { Head, router, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';
import DataTable from '@/Admin/components/DataTable';

export default function Index({ courses, totalCourses }) {
    const { flash } = usePage().props;
    const [deleteCourseId, setDeleteCourseId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = (courseId, courseTitle) => {
        setDeleteCourseId({ id: courseId, title: courseTitle });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteCourseId) {
            router.delete(`/admin/courses/${deleteCourseId.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeleteCourseId(null);
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setDeleteCourseId(null);
    };

    return (
        <AdminLayout title="Courses Management">
            <Head title="Courses Management" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Courses Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Total Courses: <span className="font-semibold text-emerald-600">{totalCourses}</span>
                        </p>
                    </div>
                    <Link
                        href="/admin/courses/create"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add Course</span>
                    </Link>
                </div>

                {/* Courses Table */}
                <DataTable
                    columns={[
                        {
                            key: 'count',
                            label: '#',
                            sortable: false,
                            render: (row, column, index) => index + 1,
                        },
                        {
                            key: 'title',
                            label: 'Title',
                            render: (row) => (
                                <div className="flex items-center space-x-3">
                                    {row.feature_image && (
                                        <img
                                            src={`/storage/${row.feature_image}`}
                                            alt={row.title}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{row.title}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">
                                            {row.short_description}
                                        </p>
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: 'category',
                            label: 'Category',
                            accessor: 'category.name',
                            render: (row) =>
                                row.category ? (
                                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                        {row.category.name}
                                    </span>
                                ) : (
                                    <span className="text-gray-400">—</span>
                                ),
                        },
                        {
                            key: 'price',
                            label: 'Price',
                            render: (row) => (
                                <div className="flex items-center space-x-2">
                                    {row.discount_price ? (
                                        <>
                                            <span className="text-sm font-medium text-gray-900">
                                                ${row.discount_price}
                                            </span>
                                            <span className="text-xs text-gray-500 line-through">
                                                ${row.price}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-medium text-gray-900">${row.price}</span>
                                    )}
                                </div>
                            ),
                        },
                        {
                            key: 'is_active',
                            label: 'Status',
                            render: (row) => (
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        row.is_active
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    {row.is_active ? 'Active' : 'Inactive'}
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
                                        href={`/admin/courses/${row.id}/edit`}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(row.id, row.title);
                                        }}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={courses || []}
                    emptyMessage="No courses found"
                    emptyDescription="Create your first course to get started"
                    searchPlaceholder="Search courses..."
                />
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteCourseId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Course</h3>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteCourseId.title}</span>? This action cannot be undone.
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

