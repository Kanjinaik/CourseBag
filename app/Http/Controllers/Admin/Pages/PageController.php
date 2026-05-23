<?php

namespace App\Http\Controllers\Admin\Pages;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display the pages management interface.
     */
    public function index(): Response
    {
        // Fetch all pages from database
        $dbPages = Page::orderBy('type')->get();
        
        // Convert to array keyed by type for easy lookup
        $pagesByType = [];
        foreach ($dbPages as $page) {
            $pagesByType[$page->type] = $page;
        }
        
        // Helper function to get page data or defaults
        $getPageData = function($type, $defaultTitle) use ($pagesByType) {
            if (isset($pagesByType[$type]) && $pagesByType[$type]) {
                $page = $pagesByType[$type];
                $content = $page->content ?: '';
                
                // For contact page, ensure content is valid JSON or return empty JSON object
                if ($type === 'contact') {
                    if (empty($content)) {
                        $content = json_encode([
                            'address' => '',
                            'phone1' => '',
                            'phone2' => '',
                            'email1' => '',
                            'email2' => '',
                            'hours1' => '',
                            'hours2' => '',
                            'hours3' => '',
                        ]);
                    } else {
                        // Validate JSON
                        $decoded = json_decode($content, true);
                        if (json_last_error() !== JSON_ERROR_NONE) {
                            // If invalid JSON, reset to empty JSON object
                            $content = json_encode([
                                'address' => '',
                                'phone1' => '',
                                'phone2' => '',
                                'email1' => '',
                                'email2' => '',
                                'hours1' => '',
                                'hours2' => '',
                                'hours3' => '',
                            ]);
                        }
                    }
                }
                
                return [
                    'type' => $page->type,
                    'title' => $page->title ?: $defaultTitle,
                    'content' => $content,
                    'is_active' => (bool) ($page->is_active ?? true),
                ];
            }
            
            // Default data for new pages
            $defaultContent = '';
            if ($type === 'contact') {
                $defaultContent = json_encode([
                    'address' => '',
                    'phone1' => '',
                    'phone2' => '',
                    'email1' => '',
                    'email2' => '',
                    'hours1' => '',
                    'hours2' => '',
                    'hours3' => '',
                ]);
            }
            
            return [
                'type' => $type,
                'title' => $defaultTitle,
                'content' => $defaultContent,
                'is_active' => true,
            ];
        };
        
        // Build pages array with all page types
        $pageTypes = [
            'terms-of-service' => $getPageData('terms-of-service', 'Terms of Service'),
            'privacy-policy' => $getPageData('privacy-policy', 'Privacy Policy'),
            'refund-policy' => $getPageData('refund-policy', 'Refund Policy'),
            'contact' => $getPageData('contact', 'Contact Information'),
        ];

        return Inertia::render('Admin/pages/Index', [
            'pages' => $pageTypes,
        ]);
    }

    /**
     * Display a specific page for editing.
     */
    public function show(string $type): Response
    {
        $validTypes = ['terms-of-service', 'privacy-policy', 'refund-policy', 'contact'];
        
        if (!in_array($type, $validTypes)) {
            abort(404);
        }

        // Fetch the page from database
        $page = Page::where('type', $type)->first();
        
        // Prepare page data
        $pageData = null;
        if ($page) {
            $content = $page->content ?: '';
            
            // For contact page, ensure content is valid JSON
            if ($type === 'contact') {
                if (empty($content)) {
                    $content = json_encode([
                        'address' => '',
                        'phone1' => '',
                        'phone2' => '',
                        'email1' => '',
                        'email2' => '',
                        'hours1' => '',
                        'hours2' => '',
                        'hours3' => '',
                    ]);
                } else {
                    // Validate JSON
                    $decoded = json_decode($content, true);
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        $content = json_encode([
                            'address' => '',
                            'phone1' => '',
                            'phone2' => '',
                            'email1' => '',
                            'email2' => '',
                            'hours1' => '',
                            'hours2' => '',
                            'hours3' => '',
                        ]);
                    }
                }
            }
            
            $pageData = [
                'type' => $page->type,
                'title' => $page->title ?: $this->getDefaultTitle($type),
                'content' => $content,
                'is_active' => (bool) ($page->is_active ?? true),
            ];
        } else {
            // Default data for new pages
            $defaultContent = '';
            if ($type === 'contact') {
                $defaultContent = json_encode([
                    'address' => '',
                    'phone1' => '',
                    'phone2' => '',
                    'email1' => '',
                    'email2' => '',
                    'hours1' => '',
                    'hours2' => '',
                    'hours3' => '',
                ]);
            }
            
            $pageData = [
                'type' => $type,
                'title' => $this->getDefaultTitle($type),
                'content' => $defaultContent,
                'is_active' => true,
            ];
        }

        // Map page types to their components
        $componentMap = [
            'terms-of-service' => 'Admin/pages/components/TermsOfService',
            'privacy-policy' => 'Admin/pages/components/PrivacyPolicy',
            'refund-policy' => 'Admin/pages/components/RefundPolicy',
            'contact' => 'Admin/pages/components/Contact',
        ];

        return Inertia::render($componentMap[$type], [
            'page' => $pageData,
        ]);
    }

    /**
     * Get default title for a page type.
     */
    private function getDefaultTitle(string $type): string
    {
        $titles = [
            'terms-of-service' => 'Terms of Service',
            'privacy-policy' => 'Privacy Policy',
            'refund-policy' => 'Refund Policy',
            'contact' => 'Contact Information',
        ];

        return $titles[$type] ?? 'Page';
    }

    /**
     * Update a page.
     */
    public function update(Request $request, string $type): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        // Handle content (can be null/empty)
        $content = $validated['content'] ?? '';
        
        if ($type === 'contact') {
            // For contact page, always ensure valid JSON
            if (empty($content)) {
                // If empty, create default empty JSON structure
                $content = json_encode([
                    'address' => '',
                    'phone1' => '',
                    'phone2' => '',
                    'email1' => '',
                    'email2' => '',
                    'hours1' => '',
                    'hours2' => '',
                    'hours3' => '',
                ]);
            } else {
                // Validate and re-encode JSON, cleaning null values
                $decoded = json_decode($content, true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return back()->withErrors(['content' => 'Invalid JSON format for contact information.']);
                }
                
                // Clean null/undefined values and ensure all fields exist
                $cleaned = [
                    'address' => $decoded['address'] ?? '',
                    'phone1' => $decoded['phone1'] ?? '',
                    'phone2' => $decoded['phone2'] ?? '',
                    'email1' => $decoded['email1'] ?? '',
                    'email2' => $decoded['email2'] ?? '',
                    'hours1' => $decoded['hours1'] ?? '',
                    'hours2' => $decoded['hours2'] ?? '',
                    'hours3' => $decoded['hours3'] ?? '',
                ];
                
                // Re-encode to ensure consistent formatting
                $content = json_encode($cleaned);
            }
        } else {
            // For other pages, use empty string if not provided
            $content = $content ?: '';
        }

        $page = Page::firstOrNew(['type' => $type]);
        $page->type = $type; // Ensure type is set
        $page->title = $validated['title'];
        $page->content = $content;
        $page->is_active = $request->has('is_active') ? $request->boolean('is_active') : true;
        
        if (!$page->save()) {
            return back()->withErrors(['save' => 'Failed to save page. Please try again.']);
        }

        return redirect()->route('admin.pages.show', $type)->with('success', 'Page updated successfully.');
    }
}
