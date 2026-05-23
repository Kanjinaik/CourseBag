import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import Toast from '@/Admin/components/Toast';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        short_description: '',
        course_details: '',
        course_includes: '',
        category_id: '',
        feature_image: null,
        price: '',
        discount_price: '',
        is_active: true,
        is_featured: false,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('feature_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post('/admin/courses', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Create Course">
            <Head title="Create Course" />
            <link rel="stylesheet" href="/adminassets/css/admin.css" />

            <Toast />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>
                        <p className="text-sm text-gray-600 mt-1">Add a new course</p>
                    </div>
                    <Link
                        href="/admin/courses"
                        className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← Back to Courses
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={submit}>
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Card 1: Main Course Information */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Course Information</h2>
                            <div className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.title ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter course title"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Short Description */}
                                <div>
                                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Short Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="short_description"
                                        value={data.short_description}
                                        onChange={(e) => setData('short_description', e.target.value)}
                                        rows={3}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.short_description ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Brief description of the course"
                                    />
                                    {errors.short_description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.short_description}</p>
                                    )}
                                </div>

                                {/* Course Details */}
                                <div>
                                    <label htmlFor="course_details" className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Details
                                    </label>
                                    <textarea
                                        id="course_details"
                                        value={data.course_details}
                                        onChange={(e) => setData('course_details', e.target.value)}
                                        rows={6}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.course_details ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Detailed course information"
                                    />
                                    {errors.course_details && (
                                        <p className="mt-1 text-sm text-red-600">{errors.course_details}</p>
                                    )}
                                </div>

                                {/* Course Includes */}
                                <div>
                                    <label htmlFor="course_includes" className="block text-sm font-medium text-gray-700 mb-2">
                                        This course includes:
                                    </label>
                                    <textarea
                                        id="course_includes"
                                        value={data.course_includes}
                                        onChange={(e) => setData('course_includes', e.target.value)}
                                        rows={4}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.course_includes ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="List what's included in this course (one per line)"
                                    />
                                    {errors.course_includes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.course_includes}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Category, Prices & Status */}
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
                            <div className="space-y-6">
                                {/* Feature Image */}
                                <div>
                                    <label htmlFor="feature_image" className="block text-sm font-medium text-gray-700 mb-2">
                                        Feature Image
                                    </label>
                                    <input
                                        type="file"
                                        id="feature_image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.feature_image ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.feature_image && (
                                        <p className="mt-1 text-sm text-red-600">{errors.feature_image}</p>
                                    )}
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category_id"
                                        value={data.category_id}
                                        onChange={(e) => setData('category_id', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.category_id ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.price ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                    />
                                    {errors.price && (
                                        <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                                    )}
                                </div>

                                {/* Discount Price */}
                                <div>
                                    <label htmlFor="discount_price" className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount Price
                                    </label>
                                    <input
                                        type="number"
                                        id="discount_price"
                                        step="0.01"
                                        min="0"
                                        value={data.discount_price}
                                        onChange={(e) => setData('discount_price', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                                            errors.discount_price ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="0.00"
                                    />
                                    {errors.discount_price && (
                                        <p className="mt-1 text-sm text-red-600">{errors.discount_price}</p>
                                    )}
                                </div>

                                {/* Active Status */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                        />
                                        <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
                                            Active Status
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 ml-6">
                                        Course will be visible to users when active
                                    </p>
                                </div>

                                {/* Featured Status */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={data.is_featured}
                                            onChange={(e) => setData('is_featured', e.target.checked)}
                                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                        />
                                        <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-700">
                                            Featured
                                        </label>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 ml-6">
                                        Featured courses will appear on the home page
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center justify-end space-x-3">
                        <Link
                            href="/admin/courses"
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

