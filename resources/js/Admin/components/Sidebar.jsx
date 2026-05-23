import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Icon Components
const DashboardIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const CategoriesIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
);

const CoursesIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const OrdersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const TransactionsIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const SettingsIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LogoutIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

export default function AdminSidebar({ isOpen, onClose }) {
    const { url, props } = usePage();
    const admin = props.admin?.user;
    
    const isActive = (path) => url.startsWith(path);
    const isExactActive = (path) => url === path;

    // Check if any courses submenu is active to auto-expand
    const coursesSubmenuActive = 
        url.startsWith('/admin/categories') || 
        url.startsWith('/admin/courses');

    const [coursesMenuOpen, setCoursesMenuOpen] = useState(coursesSubmenuActive);

    // Auto-expand if submenu is active
    useEffect(() => {
        if (coursesSubmenuActive) {
            setCoursesMenuOpen(true);
        }
    }, [coursesSubmenuActive]);

    const menuItems = [
        { name: 'Dashboard', Icon: DashboardIcon, href: '/admin/dashboard' },
        { name: 'Users', Icon: UsersIcon, href: '/admin/users' },
        { name: 'Orders', Icon: OrdersIcon, href: '/admin/orders' },
        { name: 'Transactions', Icon: TransactionsIcon, href: '/admin/transactions' },
    ];

    // Check if settings submenu is active
    const settingsSubmenuActive = url.startsWith('/admin/pages') || url.startsWith('/admin/settings');
    const [settingsMenuOpen, setSettingsMenuOpen] = useState(settingsSubmenuActive);

    // Auto-expand if submenu is active
    useEffect(() => {
        if (settingsSubmenuActive) {
            setSettingsMenuOpen(true);
        }
    }, [settingsSubmenuActive]);

    const PagesIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const WebsiteSettingsIcon = ({ className }) => (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    );

    const settingsSubmenu = [
        { name: 'Pages', href: '/admin/pages', icon: PagesIcon },
        { name: 'Website Settings', href: '/admin/settings/website', icon: WebsiteSettingsIcon },
    ];

    const coursesSubmenu = [
        { name: 'Categories', href: '/admin/categories', icon: CategoriesIcon },
        { name: 'Create Category', href: '/admin/categories/create', icon: null },
        { name: 'Courses', href: '/admin/courses', icon: CoursesIcon },
        { name: 'Create Course', href: '/admin/courses/create', icon: null },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50
                w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                flex flex-col h-screen
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
                    <Link href="/admin/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Admin</span>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {/* Dashboard */}
                    {menuItems.filter(item => item.name === 'Dashboard').map((item) => {
                        const Icon = item.Icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 rounded-lg
                                    transition-all duration-200
                                    ${active
                                        ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-gray-500'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Courses Menu with Submenu */}
                    <div className="space-y-1">
                        <button
                            onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}
                            className={`
                                w-full flex items-center justify-between px-4 py-3 rounded-lg
                                transition-all duration-200
                                ${coursesSubmenuActive
                                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                                }
                            `}
                        >
                            <div className="flex items-center space-x-3">
                                <CoursesIcon className={`w-5 h-5 ${coursesSubmenuActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                                <span>Courses</span>
                            </div>
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${coursesMenuOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Submenu */}
                        <div className={`overflow-hidden transition-all duration-300 ${coursesMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="ml-2 mt-2 space-y-1 pl-6 relative">
                                {/* Active indicator line */}
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-400 opacity-30"></div>
                                
                                {coursesSubmenu.map((subItem) => {
                                    const SubIcon = subItem.icon;
                                    let subActive = false;
                                    
                                    // Determine active state based on href
                                    if (subItem.href === '/admin/categories') {
                                        // Active for categories list or edit (but not create)
                                        subActive = url === '/admin/categories' || 
                                            (url.startsWith('/admin/categories/') && 
                                             !url.includes('/create') && 
                                             url !== '/admin/categories/create');
                                    } else if (subItem.href === '/admin/categories/create') {
                                        // Active only for create page
                                        subActive = url === '/admin/categories/create';
                                    } else if (subItem.href === '/admin/courses') {
                                        // Active for courses list or edit (but not create)
                                        subActive = url === '/admin/courses' || 
                                            (url.startsWith('/admin/courses/') && 
                                             !url.includes('/create') && 
                                             url !== '/admin/courses/create');
                                    } else if (subItem.href === '/admin/courses/create') {
                                        // Active only for create page
                                        subActive = url === '/admin/courses/create';
                                    }
                                    
                                    return (
                                        <Link
                                            key={subItem.name}
                                            href={subItem.href}
                                            className={`
                                                group relative flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm
                                                transition-all duration-200 ease-in-out
                                                ${subActive
                                                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-700 font-semibold shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                                                }
                                            `}
                                        >
                                            {/* Active indicator dot */}
                                            {subActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                            )}
                                            
                                            {/* Icon or dot */}
                                            <div className={`flex items-center justify-center ${subActive ? 'scale-110' : ''} transition-transform duration-200`}>
                                                {SubIcon ? (
                                                    <SubIcon className={`w-4 h-4 ${subActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
                                                )}
                                            </div>
                                            
                                            <span className={`relative ${subActive ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-600'} transition-colors duration-200`}>
                                                {subItem.name}
                                                {subActive && (
                                                    <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-emerald-500 rounded-full opacity-50"></span>
                                                )}
                                            </span>
                                            
                                            {/* Hover effect */}
                                            {!subActive && (
                                                <div className="absolute inset-0 rounded-lg bg-emerald-50/0 group-hover:bg-emerald-50/30 transition-colors duration-200 -z-10"></div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Other Menu Items (Users, Orders, Transactions) */}
                    {menuItems.filter(item => item.name !== 'Dashboard').map((item) => {
                        const Icon = item.Icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center space-x-3 px-4 py-3 rounded-lg
                                    transition-all duration-200
                                    ${active
                                        ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                                    }
                                `}
                            >
                                <Icon className={`w-5 h-5 ${active ? 'text-emerald-600' : 'text-gray-500'}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}

                    {/* Settings Menu with Submenu */}
                        <div className="space-y-1">
                            <button
                                onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
                                className={`
                                    w-full flex items-center justify-between px-4 py-3 rounded-lg
                                    transition-all duration-200
                                    ${settingsSubmenuActive
                                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                                    }
                                `}
                            >
                                <div className="flex items-center space-x-3">
                                    <SettingsIcon className={`w-5 h-5 ${settingsSubmenuActive ? 'text-emerald-600' : 'text-gray-500'}`} />
                                    <span>Settings</span>
                                </div>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${settingsMenuOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ${settingsMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="ml-2 mt-2 space-y-1 pl-6 relative">
                                    {/* Active indicator line */}
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-500 to-emerald-400 opacity-30"></div>
                                    
                                    {settingsSubmenu.map((subItem) => {
                                        const SubIcon = subItem.icon;
                                        // For Website Settings, mark active for website settings, SEO, and payment gateways pages
                                        const subActive = subItem.href === '/admin/settings/website' 
                                            ? (url.startsWith('/admin/settings/website') || 
                                               url.startsWith('/admin/settings/seo') || 
                                               url.startsWith('/admin/settings/payments'))
                                            : url.startsWith(subItem.href);
                                        
                                        return (
                                            <Link
                                                key={subItem.name}
                                                href={subItem.href}
                                                className={`
                                                    group relative flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm
                                                    transition-all duration-200 ease-in-out
                                                    ${subActive
                                                        ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 text-emerald-700 font-semibold shadow-sm'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-600'
                                                    }
                                                `}
                                            >
                                                {/* Active indicator dot */}
                                                {subActive && (
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
                                                )}
                                                
                                                {/* Icon */}
                                                <div className={`flex items-center justify-center ${subActive ? 'scale-110' : ''} transition-transform duration-200`}>
                                                    {SubIcon && (
                                                        <SubIcon className={`w-4 h-4 ${subActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                                                    )}
                                                </div>
                                                
                                                <span className={`relative ${subActive ? 'text-emerald-700' : 'text-gray-600 group-hover:text-emerald-600'} transition-colors duration-200`}>
                                                    {subItem.name}
                                                    {subActive && (
                                                        <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-emerald-500 rounded-full opacity-50"></span>
                                                    )}
                                                </span>
                                                
                                                {/* Hover effect */}
                                                {!subActive && (
                                                    <div className="absolute inset-0 rounded-lg bg-emerald-50/0 group-hover:bg-emerald-50/30 transition-colors duration-200 -z-10"></div>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* User Section */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-600 font-semibold">
                                {admin?.name?.charAt(0).toUpperCase() || 'A'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {admin?.name || 'Admin User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {admin?.email || 'admin@example.com'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => router.post('/admin/logout')}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                        <LogoutIcon className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

