<?php

return [

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    /* -------------------------------------------------
     | Pine Labs Payment Gateway
     | ------------------------------------------------- */
    'pinelabs' => [
        'merchant_id'   => env('PINELABS_MERCHANT_ID'),
        'client_id'     => env('PINELABS_CLIENT_ID'),
        'client_secret' => env('PINELABS_CLIENT_SECRET'),
        'base_url'      => env('PINELABS_PAYMENT_URL'),
        'verify_ssl'    => env('PINELABS_VERIFY_SSL', true),
        'ca_cert_path'  => env('PINELABS_CA_CERT_PATH', base_path('vendor/rmccue/requests/certificates/cacert.pem')),
    ],

];
