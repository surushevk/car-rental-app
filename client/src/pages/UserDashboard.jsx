import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserBookings } from '../services/bookingService';
import { toast } from 'react-toastify';
import { FaCar, FaCalendar, FaMoneyBillWave, FaCheckCircle, FaClock, FaTimes, FaStar } from 'react-icons/fa';
import RateCarModal from '../components/RateCarModal';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isRateModalOpen, setIsRateModalOpen] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getUserBookings();
            setBookings(data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleRateClick = (booking) => {
        setSelectedBooking(booking);
        setIsRateModalOpen(true);
    };

    const handleReviewSubmitted = () => {
        fetchBookings(); // Refresh bookings to update UI if needed (e.g., disable rate button)
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'confirmed':
                return <FaCheckCircle />;
            case 'pending':
                return <FaClock />;
            case 'completed':
                return <FaCheckCircle />;
            case 'cancelled':
                return <FaTimes />;
            default:
                return <FaClock />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                {/* User Info */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <h1 className="text-3xl font-bold mb-4">My Dashboard</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-semibold">{user.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-semibold">{user.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Bookings */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        {/* Car Info */}
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={booking.car.images[0]?.url}
                                                alt={booking.car.name}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                            <div>
                                                <h3 className="font-bold text-lg">{booking.car.name}</h3>
                                                <p className="text-gray-600">{booking.car.brand}</p>
                                                <div className="flex items-center space-x-2 mt-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                                                        {getStatusIcon(booking.status)}
                                                        <span className="ml-1 capitalize">{booking.status}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Booking Details */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500 flex items-center">
                                                    <FaCalendar className="mr-2 text-primary-600" />
                                                    Pickup
                                                </p>
                                                <p className="font-semibold">
                                                    {new Date(booking.pickupDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 flex items-center">
                                                    <FaCalendar className="mr-2 text-primary-600" />
                                                    Drop
                                                </p>
                                                <p className="font-semibold">
                                                    {new Date(booking.dropDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 flex items-center">
                                                    <FaMoneyBillWave className="mr-2 text-primary-600" />
                                                    Total
                                                </p>
                                                <p className="font-semibold text-primary-600">
                                                    ₹{booking.totalAmount}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Payment Info */}
                                        <div className="text-sm">
                                            <p className="text-gray-500">Payment</p>
                                            <p className="font-semibold capitalize">{booking.paymentMethod}</p>
                                            <p className={`text-xs mt-1 ${booking.paymentStatus === 'completed'
                                                ? 'text-green-600'
                                                : 'text-yellow-600'
                                                }`}>
                                                {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center justify-end md:justify-start">
                                            {booking.status === 'completed' && (
                                                <button
                                                    onClick={() => handleRateClick(booking)}
                                                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                                                >
                                                    <FaStar />
                                                    <span>Rate Car</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
                            <p className="text-xl text-gray-600">No bookings yet</p>
                            <p className="text-gray-500 mt-2">Start exploring our cars and make your first booking!</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedBooking && (
                <RateCarModal
                    isOpen={isRateModalOpen}
                    onClose={() => setIsRateModalOpen(false)}
                    booking={selectedBooking}
                    onReviewSubmitted={handleReviewSubmitted}
                />
            )}
        </div>
    );
};

export default UserDashboard;
