<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class WebsiteSettingsController extends Controller
{
    /**
     * Display the website settings management interface.
     */
    public function index(): Response
    {
        $settingTypes = [
            [
                'key' => 'logos',
                'label' => 'Logos Settings',
                'description' => 'Manage your website logo and favicon',
                'icon' => 'image',
            ],
            [
                'key' => 'seo',
                'label' => 'SEO Settings',
                'description' => 'Manage meta tags, social media, and analytics',
                'icon' => 'search',
                'external' => true,
                'href' => '/admin/settings/seo',
            ],
            [
                'key' => 'payment-gateways',
                'label' => 'Payment Gateways',
                'description' => 'Manage payment gateway integrations and API keys',
                'icon' => 'credit-card',
                'external' => true,
                'href' => '/admin/settings/payments',
            ],
        ];

        return Inertia::render('Admin/Settings/WebsiteSettings/Index', [
            'settingTypes' => $settingTypes,
        ]);
    }

    /**
     * Display a specific setting for editing.
     */
    public function show(string $type): Response
    {
        $validTypes = ['logos'];
        
        if (!in_array($type, $validTypes)) {
            abort(404);
        }

        // Fetch settings from database
        $mainLogo = WebsiteSetting::getValue('main_logo', null);
        $favicon = WebsiteSetting::getValue('favicon', null);

        return Inertia::render('Admin/Settings/WebsiteSettings/components/LogosSettings', [
            'mainLogo' => $mainLogo ? url('uploads/websitesettings/logo/' . $mainLogo) : null,
            'favicon' => $favicon ? url('uploads/websitesettings/logo/' . $favicon) : null,
        ]);
    }

    /**
     * Update website settings.
     */
    public function update(Request $request, string $type): RedirectResponse
    {
        // Handle POST requests with _method=PUT for file uploads
        return $this->store($request, $type);
    }

    /**
     * Store/Update website settings (handles both POST and PUT).
     */
    public function store(Request $request, string $type): RedirectResponse
    {
        $validTypes = ['logos'];
        
        if (!in_array($type, $validTypes)) {
            abort(404);
        }

        if ($type === 'logos') {
            $validated = $request->validate([
                'main_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'favicon' => 'nullable|image|mimes:jpeg,png,jpg,gif,ico|max:512',
            ]);

            // Ensure upload directory exists
            $uploadDir = public_path('uploads/websitesettings/logo');
            if (!File::exists($uploadDir)) {
                File::makeDirectory($uploadDir, 0755, true);
            }

            $filesUploaded = false;

            // Handle main logo upload
            if ($request->hasFile('main_logo')) {
                // Delete old logo if exists
                $oldLogo = WebsiteSetting::getValue('main_logo', null);
                if ($oldLogo && $oldLogo !== '') {
                    $oldLogoPath = public_path('uploads/websitesettings/logo/' . $oldLogo);
                    if (File::exists($oldLogoPath)) {
                        File::delete($oldLogoPath);
                    }
                }
                
                $file = $request->file('main_logo');
                $fileName = 'main_logo_' . time() . '.' . $file->getClientOriginalExtension();
                
                if ($file->move($uploadDir, $fileName)) {
                    WebsiteSetting::setValue('main_logo', $fileName);
                    $filesUploaded = true;
                }
            }

            // Handle favicon upload
            if ($request->hasFile('favicon')) {
                // Delete old favicon if exists
                $oldFavicon = WebsiteSetting::getValue('favicon', null);
                if ($oldFavicon && $oldFavicon !== '') {
                    $oldFaviconPath = public_path('uploads/websitesettings/logo/' . $oldFavicon);
                    if (File::exists($oldFaviconPath)) {
                        File::delete($oldFaviconPath);
                    }
                }
                
                $file = $request->file('favicon');
                $fileName = 'favicon_' . time() . '.' . $file->getClientOriginalExtension();
                
                if ($file->move($uploadDir, $fileName)) {
                    WebsiteSetting::setValue('favicon', $fileName);
                    $filesUploaded = true;
                }
            }

            if ($filesUploaded) {
                return redirect()
                    ->route('admin.settings.website.show', $type)
                    ->with('success', 'Settings updated successfully.');
            } else {
                return redirect()
                    ->route('admin.settings.website.show', $type)
                    ->with('error', 'No files were uploaded. Please select at least one file.');
            }
        }

        return redirect()
            ->route('admin.settings.website.show', $type)
            ->with('error', 'Invalid setting type.');
    }
}
