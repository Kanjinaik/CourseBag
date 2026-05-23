import InputError from '@/User/Components/InputError';
import FrontendLayout from '@/Layouts/FrontendLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <FrontendLayout>
            <Head title="Register" />
            <link rel="stylesheet" href="/frontendassets/css/form.css" />

            <div className="form-container min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
                {/* Decorative shapes */}
                <div className="decorative-shape"></div>
                <div className="decorative-shape"></div>

                <div className="max-w-md w-full space-y-8 relative z-10">
                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-4xl font-bold gradient-text mb-2">
                            Create Account
                        </h2>
                        <p className="text-gray-600">
                            Join thousands of learners and start your journey today
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="form-card rounded-2xl p-8 border border-gray-100">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Name Field */}
                            <div className="input-wrapper">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <svg className="input-icon h-5 w-5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={data.name}
                                        className="form-input block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                        placeholder="John Doe"
                                        autoComplete="name"
                                        autoFocus
                                        onChange={(e) => setData('name', e.target.value)}
                                        onFocus={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon) icon.classList.add('text-emerald-500');
                                        }}
                                        onBlur={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon && !e.target.value) icon.classList.remove('text-emerald-500');
                                        }}
                                        required
                                    />
                                </div>
                                <InputError message={errors.name} className="mt-1" />
                            </div>

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
                                        onChange={(e) => setData('email', e.target.value)}
                                        onFocus={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon) icon.classList.add('text-emerald-500');
                                        }}
                                        onBlur={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon && !e.target.value) icon.classList.remove('text-emerald-500');
                                        }}
                                        required
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
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        onFocus={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon) icon.classList.add('text-emerald-500');
                                        }}
                                        onBlur={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon && !e.target.value) icon.classList.remove('text-emerald-500');
                                        }}
                                        required
                                    />
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="input-wrapper">
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                        <svg className="input-icon h-5 w-5 text-gray-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="form-input block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        onFocus={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon) icon.classList.add('text-emerald-500');
                                        }}
                                        onBlur={(e) => {
                                            const icon = e.target.previousElementSibling?.querySelector('.input-icon');
                                            if (icon && !e.target.value) icon.classList.remove('text-emerald-500');
                                        }}
                                        required
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        type="checkbox"
                                        required
                                        className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="text-gray-600">
                                        I agree to the{' '}
                                        <Link href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                            Terms and Conditions
                                        </Link>{' '}
                                        and{' '}
                                        <Link href="#" className="text-emerald-600 hover:text-emerald-700 font-medium">
                                            Privacy Policy
                                        </Link>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="form-button w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white gradient-bg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <span className="button-loading">Creating account...</span>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link
                                href={route('login')}
                                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
