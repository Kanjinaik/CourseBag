import { Head, usePage } from '@inertiajs/react';
import FrontendLayout from '@/Layouts/FrontendLayout';

export default function PageShow({ page }) {
    // Ensure page data exists and is valid
    if (!page || typeof page !== 'object' || Array.isArray(page)) {
        return (
            <FrontendLayout>
                <Head title="Page Not Found" />
                <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                        <p className="text-xl text-gray-600">The page you are looking for does not exist or is not active.</p>
                    </div>
                </section>
            </FrontendLayout>
        );
    }

    // Safely extract string values - ensure they are always primitives
    // Convert to string explicitly to prevent rendering objects
    const pageTitle = page?.title 
        ? (typeof page.title === 'string' ? page.title : String(page.title))
        : 'Untitled Page';
    const pageContent = page?.content 
        ? (typeof page.content === 'string' ? page.content : String(page.content))
        : '';

    // Ensure title is always a string - Meta component will add "| Site Title"
    const headTitle = String(pageTitle);

    return (
        <FrontendLayout>
            <Head title={headTitle} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="md:text-6xl font-bold text-gray-900 mb-6">
                        {pageTitle}
                    </h1>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 md:p-12">
                        {pageContent && pageContent.trim() ? (
                            <div 
                                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:my-2 prose-img:rounded-lg prose-img:shadow-md"
                                dangerouslySetInnerHTML={{ __html: pageContent }}
                            />
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No content available for this page.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}

