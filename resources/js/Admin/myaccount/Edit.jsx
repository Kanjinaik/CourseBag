import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState, useEffect } from 'react';

export default function Edit({ admin, status }) {
    const { props } = usePage();
    // Use admin from shared props (always up-to-date) or fallback to prop
    const currentAdmin = props.admin?.user || admin;
    const [activeTab, setActiveTab] = useState('profile');

    // Profile Update Form - initialize with current admin data
    const profileForm = useForm({
        name: currentAdmin?.name || '',
        email: currentAdmin?.email || '',
    });

    // Update form when admin data changes (after successful update)
    useEffect(() => {
        if (currentAdmin && (
            profileForm.data.name !== currentAdmin.name || 
            profileForm.data.email !== currentAdmin.email
        )) {
            profileForm.setData({
                name: currentAdmin.name || '',
                email: currentAdmin.email || '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAdmin?.name, currentAdmin?.email]);

    // Password Update Form
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submitProfile = (e) => {
        e.preventDefault();
        profileForm.patch('/admin/myaccount', {
            preserveScroll: true,
            onSuccess: (page) => {
                // Update form with latest admin data from the response
                const updatedAdmin = page.props.admin?.user || page.props.admin;
                if (updatedAdmin) {
                    profileForm.setData({
                        name: updatedAdmin.name || '',
                        email: updatedAdmin.email || '',
                    });
                }
            },
        });
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passwordForm.put('/admin/myaccount/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
            },
        });
    };

    return (
        <AdminLayout title="My Account">
            <Head title="My Account" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <div className="max-w-4xl mx-auto">
                {/* Status Message */}
                {status && (
                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm font-medium">
                        {status}
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'profile'
                                        ? 'border-emerald-500 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Profile Information
                            </button>
                            <button
                                onClick={() => setActiveTab('password')}
                                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'password'
                                        ? 'border-emerald-500 text-emerald-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Update Password
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Profile Information Tab */}
                {activeTab === 'profile' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Profile Information</h3>
                        <form onSubmit={submitProfile} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={profileForm.data.name}
                                    onChange={(e) => profileForm.setData('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    required
                                />
                                {profileForm.errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{profileForm.errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={profileForm.data.email}
                                    onChange={(e) => profileForm.setData('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    required
                                />
                                {profileForm.errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{profileForm.errors.email}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {profileForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Password Update Tab */}
                {activeTab === 'password' && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-6">Update Password</h3>
                        <form onSubmit={submitPassword} className="space-y-6">
                            {/* Current Password */}
                            <div>
                                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    id="current_password"
                                    type="password"
                                    value={passwordForm.data.current_password}
                                    onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    required
                                />
                                {passwordForm.errors.current_password && (
                                    <p className="mt-1 text-sm text-red-600">{passwordForm.errors.current_password}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={passwordForm.data.password}
                                    onChange={(e) => passwordForm.setData('password', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    required
                                />
                                {passwordForm.errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordForm.data.password_confirmation}
                                    onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                    required
                                />
                                {passwordForm.errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">{passwordForm.errors.password_confirmation}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={passwordForm.processing}
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                                >
                                    {passwordForm.processing ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

