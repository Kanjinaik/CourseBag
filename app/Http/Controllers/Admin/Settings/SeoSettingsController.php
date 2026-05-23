<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SeoSettingsController extends Controller
{
    /**
     * Display the SEO settings management interface.
     */
    public function index(): Response
    {
        $settingTypes = [
            [
                'key' => 'general',
                'label' => 'General SEO',
                'description' => 'Manage meta tags, titles, and descriptions',
                'icon' => 'search',
            ],
            [
                'key' => 'social',
                'label' => 'Social Media',
                'description' => 'Configure Open Graph and Twitter Card settings',
                'icon' => 'social',
            ],
            [
                'key' => 'analytics',
                'label' => 'Analytics & Tracking',
                'description' => 'Manage Google Analytics and other tracking codes',
                'icon' => 'analytics',
            ],
        ];

        return Inertia::render('Admin/Settings/SeoSettings/Index', [
            'settingTypes' => $settingTypes,
        ]);
    }

    /**
     * Display a specific SEO setting for editing.
     */
    public function show(string $type): Response
    {
        $validTypes = ['general', 'social', 'analytics'];
        
        if (!in_array($type, $validTypes)) {
            abort(404);
        }

        $settings = [];

        if ($type === 'general') {
            $settings = [
                'site_title' => WebsiteSetting::getValue('seo_site_title', ''),
                'meta_title' => WebsiteSetting::getValue('seo_meta_title', ''),
                'meta_description' => WebsiteSetting::getValue('seo_meta_description', ''),
                'meta_keywords' => WebsiteSetting::getValue('seo_meta_keywords', ''),
                'meta_author' => WebsiteSetting::getValue('seo_meta_author', ''),
                'robots' => WebsiteSetting::getValue('seo_robots', 'index, follow'),
                'canonical_url' => WebsiteSetting::getValue('seo_canonical_url', ''),
                'schema_markup' => WebsiteSetting::getValue('seo_schema_markup', ''),
            ];
        } elseif ($type === 'social') {
            $ogImage = WebsiteSetting::getValue('seo_og_image', null);
            $twitterImage = WebsiteSetting::getValue('seo_twitter_image', null);
            
            $settings = [
                'og_title' => WebsiteSetting::getValue('seo_og_title', ''),
                'og_description' => WebsiteSetting::getValue('seo_og_description', ''),
                'og_image' => $ogImage,
                'og_type' => WebsiteSetting::getValue('seo_og_type', 'website'),
                'og_site_name' => WebsiteSetting::getValue('seo_og_site_name', ''),
                'twitter_card' => WebsiteSetting::getValue('seo_twitter_card', 'summary_large_image'),
                'twitter_title' => WebsiteSetting::getValue('seo_twitter_title', ''),
                'twitter_description' => WebsiteSetting::getValue('seo_twitter_description', ''),
                'twitter_image' => $twitterImage,
                'twitter_site' => WebsiteSetting::getValue('seo_twitter_site', ''),
            ];
        } elseif ($type === 'analytics') {
            $settings = [
                'google_analytics_id' => WebsiteSetting::getValue('seo_google_analytics_id', ''),
                'google_tag_manager_id' => WebsiteSetting::getValue('seo_google_tag_manager_id', ''),
                'facebook_pixel_id' => WebsiteSetting::getValue('seo_facebook_pixel_id', ''),
                'custom_head_code' => WebsiteSetting::getValue('seo_custom_head_code', ''),
                'custom_body_code' => WebsiteSetting::getValue('seo_custom_body_code', ''),
            ];
        }

        return Inertia::render('Admin/Settings/SeoSettings/components/' . ucfirst($type) . 'SeoSettings', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update website settings.
     */
    public function update(Request $request, string $type): RedirectResponse
    {
        return $this->store($request, $type);
    }

    /**
     * Store/Update SEO settings.
     */
    public function store(Request $request, string $type): RedirectResponse
    {
        $validTypes = ['general', 'social', 'analytics'];
        
        if (!in_array($type, $validTypes)) {
            abort(404);
        }

        if ($type === 'general') {
            $validated = $request->validate([
                'site_title' => 'nullable|string|max:255',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
                'meta_keywords' => 'nullable|string|max:500',
                'meta_author' => 'nullable|string|max:255',
                'robots' => 'nullable|string|max:255',
                'canonical_url' => 'nullable|url|max:500',
                'schema_markup' => 'nullable|string',
            ]);

            WebsiteSetting::setValue('seo_site_title', $validated['site_title'] ?? '');
            WebsiteSetting::setValue('seo_meta_title', $validated['meta_title'] ?? '');
            WebsiteSetting::setValue('seo_meta_description', $validated['meta_description'] ?? '');
            WebsiteSetting::setValue('seo_meta_keywords', $validated['meta_keywords'] ?? '');
            WebsiteSetting::setValue('seo_meta_author', $validated['meta_author'] ?? '');
            WebsiteSetting::setValue('seo_robots', $validated['robots'] ?? 'index, follow');
            WebsiteSetting::setValue('seo_canonical_url', $validated['canonical_url'] ?? '');
            WebsiteSetting::setValue('seo_schema_markup', $validated['schema_markup'] ?? '');

        } elseif ($type === 'social') {
            $validated = $request->validate([
                'og_title' => 'nullable|string|max:255',
                'og_description' => 'nullable|string|max:500',
                'og_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'og_type' => 'nullable|string|max:50',
                'og_site_name' => 'nullable|string|max:255',
                'twitter_card' => 'nullable|string|max:50',
                'twitter_title' => 'nullable|string|max:255',
                'twitter_description' => 'nullable|string|max:500',
                'twitter_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'twitter_site' => 'nullable|string|max:255',
            ]);

            WebsiteSetting::setValue('seo_og_title', $validated['og_title'] ?? '');
            WebsiteSetting::setValue('seo_og_description', $validated['og_description'] ?? '');
            WebsiteSetting::setValue('seo_og_type', $validated['og_type'] ?? 'website');
            WebsiteSetting::setValue('seo_og_site_name', $validated['og_site_name'] ?? '');
            WebsiteSetting::setValue('seo_twitter_card', $validated['twitter_card'] ?? 'summary_large_image');
            WebsiteSetting::setValue('seo_twitter_title', $validated['twitter_title'] ?? '');
            WebsiteSetting::setValue('seo_twitter_description', $validated['twitter_description'] ?? '');
            WebsiteSetting::setValue('seo_twitter_site', $validated['twitter_site'] ?? '');

            // Handle OG image upload
            if ($request->hasFile('og_image')) {
                $uploadDir = public_path('uploads/seosettings');
                if (!\Illuminate\Support\Facades\File::exists($uploadDir)) {
                    \Illuminate\Support\Facades\File::makeDirectory($uploadDir, 0755, true);
                }

                $oldImage = WebsiteSetting::getValue('seo_og_image', null);
                if ($oldImage) {
                    $oldImagePath = public_path('uploads/seosettings/' . $oldImage);
                    if (\Illuminate\Support\Facades\File::exists($oldImagePath)) {
                        \Illuminate\Support\Facades\File::delete($oldImagePath);
                    }
                }

                $file = $request->file('og_image');
                $fileName = 'og_image_' . time() . '.' . $file->getClientOriginalExtension();
                
                if ($file->move($uploadDir, $fileName)) {
                    WebsiteSetting::setValue('seo_og_image', $fileName);
                }
            }

            // Handle Twitter image upload
            if ($request->hasFile('twitter_image')) {
                $uploadDir = public_path('uploads/seosettings');
                if (!\Illuminate\Support\Facades\File::exists($uploadDir)) {
                    \Illuminate\Support\Facades\File::makeDirectory($uploadDir, 0755, true);
                }

                $oldImage = WebsiteSetting::getValue('seo_twitter_image', null);
                if ($oldImage) {
                    $oldImagePath = public_path('uploads/seosettings/' . $oldImage);
                    if (\Illuminate\Support\Facades\File::exists($oldImagePath)) {
                        \Illuminate\Support\Facades\File::delete($oldImagePath);
                    }
                }

                $file = $request->file('twitter_image');
                $fileName = 'twitter_image_' . time() . '.' . $file->getClientOriginalExtension();
                
                if ($file->move($uploadDir, $fileName)) {
                    WebsiteSetting::setValue('seo_twitter_image', $fileName);
                }
            }

        } elseif ($type === 'analytics') {
            $validated = $request->validate([
                'google_analytics_id' => 'nullable|string|max:255',
                'google_tag_manager_id' => 'nullable|string|max:255',
                'facebook_pixel_id' => 'nullable|string|max:255',
                'custom_head_code' => 'nullable|string',
                'custom_body_code' => 'nullable|string',
            ]);

            WebsiteSetting::setValue('seo_google_analytics_id', $validated['google_analytics_id'] ?? '');
            WebsiteSetting::setValue('seo_google_tag_manager_id', $validated['google_tag_manager_id'] ?? '');
            WebsiteSetting::setValue('seo_facebook_pixel_id', $validated['facebook_pixel_id'] ?? '');
            WebsiteSetting::setValue('seo_custom_head_code', $validated['custom_head_code'] ?? '');
            WebsiteSetting::setValue('seo_custom_body_code', $validated['custom_body_code'] ?? '');
        }

        return redirect()
            ->route('admin.settings.seo.show', $type)
            ->with('success', 'SEO settings updated successfully.');
    }
}
