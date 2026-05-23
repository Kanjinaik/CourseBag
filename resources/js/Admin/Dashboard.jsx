import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import DataTable from '@/Admin/components/DataTable';
import Toast from '@/Admin/components/Toast';

export default function Dashboard({ stats, recentUsers = [], recentActivity = [] }) {
    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toFixed(2)}`;
    };

    const formatChange = (change) => {
        const sign = change >= 0 ? '+' : '';
        return `${sign}${change}%`;
    };

    const getChangeColor = (change) => {
        return change >= 0 ? 'text-emerald-600' : 'text-red-600';
    };

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: '👥',
            color: 'bg-blue-500',
            change: formatChange(stats?.usersChange || 0),
            changeColor: getChangeColor(stats?.usersChange || 0),
        },
        {
            title: 'Total Courses',
            value: stats?.totalCourses || 0,
            icon: '📚',
            color: 'bg-emerald-500',
            change: formatChange(stats?.coursesChange || 0),
            changeColor: getChangeColor(stats?.coursesChange || 0),
        },
        {
            title: 'Total Revenue',
            value: formatCurrency(stats?.totalRevenue || 0),
            icon: '💰',
            color: 'bg-yellow-500',
            change: formatChange(stats?.revenueChange || 0),
            changeColor: getChangeColor(stats?.revenueChange || 0),
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: '🛒',
            color: 'bg-purple-500',
            change: formatChange(stats?.ordersChange || 0),
            changeColor: getChangeColor(stats?.ordersChange || 0),
        },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                                <p className={`text-xs mt-2 font-medium ${stat.changeColor}`}>
                                    {stat.change} from last month
                                </p>
                            </div>
                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {recentActivity && recentActivity.length > 0 ? (
                            recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        activity.status === 'completed' 
                                            ? 'bg-emerald-100' 
                                            : activity.status === 'pending'
                                            ? 'bg-yellow-100'
                                            : 'bg-red-100'
                                    }`}>
                                        <span className={`${
                                            activity.status === 'completed' 
                                                ? 'text-emerald-600' 
                                                : activity.status === 'pending'
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                        }`}>
                                            {activity.status === 'completed' ? '✓' : activity.status === 'pending' ? '⏳' : '✗'}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">
                                            {activity.message}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-xs text-gray-500">{activity.created_at_formatted}</p>
                                            {activity.amount && (
                                                <p className="text-xs font-medium text-gray-700">
                                                    ₹{parseFloat(activity.amount || 0).toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/admin/courses/create"
                            className="bg-emerald-50 text-emerald-600 p-4 rounded-lg hover:shadow-md transition-all text-left"
                        >
                            <div className="text-2xl mb-2">📚</div>
                            <div className="text-sm font-medium">Add Course</div>
                        </Link>
                        <Link
                            href="/admin/categories/create"
                            className="bg-blue-50 text-blue-600 p-4 rounded-lg hover:shadow-md transition-all text-left"
                        >
                            <div className="text-2xl mb-2">🏷️</div>
                            <div className="text-sm font-medium">Add Category</div>
                        </Link>
                        <Link
                            href="/admin/transactions"
                            className="bg-yellow-50 text-yellow-600 p-4 rounded-lg hover:shadow-md transition-all text-left"
                        >
                            <div className="text-2xl mb-2">📊</div>
                            <div className="text-sm font-medium">View Reports</div>
                        </Link>
                        <Link
                            href="/admin/settings/website"
                            className="bg-purple-50 text-purple-600 p-4 rounded-lg hover:shadow-md transition-all text-left"
                        >
                            <div className="text-2xl mb-2">⚙️</div>
                            <div className="text-sm font-medium">Settings</div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
                    <Link 
                        href="/admin/users" 
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        View All
                    </Link>
                </div>
                <DataTable
                    columns={[
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
                                <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                                    {row.status || 'Active'}
                                </span>
                            ),
                        },
                        {
                            key: 'created_at',
                            label: 'Registered',
                            accessor: 'created_at_formatted',
                        },
                    ]}
                    data={recentUsers || []}
                    emptyMessage="No recent users"
                    emptyDescription="New users will appear here"
                    searchable={false}
                />
            </div>
        </AdminLayout>
    );
}

