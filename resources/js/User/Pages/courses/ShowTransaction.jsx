import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import InvoiceDownload from './InvoiceDownload';

export default function ShowTransaction({ transaction }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Transaction Details
                </h2>
            }
        >
            <Head title="Transaction Details" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <Link
                                    href={route('mytransections.index')}
                                    className="text-emerald-600 hover:text-emerald-800 inline-block"
                                >
                                    ← Back to Transactions
                                </Link>
                                {transaction.status === 'completed' && (
                                    <div className="inline-block">
                                        <InvoiceDownload transactionId={transaction.id} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                {/* Transaction Info */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Information</h3>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {transaction.payment_gateway === 'pinelabs' ? transaction.pinelabs_order_id : transaction.razorpay_order_id}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Payment Gateway</dt>
                                            <dd className="mt-1 text-sm text-gray-900 uppercase">
                                                {transaction.payment_gateway || 'Razorpay'}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {transaction.payment_gateway === 'pinelabs' ? transaction.pinelabs_payment_id : transaction.razorpay_payment_id}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Date</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {new Date(transaction.created_at).toLocaleString()}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                                            <dd className="mt-1">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                                </span>
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">Amount</dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                ₹{parseFloat(transaction.amount).toFixed(2)} {transaction.currency}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                {/* Courses Purchased */}
                                {transaction.courses && transaction.courses.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Courses Purchased</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {transaction.courses.map((course) => (
                                                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                                                    <Link
                                                        href={route('mycourses.show', course.slug)}
                                                        className="text-emerald-600 hover:text-emerald-800 font-medium"
                                                    >
                                                        {course.title}
                                                    </Link>
                                                    {course.category && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {course.category.name}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                {transaction.notes && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                                        <p className="text-sm text-gray-700">{transaction.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

