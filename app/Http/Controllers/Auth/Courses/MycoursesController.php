<?php

namespace App\Http\Controllers\Auth\Courses;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MycoursesController extends Controller
{
    /**
     * Display user's purchased courses.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $courses = $user->courses()
            ->with('category')
            ->orderBy('course_user.purchased_at', 'desc')
            ->get()
            ->map(function ($course) {
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
                    'feature_image' => $course->feature_image ? Storage::url($course->feature_image) : null,
                    'pivot' => [
                        'purchased_at' => $course->pivot->purchased_at,
                    ],
                ];
            });

        return Inertia::render('User/Pages/courses/Mycourses', [
            'courses' => $courses,
        ]);
    }

    /**
     * Show a specific purchased course.
     */
    public function show($slug)
    {
        $user = Auth::user();
        
        // Try to find the course in user's purchased courses
        $course = $user->courses()
            ->where('slug', $slug)
            ->with('category')
            ->first();

        // If not found in purchased courses, return 404 with more details
        if (!$course) {
            \Log::warning('Course not found', [
                'user_id' => $user->id,
                'slug' => $slug,
                'purchased_courses' => $user->courses()->pluck('slug')->toArray()
            ]);
            abort(404, "Course with slug '{$slug}' not found in your purchased courses.");
        }

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
            'feature_image' => $course->feature_image ? Storage::url($course->feature_image) : null,
            'price' => (float) $course->price,
            'discount_price' => $course->discount_price ? (float) $course->discount_price : null,
            'pivot' => [
                'purchased_at' => $course->pivot->purchased_at,
            ],
        ];

        return Inertia::render('User/Pages/courses/Viewcourses', [
            'course' => $courseData,
        ]);
    }
}
