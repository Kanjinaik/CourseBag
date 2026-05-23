import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Header() {
    const page = usePage();
    const { websiteSettings, auth } = page.props;
    const [cartCount, setCartCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    // Safely extract url, ensuring it's a string
    const url = page?.url && typeof page.url === 'string' ? page.url : window.location.pathname;

    const isActive = (path) => url === path;
    
    // Get logo from settings or use default text
    const logoUrl = websiteSettings?.main_logo;
    const siteName = websiteSettings?.site_name || 'CourseBag';
    const isAuthenticated = !!auth?.user;
    const user = auth?.user;

    // Fetch cart count
    useEffect(() => {
        const cartCountRoute = route('cart.count') || '/cart/count';
        fetch(cartCountRoute)
            .then(res => res.json())
            .then(data => setCartCount(data.count || 0))
            .catch(() => setCartCount(0));
    }, []);
    
    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Navigation Links - Left Side */}
                    <div className="flex items-center space-x-6">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            {logoUrl ? (
                                <img 
                                    src={logoUrl} 
                                    alt={siteName}
                                    className="h-10 w-auto object-contain"
                                />
                            ) : (
                                <h1 className="text-2xl font-bold text-emerald-500">{siteName}</h1>
                            )}
                        </Link>
                        
                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link
                                href="/"
                                className={`text-gray-700 hover:text-emerald-500 transition duration-300 ${
                                    isActive('/') ? 'font-bold text-emerald-600 border-b-2 border-emerald-600' : ''
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/courses"
                                className={`text-gray-700 hover:text-emerald-500 transition duration-300 ${
                                    isActive('/courses') ? 'font-bold text-emerald-600 border-b-2 border-emerald-600' : ''
                                }`}
                            >
                                All Courses
                            </Link>
                            <Link
                                href="/about"
                                className={`text-gray-700 hover:text-emerald-500 transition duration-300 ${
                                    isActive('/about') ? 'font-bold text-emerald-600 border-b-2 border-emerald-600' : ''
                                }`}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className={`text-gray-700 hover:text-emerald-500 transition duration-300 ${
                                    isActive('/contact') ? 'font-bold text-emerald-600 border-b-2 border-emerald-600' : ''
                                }`}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-700 hover:text-emerald-500 transition duration-300 focus:outline-none"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>

                    {/* Cart and User Dropdown - Right Side */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Cart Icon */}
                        <Link
                            href={route('cart.index') || '/cart'}
                            className="relative text-gray-700 hover:text-emerald-500 transition duration-300"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>
                        
                        {/* User Dropdown - Beside Cart */}
                        {isAuthenticated ? (
                            <div 
                                className="relative"
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}
                            >
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-500 transition duration-300 focus:outline-none"
                                >
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="hidden lg:block font-medium">{user?.name || 'User'}</span>
                                    <svg 
                                        className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {/* Dropdown Menu - No gap, positioned directly below with invisible bridge */}
                                {showDropdown && (
                                    <>
                                        {/* Invisible bridge to prevent dropdown from closing */}
                                        <div className="absolute right-0 top-full w-full h-2"></div>
                                        <div className="absolute right-0 top-full pt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                        {/* User Info Section */}
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                                        </div>
                                        
                                        {/* Menu Items */}
                                        <div className="py-1">
                                            <Link
                                                href={route('dashboard')}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                Dashboard
                                            </Link>
                                            <Link
                                                href={route('mycourses.index')}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                My Courses
                                            </Link>
                                            <Link
                                                href={route('mytransections.index')}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                My Transactions
                                            </Link>
                                            <Link
                                                href={route('profile.edit')}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                            >
                                                <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                My Profile
                                            </Link>
                                        </div>
                                        
                                        {/* Logout Button */}
                                        <div className="border-t border-gray-100 pt-1">
                                            <button
                                                onClick={() => router.post(route('logout'))}
                                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link
                                    href={route('login') || '/login'}
                                    className="text-gray-700 hover:text-emerald-500 transition duration-300"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register') || '/register'}
                                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition duration-300"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white">
                        <div className="px-4 pt-2 pb-4 space-y-1">
                            {/* Mobile Navigation Links */}
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                                    isActive('/') 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-500'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/courses"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                                    isActive('/courses') 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-500'
                                }`}
                            >
                                All Courses
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                                    isActive('/about') 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-500'
                                }`}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium transition duration-300 ${
                                    isActive('/contact') 
                                        ? 'bg-emerald-50 text-emerald-600' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-500'
                                }`}
                            >
                                Contact
                            </Link>

                            {/* Mobile Cart */}
                            <Link
                                href={route('cart.index') || '/cart'}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500 transition duration-300"
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Cart
                                {cartCount > 0 && (
                                    <span className="ml-2 bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile User Menu */}
                            {isAuthenticated ? (
                                <>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="px-3 py-2">
                                            <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={route('dashboard')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500 transition duration-300"
                                    >
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('mycourses.index')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500 transition duration-300"
                                    >
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        My Courses
                                    </Link>
                                    <Link
                                        href={route('mytransections.index')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500 transition duration-300"
                                    >
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        My Transactions
                                    </Link>
                                    <Link
                                        href={route('profile.edit')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500 transition duration-300"
                                    >
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            router.post(route('logout'));
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition duration-300"
                                    >
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                                    <Link
                                        href={route('login') || '/login'}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-emerald-500 transition duration-300 text-center"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register') || '/register'}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 rounded-md text-base font-medium bg-emerald-500 text-white hover:bg-emerald-700 transition duration-300 text-center"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
