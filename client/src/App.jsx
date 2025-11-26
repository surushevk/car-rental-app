import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CarSearch from './pages/CarSearch';
import CarDetails from './pages/CarDetails';

// User Pages
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import UserDashboard from './pages/UserDashboard';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCars from './pages/AdminCars';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import AdminCoupons from './pages/AdminCoupons';
import ManageCities from './pages/ManageCities';

function App() {
    return (
        <AuthProvider>
            <BookingProvider>
                <Router>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/forgot-password" element={<ForgotPassword />} />
                                <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
                                <Route path="/cars" element={<CarSearch />} />
                                <Route path="/cars/:id" element={<CarDetails />} />

                                {/* User Protected Routes */}
                                <Route
                                    path="/booking"
                                    element={
                                        <ProtectedRoute>
                                            <BookingPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/payment"
                                    element={
                                        <ProtectedRoute>
                                            <PaymentPage />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <UserDashboard />
                                        </ProtectedRoute>
                                    }
                                />

                                {/* Admin Protected Routes */}
                                <Route
                                    path="/admin/dashboard"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/cars"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AdminCars />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/bookings"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AdminBookings />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/coupons"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AdminCoupons />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/users"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AdminUsers />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/cities"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <ManageCities />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </Router>
            </BookingProvider>
        </AuthProvider>
    );
}

export default App;
