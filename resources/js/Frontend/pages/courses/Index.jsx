import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '../../../Layouts/FrontendLayout';

export default function CoursesIndex({ courses = [], categories = [], pagination = null }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Filter courses based on search term only (for category counts)
    const coursesMatchingSearch = courses.filter(course => {
        return course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (course.short_description && course.short_description.toLowerCase().includes(searchTerm.toLowerCase()));
    });

    // Calculate category counts based on filtered courses (by search term)
    const getCategoryCount = (categoryId) => {
        if (categoryId === 'all') {
            return coursesMatchingSearch.length;
        }
        return coursesMatchingSearch.filter(course => 
            course.category && (
                course.category.id.toString() === categoryId.toString() ||
                course.category.slug === categoryId.toString()
            )
        ).length;
    };

    // Prepare categories with "All" option and dynamic counts
    const allCategories = [
        { id: 'all', name: 'All Categories', slug: 'all', courses_count: getCategoryCount('all') },
        ...categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            courses_count: getCategoryCount(cat.id),
        }))
    ];

    // Filter courses based on search and category
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (course.short_description && course.short_description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' ||
                              (course.category && (
                                  course.category.id.toString() === selectedCategory ||
                                  course.category.slug === selectedCategory
                              ));

        return matchesSearch && matchesCategory;
    });

    const { websiteSettings, seoSettings } = usePage().props;
    const siteTitle = (seoSettings?.site_title && seoSettings.site_title.trim() !== '') 
        ? seoSettings.site_title 
        : (websiteSettings?.site_name || 'CourseBag');

    return (
        <FrontendLayout>
            <Head title={`All Courses | ${siteTitle}`} />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Explore All Courses
                        </h1>
                        <p className="text-xl md:text-2xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                            Discover thousands of courses taught by expert instructors. Start learning today and transform your career.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for courses, instructors, or topics..."
                                    className="w-full px-6 py-4 text-gray-900 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-emerald-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="absolute right-4 top-4 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Filters */}
                {allCategories.length > 0 && (
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-4 justify-center">
                            {allCategories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id === 'all' ? 'all' : category.id.toString())}
                                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                        selectedCategory === (category.id === 'all' ? 'all' : category.id.toString())
                                            ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700'
                                    }`}
                                >
                                    {category.name} ({category.courses_count || 0})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-8 text-center">
                    <p className="text-gray-600">
                        Showing {filteredCourses.length} of {pagination?.total || courses.length} {pagination?.total === 1 || courses.length === 1 ? 'course' : 'courses'}
                    </p>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredCourses.map(course => (
                        <div
                            key={course.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                        >
                            {/* Course Image */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={course.feature_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'}
                                    alt={course.title}
                                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                                />
                                {course.category && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {course.category.name}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Course Content */}
                            <div className="p-6">
                                {/* Title */}
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
                                    <Link href={`/courses/${course.slug}`}>
                                        {course.title}
                                    </Link>
                                </h3>

                                {/* Short Description */}
                                {course.short_description && (
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {course.short_description}
                                    </p>
                                )}

                                {/* Price */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex items-center">
                                        {course.discount_price ? (
                                            <>
                                                <span className="text-2xl font-bold text-emerald-600">
                                                    ₹{course.discount_price}
                                                </span>
                                                <span className="text-gray-500 line-through ml-2">
                                                    ₹{course.price}
                                                </span>
                                            </>
                                        ) : (
                                            <span className="text-2xl font-bold text-emerald-600">
                                                ₹{course.price}
                                            </span>
                                        )}
                                    </div>
                                    <Link
                                        href={`/courses/${course.slug}`}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
                                    >
                                        View Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {filteredCourses.length === 0 && (
                    <div className="text-center py-16">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search terms or browse different categories.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </FrontendLayout>
    );
}
