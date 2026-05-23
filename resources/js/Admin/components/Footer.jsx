export default function AdminFooter() {
    return (
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} CourseBag Admin. All rights reserved.
                </p>
                <p className="text-sm text-gray-500">
                    Version 1.0.0
                </p>
            </div>
        </footer>
    );
}

