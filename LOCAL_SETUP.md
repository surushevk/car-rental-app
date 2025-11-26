# Local Setup Guide - Car Rental App

## Quick Start Guide

Follow these steps to run the application on your local machine.

## Prerequisites

Make sure you have these installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or MongoDB Atlas account
- **Git** (optional, if cloning)

## Step 1: Get API Keys

You'll need free accounts for these services:

### 1. MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 2. Cloudinary (Image Storage)
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. From dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### 3. Stripe (Payments)
1. Go to [Stripe](https://stripe.com/)
2. Create account
3. Go to Developers → API Keys
4. Copy:
   - Secret Key (starts with `sk_test_`)
   - Publishable Key (starts with `pk_test_`)

## Step 2: Backend Setup

1. **Open terminal and navigate to server folder:**
```bash
cd "e:\Car Booking App\server"
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in server folder** with this content:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_random_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

**Replace the placeholder values with your actual API keys!**

For `JWT_SECRET`, you can use any random string like: `mySecretKey12345!@#`

4. **Seed the database with sample data:**
```bash
npm run seed
```

This will create:
- Admin account: `admin@carrental.com` / `admin123`
- User account: `john@example.com` / `password123`
- Sample cars in different cities

5. **Start the backend server:**
```bash
npm run dev
```

You should see: `✓ Server running on port 5000` and `✓ MongoDB Connected`

**Keep this terminal open!**

## Step 3: Frontend Setup

1. **Open a NEW terminal** and navigate to client folder:
```bash
cd "e:\Car Booking App\client"
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file in client folder** with this content:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

**Replace `your_stripe_publishable_key` with your actual Stripe publishable key!**

4. **Start the frontend:**
```bash
npm run dev
```

You should see: `Local: http://localhost:5173/`

## Step 4: Access the Application

1. **Open your browser** and go to: `http://localhost:5173`

2. **Login with demo accounts:**
   - **Admin**: `admin@carrental.com` / `admin123`
   - **User**: `john@example.com` / `password123`

## Testing Payments

### Card Payment (Stripe Test)
Use these test card details:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)

### UPI Payment (Stripe Test)
- UPI ID: Use any test UPI ID format like `test@paytm`
- Note: In test mode, payments won't actually charge

### Cash Payment
- Select cash option
- Booking will be created with pending payment status
- Admin can mark as completed later

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:** 
- Check your MongoDB connection string in `.env`
- Make sure your IP is whitelisted in MongoDB Atlas
- Verify username/password are correct

### Issue: "Port 5000 already in use"
**Solution:**
- Change `PORT=5000` to `PORT=5001` in server `.env`
- Update `VITE_API_URL` in client `.env` to `http://localhost:5001/api`

### Issue: "Cloudinary upload failed"
**Solution:**
- Verify your Cloudinary credentials in `.env`
- Check that all three values (cloud name, API key, API secret) are correct

### Issue: "Stripe payment not working"
**Solution:**
- Make sure you're using test keys (starting with `sk_test_` and `pk_test_`)
- Check Stripe dashboard for error logs
- Use test card number: `4242 4242 4242 4242`

## Project Structure

```
Car Booking App/
├── server/              # Backend (Port 5000)
│   ├── .env            # Backend environment variables
│   └── ...
└── client/              # Frontend (Port 5173)
    ├── .env            # Frontend environment variables
    └── ...
```

## Quick Commands Reference

### Backend (Terminal 1)
```bash
cd "e:\Car Booking App\server"
npm install              # Install dependencies (first time only)
npm run seed            # Seed database (first time only)
npm run dev             # Start backend server
```

### Frontend (Terminal 2)
```bash
cd "e:\Car Booking App\client"
npm install              # Install dependencies (first time only)
npm run dev             # Start frontend
```

## Next Steps

Once everything is running:

1. **Browse Cars**: Go to Cars page and search for available cars
2. **Make a Booking**: Select a car, choose dates, and select payment method
3. **Admin Panel**: Login as admin to manage cars and bookings
4. **Test Payments**: Try all three payment methods (Card, UPI, Cash)

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy
- Check the Postman collection for API testing

---

**Happy Coding! 🚀**
