<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\Auth\MyProfileController;
use App\Http\Controllers\Admin\Courses\CategoryController;
use App\Http\Controllers\Admin\Courses\CourseController;
use App\Http\Controllers\Admin\Courses\OrderController;
use App\Http\Controllers\Admin\Courses\TransactionController;
use App\Http\Controllers\Admin\Pages\PageController;
use App\Http\Controllers\Admin\Settings\PaymentGatewaysController;
use App\Http\Controllers\Admin\Settings\SeoSettingsController;
use App\Http\Controllers\Admin\Settings\WebsiteSettingsController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Auth\DashboardController;
use App\Http\Controllers\Auth\Courses\CartController;
use App\Http\Controllers\Auth\Courses\PaymentController;
use App\Http\Controllers\Auth\Courses\MycoursesController;
use App\Http\Controllers\Auth\Courses\MytransectionController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Frontend\CoursesController;
use App\Http\Controllers\Frontend\PagesController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontendController::class, 'home'])->name('home');
Route::get('/courses', [CoursesController::class, 'index'])->name('courses.index');
Route::get('/courses/{course}', [CoursesController::class, 'show'])->name('courses.show');
Route::get('/about', [FrontendController::class, 'about'])->name('about');
Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Dynamic Pages Routes
Route::get('/terms-of-service', [PagesController::class, 'show'])
    ->defaults('type', 'terms-of-service')
    ->name('pages.terms');
Route::get('/privacy-policy', [PagesController::class, 'show'])
    ->defaults('type', 'privacy-policy')
    ->name('pages.privacy');
Route::get('/refund-policy', [PagesController::class, 'show'])
    ->defaults('type', 'refund-policy')
    ->name('pages.refund');

// Public Cart Routes
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [UserController::class, 'profile'])->name('profile.edit');
    Route::patch('/profile', [UserController::class, 'updateProfile'])->name('profile.update');
    Route::delete('/profile', [UserController::class, 'destroyProfile'])->name('profile.destroy');

    // Cart Routes (authenticated only)
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::delete('/cart/{id}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Payment Routes
    Route::match(['GET', 'POST'], '/payment/create-order', [PaymentController::class, 'createOrder'])->name('payment.create-order');
    Route::match(['GET', 'POST'], '/payment/success', [PaymentController::class, 'paymentSuccess'])->name('payment.success');
    Route::match(['GET', 'POST'], '/payment/failure', [PaymentController::class, 'paymentFailure'])->name('payment.failure');
    Route::match(['GET', 'POST'], '/webhooks/pinelabs', [PaymentController::class, 'pinelabsWebhook'])
        ->name('pinelabs.webhook');

    // My Courses Routes
    Route::get('/mycourses', [MycoursesController::class, 'index'])->name('mycourses.index');
    Route::get('/mycourses/{slug}', [MycoursesController::class, 'show'])->name('mycourses.show');

    // My Transactions Routes
    Route::get('/mytransections', [MytransectionController::class, 'index'])->name('mytransections.index');
    Route::get('/mytransections/{id}', [MytransectionController::class, 'show'])->name('mytransections.show');
    Route::get('/mytransections/{id}/invoice-data', [MytransectionController::class, 'getInvoiceData'])->name('mytransections.invoice-data');
    Route::get('/mytransections/{id}/invoice', [MytransectionController::class, 'showInvoice'])->name('mytransections.invoice');
});

// Admin Routes
Route::prefix('admin')->name('admin.')->group(function () {
    // Admin Auth Routes (only accessible when not authenticated as admin)
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AdminAuthController::class, 'create'])->name('login');
        Route::post('/login', [AdminAuthController::class, 'store']);
    });

    // Admin Protected Routes (require admin authentication)
    Route::middleware('auth:admin')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'destroy'])->name('logout');
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        
        // Admin Users Routes
        Route::get('/users', [UsersController::class, 'index'])->name('users.index');
        Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
        
        // Admin Categories Routes
        Route::resource('categories', CategoryController::class)->except(['show']);
        
        // Admin Courses Routes
        Route::resource('courses', CourseController::class)->except(['show']);
        
        // Admin Orders Routes
        Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
        
        // Admin Transactions Routes
        Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
        
        // Admin Pages Routes
        Route::get('/pages', [PageController::class, 'index'])->name('pages.index');
        Route::get('/pages/{type}', [PageController::class, 'show'])->name('pages.show');
        Route::put('/pages/{type}', [PageController::class, 'update'])->name('pages.update');
        
        // Admin Settings Routes
        Route::get('/settings/website', [WebsiteSettingsController::class, 'index'])->name('settings.website.index');
        Route::get('/settings/website/{type}', [WebsiteSettingsController::class, 'show'])->name('settings.website.show');
        Route::post('/settings/website/{type}', [WebsiteSettingsController::class, 'store'])->name('settings.website.store');
        Route::put('/settings/website/{type}', [WebsiteSettingsController::class, 'update'])->name('settings.website.update');
        
        // Admin SEO Settings Routes
        Route::get('/settings/seo', [SeoSettingsController::class, 'index'])->name('settings.seo.index');
        Route::get('/settings/seo/{type}', [SeoSettingsController::class, 'show'])->name('settings.seo.show');
        Route::post('/settings/seo/{type}', [SeoSettingsController::class, 'store'])->name('settings.seo.store');
        Route::put('/settings/seo/{type}', [SeoSettingsController::class, 'update'])->name('settings.seo.update');
        
        // Admin Payment Gateways Routes
        Route::get('/settings/payments', [PaymentGatewaysController::class, 'index'])->name('settings.payments.index');
        Route::get('/settings/payments/{gateway}', [PaymentGatewaysController::class, 'show'])->name('settings.payments.show');
        Route::put('/settings/payments/{gateway}', [PaymentGatewaysController::class, 'update'])->name('settings.payments.update');
        Route::post('/settings/payments/{gateway}/toggle-status', [PaymentGatewaysController::class, 'toggleStatus'])->name('settings.payments.toggle-status');
        
        // Admin Profile Routes
        Route::get('/myaccount', [MyProfileController::class, 'edit'])->name('myaccount.edit');
        Route::patch('/myaccount', [MyProfileController::class, 'update'])->name('myaccount.update');
        Route::put('/myaccount/password', [MyProfileController::class, 'updatePassword'])->name('myaccount.password.update');
    });
});

require __DIR__.'/auth.php';
