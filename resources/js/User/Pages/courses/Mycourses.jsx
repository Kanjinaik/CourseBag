import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Mycourses({ courses = [] }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Courses
                </h2>
            }
        >
            <Head title="My Courses" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {courses.length === 0 ? (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
                                <p className="text-gray-600 mb-6">Start learning by purchasing your first course!</p>
                                <Link
                                    href={route('courses.index')}
                                    className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                >
                                    Browse Courses
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => {
                                // Ensure slug exists and generate URL
                                const slug = course.slug || course.id;
                                let courseUrl;
                                try {
                                    const routeUrl = route('mycourses.show', slug);
                                    courseUrl = (routeUrl && routeUrl !== '#') ? routeUrl : `/mycourses/${slug}`;
                                } catch (e) {
                                    courseUrl = `/mycourses/${slug}`;
                                }
                                return (
                                    <div key={course.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg hover:shadow-md transition-shadow flex flex-col">
                                        <Link href={courseUrl}>
                                            <img
                                                src={course.feature_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop'}
                                                alt={course.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        </Link>
                                        <div className="p-6 flex flex-col flex-grow">
                                            {course.category && (
                                                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded mb-2 w-fit">
                                                    {course.category.name}
                                                </span>
                                            )}
                                            <Link href={courseUrl} className="hover:text-emerald-600 transition-colors">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                    {course.title}
                                                </h3>
                                            </Link>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                                                {course.short_description}
                                            </p>
                                            <div className="mt-auto">
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="text-sm text-gray-500">
                                                        Purchased: {new Date(course.pivot?.purchased_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <Link
                                                    href={courseUrl}
                                                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                                                >
                                                    View Course
                                                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

