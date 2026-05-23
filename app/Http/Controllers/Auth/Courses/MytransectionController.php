<?php

namespace App\Http\Controllers\Auth\Courses;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\Transaction;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MytransectionController extends Controller
{
    /**
     * Display user's transactions.
     */
    public function index(): Response
    {
        $transactions = Transaction::where('user_id', Auth::id())
            ->with('courses')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('User/Pages/courses/Mytransections', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show a specific transaction.
     */
    public function show($id)
    {
        $transaction = Transaction::where('user_id', Auth::id())
            ->with('courses.category')
            ->findOrFail($id);

        return Inertia::render('User/Pages/courses/ShowTransaction', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show invoice page (React PDF generation).
     */
    public function showInvoice($id)
    {
        $transaction = Transaction::where('user_id', Auth::id())
            ->with(['courses.category', 'user'])
            ->findOrFail($id);

        if ($transaction->status !== 'completed') {
            abort(403, 'Invoice is only available for completed transactions.');
        }

        return Inertia::render('User/Pages/courses/Invoice', [
            'transactionId' => $transaction->id,
        ]);
    }

    /**
     * Get invoice data for PDF generation (React PDF).
     */
    public function getInvoiceData($id)
    {
        $transaction = Transaction::where('user_id', Auth::id())
            ->with(['courses.category', 'user'])
            ->findOrFail($id);

        // Only allow download for completed transactions
        if ($transaction->status !== 'completed') {
            abort(403, 'Invoice is only available for completed transactions.');
        }

        $user = $transaction->user;
        
        // Get site information from WebsiteSetting
        $siteName = WebsiteSetting::getValue('site_name', config('app.name', 'CourseBag'));
        $mainLogo = WebsiteSetting::getValue('main_logo', null);
        $logoUrl = $mainLogo ? url('uploads/websitesettings/logo/' . $mainLogo) : null;
        
        // Get contact information from Page model
        $contactPage = Page::where('type', 'contact')->first();
        $contactInfo = [
            'address' => '123 Learning Street, Education City',
            'email1' => 'support@coursebag.com',
            'phone1' => '',
        ];
        
        if ($contactPage && $contactPage->content) {
            $decoded = json_decode($contactPage->content, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $contactInfo = array_merge($contactInfo, [
                    'address' => $decoded['address'] ?? $contactInfo['address'],
                    'email1' => $decoded['email1'] ?? $contactInfo['email1'],
                    'phone1' => $decoded['phone1'] ?? $contactInfo['phone1'],
                ]);
            }
        }
        
        // Use contact info for site details
        $siteEmail = $contactInfo['email1'] ?: WebsiteSetting::getValue('contact_email', 'support@coursebag.com');
        $siteAddress = $contactInfo['address'] ?: WebsiteSetting::getValue('address', '123 Learning Street, Education City');

        $courses = $transaction->courses->map(function ($course) {
            return [
                'id' => $course->id,
                'title' => $course->title,
                'category' => $course->category ? $course->category->name : 'N/A',
                'price' => (float) ($course->discount_price ?? $course->price),
            ];
        });

        return response()->json([
            'transaction' => [
                'id' => $transaction->id,
                'razorpay_order_id' => $transaction->razorpay_order_id,
                'razorpay_payment_id' => $transaction->razorpay_payment_id,
                'amount' => (float) $transaction->amount,
                'currency' => $transaction->currency,
                'status' => $transaction->status,
                'created_at' => $transaction->created_at->format('d M Y'),
                'created_at_full' => $transaction->created_at->format('d M Y, h:i A'),
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
            'courses' => $courses,
            'siteName' => $siteName,
            'siteEmail' => $siteEmail,
            'siteAddress' => $siteAddress,
            'siteLogo' => $logoUrl,
            'contactInfo' => $contactInfo,
            'invoiceNumber' => 'INV-' . str_pad($transaction->id, 6, '0', STR_PAD_LEFT),
            'invoiceDate' => $transaction->created_at->format('d M Y'),
        ]);
    }
}
