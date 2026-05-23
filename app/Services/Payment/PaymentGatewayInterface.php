<?php

namespace App\Services\Payment;

use Illuminate\Http\Request;

interface PaymentGatewayInterface
{
    /**
     * Create an order with the payment gateway.
     *
     * @param array $data
     * @return array
     */
    public function createOrder(array $data);

    /**
     * Verify payment signature/status.
     *
     * @param Request $request
     * @return array
     */
    public function verifyPayment(Request $request);
}
