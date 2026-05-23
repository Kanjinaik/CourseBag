import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Cart({ cartItems = [], total = 0, paymentGateways = { razorpay: true, pinelabs: false } }) {
    const page = usePage();
    const isAuthenticated = !!page.props.auth?.user;
    const [loading, setLoading] = useState(false);
    const [directLoading, setDirectLoading] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState(cartItems.map(item => item.course_id));
    const [directCourseName, setDirectCourseName] = useState('');
    const [directAmount, setDirectAmount] = useState('');

    // Set default gateway to the first enabled one
    const getDefaultGateway = () => {
        if (paymentGateways.razorpay) return 'razorpay';
        if (paymentGateways.pinelabs) return 'pinelabs';
        return 'razorpay';
    };

    const [paymentGateway, setPaymentGateway] = useState(getDefaultGateway());
    const pinelabsFormRef = useRef(null);

    // Use appropriate layout based on authentication
    const Layout = isAuthenticated ? AuthenticatedLayout : FrontendLayout;

    const handleRemoveFromCart = (cartId) => {
        router.delete(route('cart.destroy', cartId), {
            preserveScroll: true,
            onSuccess: () => {
                // Remove from selected courses
                const cartItem = cartItems.find(item => item.id === cartId);
                if (cartItem) {
                    setSelectedCourses(prev => prev.filter(id => id !== cartItem.course_id));
                }
            }
        });
    };

    const handleCheckout = async () => {
        if (selectedCourses.length === 0) {
            alert('Please select at least one course to checkout.');
            return;
        }

        setLoading(true);
        try {
            // Check authentication status before making request
            if (!isAuthenticated) {
                throw new Error('You must be logged in to make a payment. Please log in first.');
            }

            console.log('Making payment request:', {
                url: route('payment.create-order'),
                course_ids: selectedCourses,
                gateway: paymentGateway,
                isAuthenticated,
                csrfExcluded: true
            });

            const response = await fetch(route('payment.create-order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    course_ids: selectedCourses,
                    gateway: paymentGateway
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            // Check if response is HTML (error page) instead of JSON
            const contentType = response.headers.get('content-type');
            console.log('Response content-type:', contentType);

            if (contentType && contentType.includes('text/html')) {
                // Response is HTML, not JSON - likely an error page
                const htmlText = await response.text();
                console.error('Received HTML response instead of JSON:', htmlText.substring(0, 500));

                // Try to extract error information from HTML
                if (htmlText.includes('login')) {
                    throw new Error('Authentication required. Please log in again.');
                } else if (htmlText.includes('419')) {
                    throw new Error('CSRF token expired. Please refresh the page.');
                } else if (htmlText.includes('404')) {
                    throw new Error('API endpoint not found.');
                } else if (htmlText.includes('500')) {
                    throw new Error('Server error occurred.');
                } else {
                    throw new Error('Server returned HTML instead of JSON. Check console for details.');
                }
            }

            const data = await response.json();

            if (data.error) {
                console.error('API Error:', data.error);
                alert('Payment Error: ' + data.error);
                setLoading(false);
                return;
            }

            if (data.gateway === 'razorpay') {
                handleRazorpayPayment(data);
            } else if (data.gateway === 'pinelabs') {
                handlePinelabsPayment(data);
            }

        } catch (error) {
            console.error('Payment error:', error);

            // Try to get more specific error information
            let errorMessage = 'An error occurred. Please try again.';

            if (error.response) {
                // Server responded with error status
                errorMessage = `Server Error (${error.response.status}): ${error.response.statusText}`;
            } else if (error.message) {
                // Network or other error
                errorMessage = `Error: ${error.message}`;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            alert(errorMessage);
            setLoading(false);
        }
    };

    const handleDirectPayment = async () => {
        const courseName = directCourseName.trim();
        const amount = Number(directAmount);

        if (!courseName) {
            alert('Please enter the course name.');
            return;
        }

        if (!amount || amount < 1) {
            alert('Please enter a valid amount.');
            return;
        }

        if (!isAuthenticated) {
            router.visit(route('login'));
            return;
        }

        setDirectLoading(true);
        try {
            const response = await fetch(route('payment.create-order'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    custom_course: true,
                    course_name: courseName,
                    amount,
                    gateway: paymentGateway,
                }),
            });

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
                throw new Error('Please log in again before making payment.');
            }

            const data = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.error || 'Failed to create payment.');
            }

            if (data.gateway === 'razorpay') {
                handleRazorpayPayment(data, setDirectLoading);
            } else if (data.gateway === 'pinelabs') {
                handlePinelabsPayment(data);
            }
        } catch (error) {
            alert(error.message || 'Payment failed. Please try again.');
            setDirectLoading(false);
        }
    };

    const handleRazorpayPayment = (data, resetLoading = setLoading) => {
        // Load Razorpay script dynamically
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            const options = {
                key: data.key_id,
                amount: data.amount,
                currency: data.currency,
                name: 'CourseBag',
                description: 'Course Purchase',
                order_id: data.order_id,
                handler: function (response) {
                    // Handle payment success
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = route('payment.success');

                    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

                    const fields = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        transaction_id: data.transaction_id,
                        _token: csrfToken
                    };

                    for (const key in fields) {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = fields[key];
                        form.appendChild(input);
                    }

                    document.body.appendChild(form);
                    form.submit();
                },
                prefill: {
                    name: document.querySelector('meta[name="user-name"]')?.getAttribute('content') || '',
                    email: document.querySelector('meta[name="user-email"]')?.getAttribute('content') || '',
                },
                theme: {
                    color: '#10b981',
                },
                modal: {
                    ondismiss: function () {
                        resetLoading(false);
                        router.visit(route('payment.failure'), {
                            method: 'get',
                            data: { transaction_id: data.transaction_id }
                        });
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
            resetLoading(false);
        };
        script.onerror = () => {
            alert('Failed to load payment gateway. Please try again.');
            resetLoading(false);
        };
        document.body.appendChild(script);
    };

    const handlePinelabsPayment = (data) => {
        const { gateway_data } = data;

        if (gateway_data.is_redirect && gateway_data.action_url) {
            // For Pine Labs, redirect directly to the checkout URL
            // The URL already contains the token as a query parameter
            console.log('Redirecting to Pine Labs:', gateway_data.action_url);
            window.location.href = gateway_data.action_url;
            return;
        }

        // Fallback - this shouldn't happen for Pine Labs
        window.location.href = gateway_data.action_url;
    };


    const toggleCourseSelection = (courseId) => {
        setSelectedCourses(prev => {
            if (prev.includes(courseId)) {
                return prev.filter(id => id !== courseId);
            } else {
                return [...prev, courseId];
            }
        });
    };

    const selectedTotal = cartItems
        .filter(item => selectedCourses.includes(item.course_id))
        .reduce((sum, item) => {
            const price = item.course?.discount_price || item.course?.price || 0;
            return sum + parseFloat(price);
        }, 0);

    return (
        <Layout
            header={isAuthenticated ? (
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Shopping Cart
                </h2>
            ) : undefined}
        >
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Direct Course Payment</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter Course name
                                    </label>
                                    <input
                                        type="text"
                                        value={directCourseName}
                                        onChange={(event) => setDirectCourseName(event.target.value)}
                                        placeholder="Enter Course name"
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Enter amount
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        value={directAmount}
                                        onChange={(event) => setDirectAmount(event.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        value={paymentGateway}
                                        onChange={(event) => setPaymentGateway(event.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    >
                                        {paymentGateways.razorpay && <option value="razorpay">Razorpay</option>}
                                        {paymentGateways.pinelabs && <option value="pinelabs">PineLabs</option>}
                                        {!paymentGateways.razorpay && !paymentGateways.pinelabs && (
                                            <option value="razorpay">Razorpay</option>
                                        )}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-5">
                                {isAuthenticated ? (
                                    <button
                                        type="button"
                                        onClick={handleDirectPayment}
                                        disabled={directLoading}
                                        className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                                    >
                                        {directLoading ? 'Processing...' : 'Pay'}
                                    </button>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                                    >
                                        Login to Pay
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                                <p className="text-gray-600 mb-6">Add some courses to get started!</p>
                                <Link
                                    href={route('courses.index')}
                                    className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                >
                                    Browse Courses
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                        <div className="p-6">
                                            <div className="flex items-start space-x-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCourses.includes(item.course_id)}
                                                    onChange={() => toggleCourseSelection(item.course_id)}
                                                    className="mt-1 h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <Link
                                                                href={route('courses.show', item.course?.slug)}
                                                                className="text-lg font-semibold text-gray-900 hover:text-emerald-600"
                                                            >
                                                                {item.course?.title}
                                                            </Link>
                                                            {item.course?.category && (
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    {item.course.category.name}
                                                                </p>
                                                            )}
                                                            <div className="mt-2 flex items-center space-x-2">
                                                                <span className="text-xl font-bold text-emerald-600">
                                                                    ₹{item.course?.discount_price || item.course?.price}
                                                                </span>
                                                                {item.course?.discount_price && (
                                                                    <span className="text-gray-500 line-through">
                                                                        ₹{item.course?.price}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {isAuthenticated && (
                                                            <button
                                                                onClick={() => handleRemoveFromCart(item.id)}
                                                                className="ml-4 text-red-600 hover:text-red-800"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg sticky top-4">
                                    <div className="p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                                        <div className="space-y-3 mb-4">
                                            <div className="flex justify-between text-gray-600">
                                                <span>Subtotal ({selectedCourses.length} items)</span>
                                                <span>₹{selectedTotal.toFixed(2)}</span>
                                            </div>
                                            <div className="border-t pt-3">
                                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                                    <span>Total</span>
                                                    <span>₹{selectedTotal.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Method Section */}
                                        {isAuthenticated && selectedCourses.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Payment Method</h4>
                                                <div className="space-y-3">
                                                    {/* Razorpay Option */}
                                                    {paymentGateways.razorpay && (
                                                        <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentGateway === 'razorpay' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-200'}`}>
                                                            <div className="flex items-center space-x-3">
                                                                <input
                                                                    type="radio"
                                                                    name="payment_gateway"
                                                                    value="razorpay"
                                                                    checked={paymentGateway === 'razorpay'}
                                                                    onChange={(e) => setPaymentGateway(e.target.value)}
                                                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900">Razorpay</p>
                                                                    <p className="text-xs text-gray-500">Credit Card, UPI, NetBanking</p>
                                                                </div>
                                                            </div>
                                                            <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">
                                                                RZP
                                                            </div>
                                                        </label>
                                                    )}


                                                    {/* PineLabs Option */}
                                                    {paymentGateways.pinelabs && (
                                                        <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${paymentGateway === 'pinelabs' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-emerald-200'}`}>
                                                            <div className="flex items-center space-x-3">
                                                                <input
                                                                    type="radio"
                                                                    name="payment_gateway"
                                                                    value="pinelabs"
                                                                    checked={paymentGateway === 'pinelabs'}
                                                                    onChange={(e) => setPaymentGateway(e.target.value)}
                                                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                                                                />
                                                                <div>
                                                                    <p className="text-sm font-semibold text-gray-900">PineLabs</p>
                                                                    <p className="text-xs text-gray-500">Secure Payment Gateway</p>
                                                                </div>
                                                            </div>
                                                            <div className="h-8 w-8 bg-green-100 rounded flex items-center justify-center text-green-600 text-xs font-bold">
                                                                PL
                                                            </div>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {isAuthenticated ? (
                                            <button
                                                onClick={handleCheckout}
                                                disabled={loading || selectedCourses.length === 0}
                                                className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                            >
                                                {loading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                        </svg>
                                                        <span>Proceed to Checkout</span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <Link
                                                href={route('login')}
                                                className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium text-center block"
                                            >
                                                Login to Checkout
                                            </Link>
                                        )}
                                        <Link
                                            href={route('courses.index')}
                                            className="block mt-3 text-center text-emerald-600 hover:text-emerald-700"
                                        >
                                            Continue Shopping
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

