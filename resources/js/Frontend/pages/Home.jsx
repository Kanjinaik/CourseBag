import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import FrontendLayout from '../../Layouts/FrontendLayout';

export default function Home({ courses = [], featuredCourses = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [slidesPerView, setSlidesPerView] = useState(3);

    // Calculate slides per view based on screen size
    useEffect(() => {
        const updateSlidesPerView = () => {
            if (window.innerWidth < 768) {
                setSlidesPerView(1);
            } else if (window.innerWidth < 1024) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(3);
            }
        };

        updateSlidesPerView();
        window.addEventListener('resize', updateSlidesPerView);
        return () => window.removeEventListener('resize', updateSlidesPerView);
    }, []);

    const totalSlides = Math.ceil(courses.length / slidesPerView);

    // Auto-slide functionality
    useEffect(() => {
        if (!isAutoPlaying || courses.length === 0) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalSlides);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, courses.length, totalSlides]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };
    return (
        <>
            {/* Meta component in FrontendLayout handles SEO title from settings */}

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                            Best Online <span className="text-emerald-500">Learning</span> Platform
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Join millions of learners worldwide. Access high-quality courses, expert instructors, and certification programs. Start your learning journey today with CourseBag.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href={route('register')} className="bg-emerald-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition duration-300">
                                Get Started Free
                            </Link>
                            <Link href="#courses" className="border-2 border-emerald-500 text-emerald-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-500 hover:text-white transition duration-300">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Courses Slider Section */}
            {courses.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"> Courses</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Discover our most popular courses and start your learning journey today
                            </p>
                        </div>

                        <div className="relative">
                            {/* Slider Container */}
                            <div className="overflow-hidden">
                                <div 
                                    className="flex transition-transform duration-500 ease-in-out"
                                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                                >
                                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                                        <div key={slideIndex} className="min-w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
                                            {courses.slice(slideIndex * slidesPerView, slideIndex * slidesPerView + slidesPerView).map((course) => (
                                                <div
                                                    key={course.id}
                                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
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
                                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
                                                            <Link href={`/courses/${course.slug}`}>
                                                                {course.title}
                                                            </Link>
                                                        </h3>

                                                        {course.short_description && (
                                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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
                                                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-sm"
                                                            >
                                                                View Course
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Arrows */}
                            {courses.length > slidesPerView && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-emerald-50 transition-colors z-10 border border-gray-200"
                                        aria-label="Previous slide"
                                    >
                                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-emerald-50 transition-colors z-10 border border-gray-200"
                                        aria-label="Next slide"
                                    >
                                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Dots Indicator */}
                            {courses.length > slidesPerView && (
                                <div className="flex justify-center mt-8 space-x-2">
                                    {Array.from({ length: totalSlides }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToSlide(index)}
                                            className={`h-3 rounded-full transition-all duration-300 ${
                                                index === currentIndex
                                                    ? 'bg-emerald-500 w-8'
                                                    : 'bg-gray-300 w-3 hover:bg-gray-400'
                                            }`}
                                            aria-label={`Go to slide ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* View All Courses Link */}
                        <div className="text-center mt-12">
                            <Link
                                href="/courses"
                                className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-300 font-semibold"
                            >
                                View All Courses
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Courses Section */}
            {featuredCourses.length > 0 && (
                <section id="courses" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Courses</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Learn from industry experts and get certified in high-demand skills
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-emerald-500 hover:border-emerald-600"
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
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-emerald-600 transition-colors">
                                            <Link href={`/courses/${course.slug}`}>
                                                {course.title}
                                            </Link>
                                        </h3>

                                        {course.short_description && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium text-sm"
                                            >
                                                View Course
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose CourseBag?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            India's leading online learning platform trusted by over 1 million learners
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
                            <p className="text-gray-600">Learn from industry professionals with years of experience</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Learning</h3>
                            <p className="text-gray-600">Accelerate your learning with our proven teaching methods</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Certified Courses</h3>
                            <p className="text-gray-600">Earn recognized certificates upon course completion</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
                            <p className="text-gray-600">Get help whenever you need it from our support team</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-emerald-500 to-emerald-700">
                <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Start Learning Today!
                    </h2>
                    <p className="text-xl text-emerald-100 mb-8">
                        Join 1+ million learners who have transformed their careers with CourseBag
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={route('register')} className="bg-white text-emerald-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition duration-300">
                            Get Started Free
                        </Link>
                        <Link href="#courses" className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-emerald-600 transition duration-300">
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

Home.layout = (page) => <FrontendLayout>{page}</FrontendLayout>;
