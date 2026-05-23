import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';
import DataTable from '@/Admin/components/DataTable';

export default function Index({ orders, totalOrders, totalRevenue }) {
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
        <AdminLayout title="Orders Management">
            <Head title="Orders Management" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <p>
                                Total Orders: <span className="font-semibold text-emerald-600">{totalOrders}</span>
                            </p>
                            <p>
                                Total Revenue: <span className="font-semibold text-emerald-600">₹{(totalRevenue || 0).toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <DataTable
                    columns={[
                        {
                            key: 'id',
                            label: 'Order ID',
                            render: (row) => (
                                <div>
                                    <span className="font-medium">#{row.id}</span>
                                    <div className="text-xs text-gray-500 mt-1">{row.razorpay_order_id}</div>
                                </div>
                            ),
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
                    data={orders || []}
                    emptyMessage="No orders found"
                    emptyDescription="Orders will appear here once customers make purchases"
                    searchPlaceholder="Search orders..."
                />
            </div>
        </AdminLayout>
    );
}

