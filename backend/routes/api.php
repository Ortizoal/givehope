<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CauseController;
use App\Http\Controllers\DonationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/auth/register', RegisterController::class);
Route::post('/auth/login', LoginController::class);
Route::get('/causes', [CauseController::class, 'index']);
Route::get('/causes/{slug}', [CauseController::class, 'show']);

// Paystack webhook (must be before auth middleware)
Route::post('/paystack/webhook', [DonationController::class, 'handleWebhook']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', LogoutController::class);
    Route::get('/user', fn(Request $request) => response()->json($request->user()));

    // Donations
    Route::post('/donations/checkout', [DonationController::class, 'createCheckout']);
    Route::get('/donations/verify/{reference}', [DonationController::class, 'verifyPayment']);
    Route::get('/donations/history', [DonationController::class, 'history']);

    // Admin routes
    Route::middleware(\App\Http\Middleware\AdminMiddleware::class)->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        Route::get('/causes', [CauseController::class, 'adminIndex']);
        Route::post('/causes', [CauseController::class, 'store']);
        Route::put('/causes/{cause}', [CauseController::class, 'update']);
        Route::delete('/causes/{cause}', [CauseController::class, 'destroy']);

        Route::get('/donations', [DonationController::class, 'adminIndex']);

        Route::get('/users', [AdminController::class, 'listUsers']);
        Route::patch('/users/{user}/toggle', [AdminController::class, 'toggleUser']);
    });
});
