import { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

export default function Toast() {
    const { flash } = usePage().props;
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Clear existing toasts when flash messages change
        setToasts([]);

        const newToasts = [];

        if (flash?.success) {
            newToasts.push({
                id: `success-${Date.now()}`,
                type: 'success',
                message: flash.success,
            });
        }

        if (flash?.error) {
            newToasts.push({
                id: `error-${Date.now()}`,
                type: 'error',
                message: flash.error,
            });
        }

        if (newToasts.length > 0) {
            setToasts(newToasts);

            // Auto-dismiss each toast after 5 seconds
            newToasts.forEach((toast) => {
                setTimeout(() => {
                    setToasts((prev) => {
                        const updated = prev.filter((t) => t.id !== toast.id);
                        // Clear flash messages when all toasts are dismissed
                        if (updated.length === 0) {
                            setTimeout(() => {
                                router.reload({ only: ['flash'] });
                            }, 100);
                        }
                        return updated;
                    });
                }, 5000);
            });
        }
    }, [flash?.success, flash?.error]);

    const removeToast = (id) => {
        setToasts((prev) => {
            const updated = prev.filter((toast) => toast.id !== id);
            // Clear flash messages when all toasts are dismissed
            if (updated.length === 0) {
                setTimeout(() => {
                    router.reload({ only: ['flash'] });
                }, 100);
            }
            return updated;
        });
    };

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        min-w-[300px] max-w-md px-4 py-3 rounded-lg shadow-lg
                        flex items-center justify-between gap-3
                        transform transition-all duration-300 ease-in-out
                        ${
                            toast.type === 'success'
                                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                                : 'bg-red-50 border border-red-200 text-red-800'
                        }
                    `}
                    style={{
                        animation: 'slideInRight 0.3s ease-out',
                    }}
                >
                    <div className="flex items-center gap-3 flex-1">
                        {toast.type === 'success' ? (
                            <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-5 h-5 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        )}
                        <span className="font-medium text-sm flex-1">{toast.message}</span>
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className={`
                            flex-shrink-0 p-1 rounded hover:bg-black/10 transition-colors
                            ${toast.type === 'success' ? 'text-emerald-600' : 'text-red-600'}
                        `}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}

