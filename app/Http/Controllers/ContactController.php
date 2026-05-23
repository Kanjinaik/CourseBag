<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        // Fetch contact page data from database
        $contactPage = \App\Models\Page::where('type', 'contact')
            ->where('is_active', true)
            ->first();
        
        $contactInfo = null;
        if ($contactPage && $contactPage->content) {
            try {
                $contactInfo = json_decode($contactPage->content, true);
            } catch (\Exception $e) {
                // If JSON parsing fails, use defaults
                $contactInfo = null;
            }
        }
        
        // Default contact information if not found in database
        if (!$contactInfo) {
            $contactInfo = [
                'address' => "123 Learning Street\nEducation City, EC 12345\nIndia",
                'phone1' => '+91 12345 67890',
                'phone2' => '+91 98765 43210',
                'email1' => 'support@coursebag.com',
                'email2' => 'info@coursebag.com',
                'hours1' => 'Monday - Friday: 9:00 AM - 6:00 PM',
                'hours2' => 'Saturday: 10:00 AM - 4:00 PM',
                'hours3' => 'Sunday: Closed',
            ];
        }
        
        return Inertia::render('Frontend/pages/Contact', [
            'contactInfo' => $contactInfo,
            'canLogin' => \Route::has('login'),
            'canRegister' => \Route::has('register'),
            'laravelVersion' => \Illuminate\Foundation\Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:1000',
        ]);

        // Here you can implement email sending logic
        // For example, sending to support@coursebag.com

        // Mail::to('support@coursebag.com')->send(new ContactFormMail($request->all()));

        return back()->with('success', 'Thank you for your message! We\'ll get back to you soon.');
    }
}
