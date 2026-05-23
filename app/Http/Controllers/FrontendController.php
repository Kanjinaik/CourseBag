<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FrontendController extends Controller
{
    public function home()
    {
        // Fetch all active courses for slider
        $courses = Course::with('category')
            ->where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->limit(10)
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
                    'price' => (float) $course->price,
                    'discount_price' => $course->discount_price ? (float) $course->discount_price : null,
                    'feature_image' => $course->feature_image ? Storage::url($course->feature_image) : null,
                ];
            });

        // Fetch featured courses for featured section
        $featuredCourses = Course::with('category')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->orderBy('created_at', 'desc')
            ->limit(6)
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
                    'price' => (float) $course->price,
                    'discount_price' => $course->discount_price ? (float) $course->discount_price : null,
                    'feature_image' => $course->feature_image ? Storage::url($course->feature_image) : null,
                ];
            });

        return Inertia::render('Frontend/pages/Home', [
            'courses' => $courses,
            'featuredCourses' => $featuredCourses,
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function courses()
    {
        return Inertia::render('Frontend/pages/courses/Index', [
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function courseShow($courseId)
    {
        // In a real application, you would fetch the course from the database
        // For now, we'll pass the course ID and let the frontend handle the rest
        return Inertia::render('Frontend/pages/courses/Show', [
            'courseId' => $courseId,
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function about()
    {
        return Inertia::render('Frontend/pages/About', [
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }
}
