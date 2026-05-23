<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CoursesController extends Controller
{
    /**
     * Display a listing of active courses.
     */
    public function index(\Illuminate\Http\Request $request): Response
    {
        // Get all active courses (no pagination since frontend handles filtering)
        $allCourses = Course::with('category')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        $courses = $allCourses->map(function ($course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'short_description' => $course->short_description,
                'category' => $course->category ? [
                    'id' => $course->category->id,
                    'name' => $course->category->name,
                    'slug' => $course->category->slug,
                ] : null,
                'price' => (float) $course->price,
                'discount_price' => $course->discount_price ? (float) $course->discount_price : null,
                'feature_image' => $course->feature_image ? Storage::url($course->feature_image) : null,
                'created_at' => $course->created_at->format('Y-m-d'),
            ];
        });

        // Get categories with count of active courses only
        $categories = Category::withCount(['courses' => function ($query) {
                $query->where('is_active', true);
            }])
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'courses_count' => $category->courses_count,
                ];
            });

        return Inertia::render('Frontend/pages/courses/Index', [
            'courses' => $courses,
            'categories' => $categories,
            'pagination' => [
                'total' => $allCourses->count(),
            ],
        ]);
    }

    /**
     * Display the specified course.
     */
    public function show(Course $course): Response
    {
        // Ensure course is active
        if (!$course->is_active) {
            abort(404);
        }

        $course->load('category');

        $courseData = [
            'id' => $course->id,
            'title' => $course->title,
            'slug' => $course->slug,
            'short_description' => $course->short_description,
            'course_details' => $course->course_details,
            'course_includes' => $course->course_includes,
            'category' => $course->category ? [
                'id' => $course->category->id,
                'name' => $course->category->name,
                'slug' => $course->category->slug,
            ] : null,
            'price' => (float) $course->price,
            'discount_price' => $course->discount_price ? (float) $course->discount_price : null,
            'feature_image' => $course->feature_image ? Storage::url($course->feature_image) : null,
            'created_at' => $course->created_at->format('Y-m-d'),
        ];

        // Parse course_includes if it's a string (newline-separated)
        $courseIncludes = [];
        if ($course->course_includes) {
            $courseIncludes = is_array($course->course_includes) 
                ? $course->course_includes 
                : array_filter(explode("\n", $course->course_includes));
        }

        // Parse what you'll learn from course_details or create from short_description
        $whatYouWillLearn = [];
        if ($course->course_details) {
            // Try to extract bullet points or create from description
            $lines = explode("\n", $course->course_details);
            foreach ($lines as $line) {
                $line = trim($line);
                if (!empty($line) && (str_starts_with($line, '-') || str_starts_with($line, '•') || str_starts_with($line, '*'))) {
                    $whatYouWillLearn[] = trim($line, '- •* ');
                }
            }
        }
        
        // If no bullet points found, create from short_description
        if (empty($whatYouWillLearn) && $course->short_description) {
            $whatYouWillLearn = [
                'Learn ' . $course->short_description,
                'Master the fundamentals',
                'Build real-world projects',
            ];
        }

        // Check if user has purchased this course
        $isPurchased = false;
        if (auth()->check()) {
            $isPurchased = $course->isPurchasedBy(auth()->id());
        }

        return Inertia::render('Frontend/pages/courses/Show', [
            'course' => $courseData,
            'whatYouWillLearn' => $whatYouWillLearn,
            'courseIncludes' => $courseIncludes,
            'isPurchased' => $isPurchased,
        ]);
    }
}
