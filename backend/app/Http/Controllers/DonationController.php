<?php

namespace App\Http\Controllers;

use App\Mail\DonationConfirmation;
use App\Models\Cause;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class DonationController extends Controller
{
    private function paystackSecret(): string
    {
        return config('services.paystack.secret_key');
    }

    public function createCheckout(Request $request)
    {
        $data = $request->validate([
            'cause_id' => 'required|exists:causes,id',
            'amount'   => 'required|numeric|min:1|max:100000',
            'message'  => 'nullable|string|max:500',
        ]);

        $cause = Cause::findOrFail($data['cause_id']);

        if ($cause->status !== 'active') {
            return response()->json(['message' => 'This cause is not accepting donations'], 422);
        }

        $user      = $request->user();
        $reference = 'DON-' . strtoupper(uniqid());

        $donation = Donation::create([
            'user_id'             => $user->id,
            'cause_id'            => $cause->id,
            'amount'              => $data['amount'],
            'currency'            => 'NGN',
            'status'              => 'pending',
            'message'             => $data['message'] ?? null,
            'paystack_reference'  => $reference,
        ]);

        $response = Http::withToken($this->paystackSecret())
            ->post('https://api.paystack.co/transaction/initialize', [
                'email'        => $user->email,
                'amount'       => (int) ($data['amount'] * 100), // kobo/lowest denomination
                'reference'    => $reference,
                'callback_url' => config('app.frontend_url', 'http://localhost:5173') . '/donate/success',
                'metadata'     => [
                    'donation_id' => $donation->id,
                    'cause_id'    => $cause->id,
                    'cancel_action' => config('app.frontend_url', 'http://localhost:5173') . '/causes/' . $cause->slug,
                ],
            ]);

        if (! $response->successful()) {
            $donation->delete();
            Log::error('Paystack init failed', ['body' => $response->body()]);
            return response()->json(['message' => 'Failed to initialize payment. Check Paystack API keys.'], 500);
        }

        return response()->json(['checkout_url' => $response->json('data.authorization_url')]);
    }

    public function verifyPayment(Request $request, string $reference)
    {
        $donation = Donation::with(['cause'])
            ->where('paystack_reference', $reference)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($donation->status === 'completed') {
            return response()->json(['status' => 'success', 'donation' => $donation]);
        }

        $response = Http::withToken($this->paystackSecret())
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        if ($response->successful() && $response->json('data.status') === 'success') {
            $donation->update(['status' => 'completed']);
            $donation->cause->increment('raised_amount', $donation->amount);

            try {
                Mail::to($donation->user->email)->send(new DonationConfirmation($donation));
            } catch (\Exception $e) {
                Log::error('Failed to send donation email: ' . $e->getMessage());
            }

            return response()->json(['status' => 'success', 'donation' => $donation->fresh('cause')]);
        }

        return response()->json(['status' => 'pending']);
    }

    public function history(Request $request)
    {
        $donations = Donation::with('cause')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($donations);
    }

    public function handleWebhook(Request $request)
    {
        $payload   = $request->getContent();
        $signature = $request->header('x-paystack-signature');
        $secret    = $this->paystackSecret();

        if (hash_hmac('sha512', $payload, $secret) !== $signature) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $event = json_decode($payload, true);

        if (($event['event'] ?? '') === 'charge.success') {
            $reference = $event['data']['reference'] ?? null;
            $donation  = Donation::with(['user', 'cause'])
                ->where('paystack_reference', $reference)
                ->first();

            if ($donation && $donation->status === 'pending') {
                $donation->update(['status' => 'completed']);
                $donation->cause->increment('raised_amount', $donation->amount);

                try {
                    Mail::to($donation->user->email)->send(new DonationConfirmation($donation));
                } catch (\Exception $e) {
                    Log::error('Failed to send donation email: ' . $e->getMessage());
                }
            }
        }

        return response()->json(['status' => 'ok']);
    }

    public function adminIndex()
    {
        $donations = Donation::with(['user', 'cause'])->latest()->paginate(20);
        return response()->json($donations);
    }
}
