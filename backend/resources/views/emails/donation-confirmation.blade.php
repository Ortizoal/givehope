<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #4f46e5; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .body { padding: 30px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .label { color: #666; }
        .value { font-weight: bold; }
        .amount { color: #4f46e5; font-size: 28px; font-weight: bold; text-align: center; margin: 20px 0; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px; }
        .btn { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💙 Thank You for Your Donation!</h1>
        </div>
        <div class="body">
            <p>Dear {{ $donation->user->name }},</p>
            <p>Your generous donation has been received. Here are the details:</p>
            <div class="amount">${{ number_format($donation->amount, 2) }}</div>
            <div class="detail-row">
                <span class="label">Cause</span>
                <span class="value">{{ $donation->cause->title }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Date</span>
                <span class="value">{{ $donation->created_at->format('F j, Y') }}</span>
            </div>
            <div class="detail-row">
                <span class="label">Transaction ID</span>
                <span class="value">{{ $donation->stripe_payment_intent_id }}</span>
            </div>
            @if($donation->message)
            <div class="detail-row">
                <span class="label">Your Message</span>
                <span class="value">{{ $donation->message }}</span>
            </div>
            @endif
            <p style="margin-top:20px;">Your support makes a real difference. Together we can change lives.</p>
            <p>With gratitude,<br><strong>The Donation Team</strong></p>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} Donation Management System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
