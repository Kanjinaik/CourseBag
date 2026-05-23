import '../css/app.css';
import './bootstrap';
// Import react-quill CSS globally
import 'react-quill/dist/quill.snow.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => title, // Title is already formatted in Meta component
    resolve: (name) => {
        const pages = import.meta.glob('./**/*.jsx', { eager: true });
        let path = `./${name}.jsx`;

        // Check if the direct path exists
        if (pages[path]) {
            return pages[path];
        }

        // Handle Frontend/pages structure
        if (name.startsWith('Frontend/pages/')) {
            path = `./${name}.jsx`;
            if (pages[path]) {
                return pages[path];
            }
        }

        // Fallback for backward compatibility with Pages directory
        path = `./Pages/${name}.jsx`;
        if (pages[path]) {
            return pages[path];
        }

        // If still not found, try the old method
        return resolvePageComponent(
            `./${name}.jsx`,
            import.meta.glob('./**/*.jsx'),
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
