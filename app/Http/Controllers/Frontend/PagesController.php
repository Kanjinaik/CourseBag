<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PagesController extends Controller
{
    /**
     * Display the specified page.
     */
    public function show(Request $request, ?string $type = null): Response
    {
        // Get type from route parameter or request defaults
        $pageType = $type ?? $request->route('type') ?? $request->get('type');
        
        if (!$pageType) {
            abort(404, 'Page type not specified');
        }

        // Fetch the page from database
        $page = Page::where('type', $pageType)
            ->where('is_active', true)
            ->first();

        if (!$page) {
            $pageData = $this->defaultPageData($pageType);

            if (!$pageData) {
                abort(404, "Page with type '{$pageType}' not found or is not active");
            }

            return Inertia::render('Frontend/pages/pages/Show', [
                'page' => $pageData,
            ]);
        }

        // Get only the fields we need and ensure they are primitives
        $pageData = $page->only(['title', 'content', 'type']);
        
        // Convert all values to strings, handling nulls
        $pageData['title'] = $pageData['title'] ?? 'Untitled';
        $pageData['content'] = $pageData['content'] ?? '';
        $pageData['type'] = $pageData['type'] ?? $pageType;
        
        // Force string conversion for all values
        $pageData = [
            'title' => (string) $pageData['title'],
            'content' => (string) $pageData['content'],
            'type' => (string) $pageData['type'],
        ];

        return Inertia::render('Frontend/pages/pages/Show', [
            'page' => $pageData,
        ]);
    }

    private function defaultPageData(string $type): ?array
    {
        $pages = [
            'terms-of-service' => [
                'title' => 'Terms of Service',
                'content' => '<p>Welcome to CourseBag. By using this website, you agree to follow our terms, use the platform responsibly, and respect course access policies.</p>',
            ],
            'privacy-policy' => [
                'title' => 'Privacy Policy',
                'content' => '<p>We respect your privacy. Information you provide is used to operate your account, process purchases, and improve your learning experience.</p>',
            ],
            'refund-policy' => [
                'title' => 'Refund Policy',
                'content' => '<p>If you are not satisfied with a course purchase, please contact support. Refund requests are reviewed according to the course and payment policy.</p>',
            ],
        ];

        if (!isset($pages[$type])) {
            return null;
        }

        return [
            'title' => $pages[$type]['title'],
            'content' => $pages[$type]['content'],
            'type' => $type,
        ];
    }
}

