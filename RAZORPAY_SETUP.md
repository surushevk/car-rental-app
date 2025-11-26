# Razorpay Setup Guide

## ✅ Complete Migration from Stripe to Razorpay

Your app now uses **Razorpay** instead of Stripe for better Indian market support!

## 🚀 How to Set Up Razorpay

### Step 1: Create Razorpay Account (FREE)

1. Go to [https://razorpay.com/](https://razorpay.com/)
2. Click **"Sign Up"** (top-right)
3. Fill in your details:
   - Business Name
   - Email
   - Phone Number
4. Verify your email and phone

### Step 2: Get API Keys

1. After login, you'll land on the **Dashboard**
2. Look for **"Test Mode"** toggle (top-left) - make sure it's **ON**
3. On the left sidebar, click **"Settings"** (gear icon)
4. Click **"API Keys"** under "Website and app settings"
5. Click **"Generate Test Key"** if you don't see keys already
6. You'll see two keys:
   - **Key ID** (starts with `rzp_test_...`)
   - **Key Secret** (click "Show" to reveal it)

### Step 3: Update Your `.env` Files

#### Backend `.env` file:
Open: `e:\Car Booking App\server\.env`

Add/Update these lines:
```env
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
```

**Replace with your actual Razorpay keys!**

#### Frontend `.env` file:
Open: `e:\Car Booking App\client\.env`

Should only have:
```env
VITE_API_URL=http://localhost:5000/api
```

(No Razorpay key needed in frontend!)

### Step 4: Install New Dependencies

Open terminal in **server** folder:
```bash
cd "e:\Car Booking App\server"
npm install
```

Open terminal in **client** folder:
```bash
cd "e:\Car Booking App\client"
npm install
```

### Step 5: Start the App

**Terminal 1 (Backend):**
```bash
cd "e:\Car Booking App\server"
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd "e:\Car Booking App\client"
npm run dev
```

## 💳 Testing Payments

### UPI Payment (Test Mode)
1. Select "UPI Payment" during booking
2. Click "Pay Now"
3. Razorpay will show UPI options
4. In test mode, use these test UPI IDs:
   - Success: `success@razorpay`
   - Failure: `failure@razorpay`

### Card Payment (Test Mode)
1. Select "Card Payment" during booking
2. Click "Pay Now"
3. Use these test card details:
   - **Card Number**: `4111 1111 1111 1111`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVV**: Any 3 digits (e.g., `123`)
   - **Name**: Any name

### Cash Payment
1. Select "Cash Payment"
2. Booking confirmed immediately
3. Pay driver after ride
4. Admin marks as completed

## 🎯 What Changed?

### Backend Changes:
- ✅ Replaced Stripe SDK with Razorpay SDK
- ✅ Updated payment controller for Razorpay order creation
- ✅ Added signature verification for security
- ✅ Updated models (razorpayPaymentId, razorpayOrderId)

### Frontend Changes:
- ✅ Removed Stripe React components
- ✅ Added Razorpay checkout integration
- ✅ Updated payment page with Razorpay UI
- ✅ Better UPI experience for Indian users

## 💰 Razorpay Pricing

**Test Mode:** 100% FREE
- Unlimited test transactions
- No credit card required
- Full feature access

**Live Mode (Production):**
- 2% transaction fee (standard rate)
- Only charged when you go live

## 🔒 Security

- Razorpay handles all payment data securely
- PCI DSS compliant
- Signature verification prevents tampering
- Test mode keys are safe to use for development

## ✨ Benefits of Razorpay

✅ **Better for India**: Native Indian payment gateway
✅ **UPI Integration**: Seamless Google Pay, PhonePe, Paytm support
✅ **Lower Fees**: 2% vs Stripe's 2.9% + ₹2
✅ **INR Native**: No currency conversion
✅ **Local Support**: Indian customer support

## 🐛 Troubleshooting

### "Razorpay is not defined"
- Make sure you've started the frontend server
- The Razorpay script loads automatically

### "Invalid API Key"
- Check your `.env` file has correct keys
- Make sure you're using **Test Mode** keys
- Keys should start with `rzp_test_`

### Payment Not Working
- Verify both backend and frontend are running
- Check browser console for errors
- Make sure you're in Test Mode

## 📞 Need Help?

- Razorpay Docs: [https://razorpay.com/docs/](https://razorpay.com/docs/)
- Test Cards: [https://razorpay.com/docs/payments/payments/test-card-details/](https://razorpay.com/docs/payments/payments/test-card-details/)

---

**You're all set! 🎉**

Once you add your Razorpay keys to the `.env` file and install dependencies, your app will be ready to accept payments!
