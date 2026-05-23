import Checkbox from '@/User/Components/Checkbox';
import InputError from '@/User/Components/InputError';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <FrontendLayout>
            <Head title="Log in" />
            <link rel="stylesheet" href="/frontendassets/css/form.css" />

            <div className="form-container min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
                {/* Decorative shapes */}
                <div className="decorative-shape"></div>
                <div className="decorative-shape"></div>

                <div className="max-w-md w-full space-y-8 relative z-10">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-4xl font-bold gradient-text mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-gray-600">
                            Sign in to continue your learning journey
                        </p>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-sm font-medium">
                            {status}
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="form-card rounded-2xl p-8 border border-gray-100">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div className="input-wrapper">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <svg className="input-icon h-5 w-5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="form-input block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                        placeholder="you@example.com"
                                        autoComplete="username"
                                        autoFocus
                                        onChange={(e) => setData('email', e.target.value)}
                                        onFocus={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon) icon.classList.add('text-emerald-500');
                                        }}
                                        onBlur={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon && !e.target.value) icon.classList.remove('text-emerald-500');
                                        }}
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            {/* Password Field */}
                            <div className="input-wrapper">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <svg className="input-icon h-5 w-5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="form-input block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        onFocus={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon) icon.classList.add('text-emerald-500');
                                        }}
                                        onBlur={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon && !e.target.value) icon.classList.remove('text-emerald-500');
                                        }}
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer group">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                        Remember me
                                    </span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="form-button w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white gradient-bg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="button-loading">Logging in...</span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
