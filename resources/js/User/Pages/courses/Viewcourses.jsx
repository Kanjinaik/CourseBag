import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Viewcourses({ course }) {
    if (!course) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <p className="text-gray-600">Course not found.</p>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {course.title}
                </h2>
            }
        >
            <Head title={course.title} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('mycourses.index')}
                            className="text-emerald-600 hover:text-emerald-800 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to My Courses
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Course Image */}
                            {course.feature_image && (
                                <div className="mb-6">
                                    <img
                                        src={course.feature_image}
                                        alt={course.title}
                                        className="w-full h-64 md:h-96 object-cover rounded-lg"
                                    />
                                </div>
                            )}

                            {/* Course Header */}
                            <div className="mb-6">
                                {course.category && (
                                    <span className="inline-block bg-emerald-100 text-emerald-800 text-sm font-semibold px-3 py-1 rounded mb-3">
                                    {course.category.name}
                                </span>
                                )}
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                    {course.title}
                                </h1>
                                <p className="text-gray-600 text-lg mb-4">
                                    {course.short_description}
                                </p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Purchased on: {new Date(course.pivot?.purchased_at).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </div>
                            </div>

                            {/* Course Details */}
                            {course.course_details && (
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Course Details</h2>
                                    <div 
                                        className="prose max-w-none text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: course.course_details }}
                                    />
                                </div>
                            )}

                            {/* Course Includes */}
                            {course.course_includes && (
                                <div className="mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">What's Included</h2>
                                    <div 
                                        className="prose max-w-none text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: course.course_includes }}
                                    />
                                </div>
                            )}

                            {/* Price Info */}
                            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600">Course Price:</span>
                                    <div className="flex items-center">
                                        {course.discount_price ? (
                                            <>
                                                <span className="text-lg font-semibold text-emerald-600 mr-2">
                                                    ₹{course.discount_price.toLocaleString()}
                                                </span>
                                                <span className="text-sm text-gray-500 line-through">
                                                    ₹{course.price.toLocaleString()}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-semibold text-emerald-600">
                                                ₹{course.price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-emerald-600 font-medium">
                                    ✓ You have access to this course
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

