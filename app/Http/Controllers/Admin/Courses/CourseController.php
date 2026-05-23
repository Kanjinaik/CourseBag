<?php

namespace App\Http\Controllers\Admin\Courses;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    /**
     * Display a listing of courses.
     */
    public function index(): Response
    {
        $courses = Course::with('category')
            ->orderBy('created_at', 'desc')
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
                    ] : null,
                    'price' => $course->price,
                    'discount_price' => $course->discount_price,
                    'feature_image' => $course->feature_image,
                    'is_active' => $course->is_active,
                    'created_at' => $course->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Admin/Courses/Course/Index', [
            'courses' => $courses,
            'totalCourses' => Course::count(),
        ]);
    }

    /**
     * Show the form for creating a new course.
     */
    public function create(): Response
    {
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Courses/Course/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created course.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'course_details' => 'nullable|string',
            'course_includes' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'feature_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
        ]);

        $imagePath = null;
        if ($request->hasFile('feature_image')) {
            $imagePath = $request->file('feature_image')->store('courses', 'public');
        }

        Course::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'short_description' => $validated['short_description'],
            'course_details' => $validated['course_details'] ?? null,
            'course_includes' => $validated['course_includes'] ?? null,
            'category_id' => $validated['category_id'],
            'feature_image' => $imagePath,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'is_active' => $request->boolean('is_active', true),
            'is_featured' => $request->boolean('is_featured', false),
        ]);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course created successfully.');
    }

    /**
     * Show the form for editing the specified course.
     */
    public function edit($id): Response
    {
        $course = Course::findOrFail($id);
        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Courses/Course/Edit', [
            'course' => [
                'id' => $course->id,
                'title' => $course->title,
                'slug' => $course->slug,
                'short_description' => $course->short_description,
                'course_details' => $course->course_details,
                'course_includes' => $course->course_includes,
                'category_id' => $course->category_id,
                'feature_image' => $course->feature_image,
                'price' => $course->price,
                'discount_price' => $course->discount_price,
                'is_active' => $course->is_active,
            'is_featured' => $course->is_featured ?? false,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified course.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $course = Course::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'short_description' => 'required|string',
            'course_details' => 'nullable|string',
            'course_includes' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'feature_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0|lt:price',
        ]);

        $imagePath = $course->feature_image;
        if ($request->hasFile('feature_image')) {
            // Delete old image if exists
            if ($course->feature_image) {
                \Storage::disk('public')->delete($course->feature_image);
            }
            $imagePath = $request->file('feature_image')->store('courses', 'public');
        }

        $course->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']),
            'short_description' => $validated['short_description'],
            'course_details' => $validated['course_details'] ?? null,
            'course_includes' => $validated['course_includes'] ?? null,
            'category_id' => $validated['category_id'],
            'feature_image' => $imagePath,
            'price' => $validated['price'],
            'discount_price' => $validated['discount_price'] ?? null,
            'is_active' => $request->boolean('is_active', true),
            'is_featured' => $request->boolean('is_featured', false),
        ]);

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    /**
     * Remove the specified course.
     */
    public function destroy($id): RedirectResponse
    {
        $course = Course::findOrFail($id);
        
        // Delete feature image if exists
        if ($course->feature_image) {
            \Storage::disk('public')->delete($course->feature_image);
        }

        $course->delete();

        return redirect()
            ->route('admin.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
