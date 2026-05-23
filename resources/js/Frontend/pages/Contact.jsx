import { Head, Link, useForm, usePage } from '@inertiajs/react';
import FrontendLayout from '../../Layouts/FrontendLayout';

export default function Contact({ contactInfo = null }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    
    // Default contact information if not provided
    const defaultContactInfo = {
        address: "123 Learning Street\nEducation City, EC 12345\nIndia",
        phone1: '+91 12345 67890',
        phone2: '+91 98765 43210',
        email1: 'support@coursebag.com',
        email2: 'info@coursebag.com',
        hours1: 'Monday - Friday: 9:00 AM - 6:00 PM',
        hours2: 'Saturday: 10:00 AM - 4:00 PM',
        hours3: 'Sunday: Closed',
    };
    
    const info = contactInfo || defaultContactInfo;

    const submit = (e) => {
        e.preventDefault();

        post(route('contact.store'), {
            onSuccess: () => {
                reset();
                alert('Thank you for your message! We\'ll get back to you soon.');
            },
        });
    };

    const { websiteSettings, seoSettings } = usePage().props;
    const siteTitle = (seoSettings?.site_title && seoSettings.site_title.trim() !== '') 
        ? seoSettings.site_title 
        : (websiteSettings?.site_name || 'CourseBag');
    
    return (
        <>
            <Head title={`Contact Us | ${siteTitle}`} />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Get in <span className="text-emerald-500">Touch</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Have questions about our courses? Need help with your learning journey? We're here to help!
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Address</h3>
                                        <p className="text-gray-600 whitespace-pre-line">{info.address}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Phone</h3>
                                        {info.phone1 && <p className="text-gray-600">{info.phone1}</p>}
                                        {info.phone2 && <p className="text-gray-600">{info.phone2}</p>}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                                        {info.email1 && <p className="text-gray-600">{info.email1}</p>}
                                        {info.email2 && <p className="text-gray-600">{info.email2}</p>}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Business Hours</h3>
                                        {info.hours1 && <p className="text-gray-600">{info.hours1}</p>}
                                        {info.hours2 && <p className="text-gray-600">{info.hours2}</p>}
                                        {info.hours3 && <p className="text-gray-600">{info.hours3}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Send us a Message</h2>

                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            required
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        required
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Tell us how we can help you..."
                                        required
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-emerald-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-600">
                            Quick answers to common questions
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I enroll in a course?</h3>
                            <p className="text-gray-600">Simply browse our courses, select the one you're interested in, and click "Enroll Now". You'll be guided through a simple registration process.</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer certificates?</h3>
                            <p className="text-gray-600">Yes! Upon successful completion of any course, you'll receive a verified certificate that you can share on your resume and LinkedIn profile.</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-600">We accept all major credit cards, debit cards, UPI, net banking, and popular digital wallets for easy and secure payments.</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
                            <p className="text-gray-600">We offer a 30-day money-back guarantee. If you're not satisfied with your course, contact our support team for a full refund.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

Contact.layout = (page) => <FrontendLayout>{page}</FrontendLayout>;
