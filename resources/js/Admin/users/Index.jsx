import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';
import DataTable from '@/Admin/components/DataTable';

export default function Index({ users, totalUsers }) {
    const { flash } = usePage().props;
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteClick = (userId, userName) => {
        setDeleteUserId({ id: userId, name: userName });
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteUserId) {
            router.delete(`/admin/users/${deleteUserId.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setDeleteUserId(null);
                },
            });
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setDeleteUserId(null);
    };
    return (
        <AdminLayout title="Users Management">
            <Head title="Users Management" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Total Users: <span className="font-semibold text-emerald-600">{totalUsers}</span>
                        </p>
                    </div>
                </div>

                {/* Users Table */}
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
                            key: 'email',
                            label: 'Email',
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            render: (row) => (
                                <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                                        row.status === 'Verified'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}
                                >
                                    {row.status}
                                </span>
                            ),
                        },
                        {
                            key: 'created_at',
                            label: 'Registered',
                            type: 'date',
                        },
                        {
                            key: 'actions',
                            label: 'Actions',
                            sortable: false,
                            render: (row) => (
                                <div className="flex items-center space-x-3">
                                    <button
                                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                                        title="View Details"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                                        title="Edit User"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(row.id, row.name);
                                        }}
                                        className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                                        title="Delete User"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ),
                        },
                    ]}
                    data={users || []}
                    emptyMessage="No users found"
                    emptyDescription="Users will appear here once registered"
                    searchPlaceholder="Search users..."
                />
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && deleteUserId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                                Delete User
                            </h3>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteUserId.name}</span>? This action cannot be undone.
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

