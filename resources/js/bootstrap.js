import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import { Ziggy } from './ziggy';
const serverZiggy = window.Ziggy || {};
window.Ziggy = {
    ...Ziggy,
    ...serverZiggy,
    routes: {
        ...(Ziggy.routes || {}),
        ...(serverZiggy.routes || {}),
    },
};

// Route helper function with current route checking
window.route = function(name, params, absolute, currentRoute) {
    // If no arguments passed, return route helper object
    if (arguments.length === 0) {
        return {
            current: function(routeName) {
                // Get current route from Inertia page data
                const currentRoute = window.location.pathname;
                
                // Support wildcard patterns (e.g., 'mycourses.*')
                if (routeName.includes('*')) {
                    const basePattern = routeName.replace('*', '');
                    const routeKeys = Object.keys(window.Ziggy.routes);
                    return routeKeys.some(key => {
                        // Check if route name starts with the base pattern
                        if (key.startsWith(basePattern)) {
                            const route = window.Ziggy.routes[key];
                            if (!route) return false;
                            let routeUri = route.uri;
                            routeUri = routeUri.replace(/\{[^}]+\}/g, '[^/]+');
                            const routeRegex = new RegExp('^/' + routeUri + '$');
                            return routeRegex.test(currentRoute);
                        }
                        return false;
                    });
                }
                
                // Exact route name match
                const route = window.Ziggy.routes[routeName];
                if (!route) return false;

                // Simple check - compare current path with route URI
                // This is a basic implementation
                let routeUri = route.uri;
                // Remove parameter placeholders for comparison
                routeUri = routeUri.replace(/\{[^}]+\}/g, '[^/]+');
                const routeRegex = new RegExp('^/' + routeUri + '$');
                return routeRegex.test(currentRoute);
            }
        };
    }

    // Normal route generation
    const route = window.Ziggy.routes[name];
    if (!route) {
        console.warn(`Route [${name}] not defined. Returning fallback path.`);
        // Return a fallback path instead of throwing an error
        return '#';
    }

    let uri = route.uri;

    if (params) {
        // Replace parameters in URI
        if (typeof params === 'object') {
            for (const [key, value] of Object.entries(params)) {
                uri = uri.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
            }
        } else if (typeof params === 'string' || typeof params === 'number') {
            // Handle single parameter (like slug or id)
            // Find the first parameter placeholder
            const paramName = route.parameters && route.parameters.length > 0 ? route.parameters[0] : 'slug';
            uri = uri.replace(new RegExp(`\\{${paramName}\\}`, 'g'), params);
        }
    }

    const baseUrl = window.Ziggy.url + (window.Ziggy.port ? ':' + window.Ziggy.port : '');
    return absolute ? baseUrl + '/' + uri : '/' + uri;
};
