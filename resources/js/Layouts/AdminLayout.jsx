import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AdminSidebar from '../Admin/components/Sidebar';
import AdminHeader from '../Admin/components/Header';
import AdminFooter from '../Admin/components/Footer';
import Toast from '../Admin/components/Toast';

export default function AdminLayout({ children, title = 'Admin Dashboard' }) {
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Toast Notifications */}
            <Toast />

            {/* Sidebar - Fixed/Sticky */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Header - Sticky/Fixed */}
                <div className="sticky top-0 z-40">
                    <AdminHeader 
                        title={title}
                        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    />
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    {children}
                </main>

                {/* Footer */}
                <AdminFooter />
            </div>
        </div>
    );
}

