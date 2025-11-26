import { useState, useEffect } from 'react';
import { getAllBookings, updateBookingStatus } from '../services/bookingService';
import AdminSidebar from '../components/AdminSidebar';
import { toast } from 'react-toastify';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getAllBookings();
            setBookings(data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, newStatus) => {
        try {
            await updateBookingStatus(bookingId, newStatus);
            toast.success('Booking status updated');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter((b) => b.status === filter);

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activePage="Bookings" />

            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8">Manage Bookings</h1>

                {/* Filter Tabs */}
                <div className="flex space-x-2 mb-6">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === status
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No bookings found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-mono">
                                                {booking._id.slice(-8)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold">{booking.user?.name || 'N/A'}</p>
                                                    <p className="text-sm text-gray-500">{booking.user?.email || 'N/A'}</p>
                                                    <p className="text-sm text-gray-500">{booking.user?.phone || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    {booking.car?.images?.[0]?.url && (
                                                        <img
                                                            src={booking.car.images[0].url}
                                                            alt={booking.car?.name || 'Car'}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold">{booking.car?.name || 'N/A'}</p>
                                                        <p className="text-sm text-gray-500">{booking.car?.brand || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <p>{new Date(booking.pickupDate).toLocaleDateString()}</p>
                                                <p className="text-gray-500">to</p>
                                                <p>{new Date(booking.dropDate).toLocaleDateString()}</p>
                                                <p className="text-gray-500">({booking.totalDays} days)</p>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-primary-600">
                                                ₹{booking.totalAmount}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="capitalize text-sm font-semibold">{booking.paymentMethod}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${booking.paymentStatus === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={booking.status}
                                                    onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                                                    className="text-sm border border-gray-300 rounded px-2 py-1 text-gray-900 bg-white"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminBookings;
