<?php

namespace App\Http\Middleware;

use App\Models\Course;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Get website settings (logos)
        $mainLogo = WebsiteSetting::getValue('main_logo', null);
        $favicon = WebsiteSetting::getValue('favicon', null);
        
        // Get SEO settings
        $seoSettings = [
            'site_title' => WebsiteSetting::getValue('seo_site_title', ''),
            'meta_title' => WebsiteSetting::getValue('seo_meta_title', ''),
            'meta_description' => WebsiteSetting::getValue('seo_meta_description', ''),
            'meta_keywords' => WebsiteSetting::getValue('seo_meta_keywords', ''),
            'meta_author' => WebsiteSetting::getValue('seo_meta_author', ''),
            'robots' => WebsiteSetting::getValue('seo_robots', 'index, follow'),
            'canonical_url' => WebsiteSetting::getValue('seo_canonical_url', ''),
            'schema_markup' => WebsiteSetting::getValue('seo_schema_markup', ''),
            'og_title' => WebsiteSetting::getValue('seo_og_title', ''),
            'og_description' => WebsiteSetting::getValue('seo_og_description', ''),
            'og_image' => WebsiteSetting::getValue('seo_og_image', null),
            'og_type' => WebsiteSetting::getValue('seo_og_type', 'website'),
            'og_site_name' => WebsiteSetting::getValue('seo_og_site_name', ''),
            'twitter_card' => WebsiteSetting::getValue('seo_twitter_card', 'summary_large_image'),
            'twitter_title' => WebsiteSetting::getValue('seo_twitter_title', ''),
            'twitter_description' => WebsiteSetting::getValue('seo_twitter_description', ''),
            'twitter_image' => WebsiteSetting::getValue('seo_twitter_image', null),
            'twitter_site' => WebsiteSetting::getValue('seo_twitter_site', ''),
            'google_analytics_id' => WebsiteSetting::getValue('seo_google_analytics_id', ''),
            'google_tag_manager_id' => WebsiteSetting::getValue('seo_google_tag_manager_id', ''),
            'facebook_pixel_id' => WebsiteSetting::getValue('seo_facebook_pixel_id', ''),
            'custom_head_code' => WebsiteSetting::getValue('seo_custom_head_code', ''),
            'custom_body_code' => WebsiteSetting::getValue('seo_custom_body_code', ''),
        ];
        
        // Get popular courses (5 most recent active courses)
        $popularCourses = Course::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'slug' => $course->slug,
                ];
            });
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'admin' => [
                'user' => $request->user('admin'),
            ],
            'websiteSettings' => [
                'main_logo' => $mainLogo ? url('uploads/websitesettings/logo/' . $mainLogo) : null,
                'favicon' => $favicon ? url('uploads/websitesettings/logo/' . $favicon) : null,
                'site_name' => WebsiteSetting::getValue('site_name', config('app.name', 'CourseBag')),
            ],
            'seoSettings' => $seoSettings,
            'popularCourses' => $popularCourses,
        ];
    }
}
