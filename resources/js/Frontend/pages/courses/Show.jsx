import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FrontendLayout from '../../../Layouts/FrontendLayout';

export default function CourseShow({ course, whatYouWillLearn = [], courseIncludes = [], isPurchased = false }) {
    const [isEnrolled, setIsEnrolled] = useState(isPurchased);
    const [addingToCart, setAddingToCart] = useState(false);
    const page = usePage();
    const { websiteSettings, seoSettings, auth } = page.props;
    const isAuthenticated = !!auth?.user;
    const siteTitle = (seoSettings?.site_title && seoSettings.site_title.trim() !== '') 
        ? seoSettings.site_title 
        : (websiteSettings?.site_name || 'CourseBag');

    if (!course) {
        return (
            <FrontendLayout>
                <Head title="Course Not Found" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
                    <p className="text-gray-600 mb-6">The course you're looking for doesn't exist or is no longer available.</p>
                    <Link href="/courses" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg transition-colors">
                        Browse All Courses
                    </Link>
                </div>
            </FrontendLayout>
        );
    }


    // Use course from props
    const currentPrice = course.discount_price || course.price;
    const originalPrice = course.discount_price ? course.price : null;
    const discountPercent = originalPrice ? Math.round((1 - currentPrice / originalPrice) * 100) : 0;

    const renderStars = (rating, size = 'w-4 h-4') => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <svg key={i} className={`${size} text-yellow-400 fill-current`} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            );
        }

        if (hasHalfStar) {
            stars.push(
                <svg key="half" className={`${size} text-yellow-400 fill-current`} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#halfStar)"/>
                    <defs>
                        <linearGradient id="halfStar" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="50%" style={{stopColor: 'currentColor'}} />
                            <stop offset="50%" style={{stopColor: 'transparent'}} />
                        </linearGradient>
                    </defs>
                </svg>
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <svg key={`empty-${i}`} className={`${size} text-gray-300 fill-current`} viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            );
        }

        return stars;
    };

    // Prepare SEO meta tags for course detail page
    const courseMetaDescription = course.short_description || `Learn ${course.title} - ${siteTitle}`;
    const courseMetaKeywords = course.category ? `${course.title}, ${course.category.name}, online course, ${siteTitle}` : `${course.title}, online course, ${siteTitle}`;
    const courseImage = course.feature_image || null;
    const courseCanonical = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <FrontendLayout>
            <Head>
                <title>{`${course.title} | ${siteTitle}`}</title>
                <meta name="description" content={courseMetaDescription} />
                <meta name="keywords" content={courseMetaKeywords} />
                
                {/* Open Graph / Facebook */}
                <meta property="og:type" content="course" />
                <meta property="og:url" content={courseCanonical} />
                <meta property="og:title" content={`${course.title} | ${siteTitle}`} />
                <meta property="og:description" content={courseMetaDescription} />
                {courseImage && <meta property="og:image" content={courseImage} />}
                <meta property="og:site_name" content={siteTitle} />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${course.title} | ${siteTitle}`} />
                <meta name="twitter:description" content={courseMetaDescription} />
                {courseImage && <meta name="twitter:image" content={courseImage} />}
            </Head>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Course Info */}
                        <div className="space-y-6">
                            {course.category && (
                                <div className="flex items-center space-x-2">
                                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {course.category.name}
                                    </span>
                                </div>
                            )}

                            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                                {course.title}
                            </h1>

                            {course.short_description && (
                                <p className="text-xl text-gray-300">
                                    {course.short_description}
                                </p>
                            )}

                            {/* Price */}
                            <div className="flex items-center space-x-4">
                                <span className="text-3xl font-bold text-emerald-400">
                                    ₹{currentPrice}
                                </span>
                                {originalPrice && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            ₹{originalPrice}
                                        </span>
                                        <span className="text-emerald-400 font-medium">
                                            {discountPercent}% off
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Course Image & CTA */}
                        <div className="lg:pl-8">
                            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                                <img
                                    src={course.feature_image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop'}
                                    alt={course.title}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ₹{currentPrice}
                                        </span>
                                        {originalPrice && (
                                            <span className="text-gray-500 line-through">
                                                ₹{originalPrice}
                                            </span>
                                        )}
                                    </div>

                                    {isAuthenticated ? (
                                        isEnrolled ? (
                                            <Link
                                                href={route('mycourses.show', course.slug)}
                                                className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 bg-green-500 hover:bg-green-600 text-white text-center block"
                                            >
                                                Continue Learning
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (addingToCart) return;
                                                    
                                                    setAddingToCart(true);
                                                    
                                                    router.post('/cart', {
                                                        course_id: course.id
                                                    }, {
                                                        preserveScroll: true,
                                                        onSuccess: () => {
                                                            setAddingToCart(false);
                                                            // Reload to update cart count in header
                                                            window.location.reload();
                                                        },
                                                        onError: (errors) => {
                                                            setAddingToCart(false);
                                                            const errorMessage = errors?.course_id?.[0] || errors?.message || 'Failed to add to cart. Please try again.';
                                                            alert(errorMessage);
                                                        },
                                                        onFinish: () => {
                                                            setAddingToCart(false);
                                                        }
                                                    });
                                                }}
                                                disabled={addingToCart}
                                                type="button"
                                                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                                                    addingToCart
                                                        ? 'bg-gray-400 cursor-not-allowed text-white'
                                                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                                }`}
                                            >
                                                {addingToCart ? 'Adding...' : 'Add to Cart'}
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                // Redirect to login with return URL
                                                window.location.href = route('login') + '?redirect=' + encodeURIComponent(window.location.pathname);
                                            }}
                                            type="button"
                                            className="w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 bg-emerald-500 hover:bg-emerald-600 text-white"
                                        >
                                            Login to Add to Cart
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="space-y-8">
                            {/* What You'll Learn */}
                            {whatYouWillLearn.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {whatYouWillLearn.map((item, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {course.course_details && (
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>
                                    <div className="prose max-w-none text-gray-700">
                                        {course.course_details.split('\n\n').map((paragraph, index) => (
                                            <p key={index} className="mb-4 leading-relaxed">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Course Includes */}
                        {courseIncludes.length > 0 && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">This course includes:</h3>
                                <ul className="space-y-3">
                                    {courseIncludes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Share Course */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Share this course</h3>
                            <div className="flex space-x-3">
                                {[
                                    { name: 'Facebook', color: 'bg-blue-600 hover:bg-blue-700' },
                                    { name: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
                                    { name: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' },
                                    { name: 'Copy Link', color: 'bg-gray-600 hover:bg-gray-700' }
                                ].map(social => (
                                    <button
                                        key={social.name}
                                        className={`${social.color} text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium`}
                                    >
                                        {social.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
