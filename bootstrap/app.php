<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Exclude payment routes from CSRF protection
        $middleware->validateCsrfTokens(except: [
            'payment/create-order',
            'payment/success',
            'payment/failure',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Handle admin authentication redirects
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('admin/*') || $request->routeIs('admin.*')) {
                return redirect()->guest(route('admin.login'));
            }
        });
    })->create();
