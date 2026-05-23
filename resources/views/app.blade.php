<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        @php
            $favicon = \App\Models\WebsiteSetting::getValue('favicon', null);
        @endphp
        @if($favicon)
            <link rel="icon" type="image/x-icon" href="{{ url('uploads/websitesettings/logo/' . $favicon) }}">
            <link rel="shortcut icon" type="image/x-icon" href="{{ url('uploads/websitesettings/logo/' . $favicon) }}">
        @endif

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Custom CSS -->
        <link rel="stylesheet" href="{{ asset('frontendassets/css/main.css') }}">
        <link rel="stylesheet" href="{{ asset('frontendassets/css/custom.css') }}">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite('resources/js/app.jsx')
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        
        @php
            $customBodyCode = \App\Models\WebsiteSetting::getValue('seo_custom_body_code', '');
        @endphp
        @if($customBodyCode)
            {!! $customBodyCode !!}
        @endif
    </body>
</html>
