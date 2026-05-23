import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';
import DataTable from '@/Admin/components/DataTable';

export default function Index({ transactions, stats }) {
    const { flash } = usePage().props;

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AdminLayout title="Transactions Management">
            <Head title="Transactions Management" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions Management</h1>
                    <p className="text-sm text-gray-600 mt-1">View and manage all payment transactions</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Total Transactions</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Completed</div>
                        <div className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Pending</div>
                        <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Failed</div>
                        <div className="text-2xl font-bold text-red-600 mt-1">{stats.failed}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="text-sm text-gray-600">Total Revenue</div>
                        <div className="text-2xl font-bold text-emerald-600 mt-1">₹{(stats.totalRevenue || 0).toFixed(2)}</div>
                    </div>
                </div>

                {/* Transactions Table */}
                <DataTable
                    columns={[
                        {
                            key: 'id',
                            label: 'Transaction ID',
                            render: (row) => `#${row.id}`,
                        },
                        {
                            key: 'user',
                            label: 'Customer',
                            accessor: 'user.name',
                            render: (row) => (
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{row.user.name}</p>
                                    <p className="text-xs text-gray-500">{row.user.email}</p>
                                </div>
                            ),
                        },
                        {
                            key: 'razorpay_order_id',
                            label: 'Order ID',
                            render: (row) => (
                                <div className="text-xs text-gray-600 font-mono">
                                    {row.razorpay_order_id}
                                </div>
                            ),
                        },
                        {
                            key: 'courses',
                            label: 'Courses',
                            render: (row) => (
                                <div className="text-sm text-gray-800">
                                    <span className="font-medium">{row.courses_count} course(s)</span>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {row.courses.slice(0, 2).map(c => c.title).join(', ')}
                                        {row.courses_count > 2 && '...'}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: 'amount',
                            label: 'Amount',
                            render: (row) => (
                                <span className="text-sm font-semibold text-gray-900">
                                    ₹{row.amount.toFixed(2)} {row.currency}
                                </span>
                            ),
                        },
                        {
                            key: 'razorpay_payment_id',
                            label: 'Payment ID',
                            render: (row) => (
                                <div className="text-xs text-gray-500 font-mono">
                                    {row.razorpay_payment_id ? (
                                        row.razorpay_payment_id.substring(0, 20) + '...'
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
                                </div>
                            ),
                        },
                        {
                            key: 'created_at',
                            label: 'Date',
                            accessor: 'created_at_formatted',
                        },
                        {
                            key: 'status',
                            label: 'Status',
                            render: (row) => (
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(row.status)}`}>
                                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                                </span>
                            ),
                        },
                    ]}
                    data={transactions || []}
                    emptyMessage="No transactions found"
                    emptyDescription="Transactions will appear here once customers make payments"
                    searchPlaceholder="Search transactions..."
                />
            </div>
        </AdminLayout>
    );
}

