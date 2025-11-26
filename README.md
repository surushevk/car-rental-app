# Car Rental Booking Application

A full-stack MERN (MongoDB, Express, React, Node.js) car rental booking application with **three payment methods**: Card, UPI, and Cash.

## 🚀 Features

### User Features
- User authentication (Register/Login with JWT)
- Browse and search cars with advanced filters
- Real-time car availability checking
- Book cars with date selection
- **Three payment options:**
  - **Card Payment**: Secure payment via Stripe
  - **UPI Payment**: Pay via Google Pay, PhonePe, Paytm, or any UPI app
  - **Cash Payment**: Pay cash to driver after ride completion
- View booking history and status
- User dashboard with profile information

### Admin Features
- Admin dashboard with statistics
- Complete car management (Add, Edit, Delete with images)
- Booking management with status updates
- Payment tracking for all payment methods
- Revenue analytics

### Technical Features
- JWT-based authentication
- Role-based access control (User/Admin)
- Image upload with Cloudinary
- Stripe payment integration (Card + UPI)
- Real-time availability checking
- Date overlap prevention
- Responsive design with Tailwind CSS
- RESTful API architecture

## 📦 Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Context API (State Management)
- Axios
- React DatePicker
- Stripe React
- React Icons
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcryptjs
- Multer (File Upload)
- Cloudinary (Image Storage)
- Stripe (Payment Processing)

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Stripe account

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in server directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

4. Seed the database (optional):
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in client directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 👤 Demo Credentials

### Admin Account
- Email: `admin@carrental.com`
- Password: `admin123`

### User Account
- Email: `john@example.com`
- Password: `password123`

## 💳 Payment Methods

### 1. Card Payment (Stripe)
- Secure online payment processing
- Instant booking confirmation
- Automatic payment verification

### 2. UPI Payment (Stripe)
- Pay using Google Pay, PhonePe, Paytm, or any UPI app
- Enter your UPI ID (e.g., yourname@paytm)
- Approve payment in your UPI app
- Supported in India through Stripe

### 3. Cash Payment
- Book now, pay later
- Pay cash to driver after completing the ride
- Admin confirms payment after receiving cash

## 📁 Project Structure

```
Car Booking App/
├── server/                     # Backend
│   ├── config/                # Configuration files
│   ├── controllers/           # Route controllers
│   ├── middlewares/           # Custom middlewares
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── utils/                 # Utility functions
│   ├── .env                   # Environment variables
│   └── server.js              # Entry point
│
└── client/                     # Frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   ├── context/           # Context API
    │   ├── pages/             # Page components
    │   ├── services/          # API services
    │   ├── App.jsx            # Main app component
    │   └── main.jsx           # Entry point
    ├── .env                   # Environment variables
    └── vite.config.js         # Vite configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create car (Admin)
- `PUT /api/cars/:id` - Update car (Admin)
- `DELETE /api/cars/:id` - Delete car (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/admin` - Get all bookings (Admin)
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id/status` - Update booking status (Admin)

### Payments
- `POST /api/payments/create` - Create payment intent
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/booking/:bookingId` - Get payment by booking

## 🎨 Features in Detail

### Car Search & Filtering
- Search by city
- Filter by car type (Sedan, SUV, Hatchback, Luxury)
- Filter by price range
- Filter by fuel type (Petrol, Diesel, Electric, Hybrid)
- Filter by number of seats
- Sort by price (Low to High, High to Low)

### Booking System
- Date range selection
- Real-time availability check
- Automatic price calculation
- Date overlap prevention
- Multiple payment options

### Admin Panel
- Dashboard with key metrics
- Revenue tracking
- Booking statistics
- Car inventory management
- Booking status management

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Backend (Render)
- Frontend (Vercel)
- MongoDB Atlas
- Cloudinary
- Stripe

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
STRIPE_SECRET_KEY=sk_test_...
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 🧪 Testing

Use the included Postman collection (`CarRental.postman_collection.json`) to test all API endpoints.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your MongoDB URI is correct
   - Check if your IP is whitelisted in MongoDB Atlas
   - Ensure network access is configured

2. **Cloudinary Upload Error**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file format

3. **Stripe Payment Error**
   - Use test card: 4242 4242 4242 4242
   - Verify Stripe API keys
   - Check Stripe dashboard for errors

4. **UPI Payment Issues**
   - UPI payments only work in India
   - Ensure Stripe account is configured for INR
   - Test with valid UPI ID format

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ using MERN Stack

## 🙏 Acknowledgments

- Stripe for payment processing
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
- Tailwind CSS for styling
