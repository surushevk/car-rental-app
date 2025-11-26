import { useState, useEffect } from 'react';
import { getAllBookings } from '../services/bookingService';
import AdminSidebar from '../components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaCar, FaMoneyBillWave, FaCalendar } from 'react-icons/fa';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalRevenue: 0,
        pendingBookings: 0,
        completedBookings: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const data = await getAllBookings();
            setBookings(data);
            calculateStats(data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (bookingsData) => {
        const stats = {
            totalBookings: bookingsData.length,
            totalRevenue: bookingsData
                .filter((b) => b.paymentStatus === 'completed')
                .reduce((sum, b) => sum + b.totalAmount, 0),
            pendingBookings: bookingsData.filter((b) => b.status === 'pending').length,
            completedBookings: bookingsData.filter((b) => b.status === 'completed').length,
        };
        setStats(stats);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activePage="Dashboard" />

            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Bookings</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalBookings}</p>
                            </div>
                            <FaCalendar className="text-4xl text-primary-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Revenue</p>
                                <p className="text-3xl font-bold text-green-600">₹{stats.totalRevenue}</p>
                            </div>
                            <FaMoneyBillWave className="text-4xl text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                            </div>
                            <FaCar className="text-4xl text-yellow-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Completed</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.completedBookings}</p>
                            </div>
                            <FaCar className="text-4xl text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Recent Bookings</h2>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : bookings.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No bookings yet</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {bookings.slice(0, 10).map((booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div>
                                                    <p className="font-semibold">{booking.user?.name || 'N/A'}</p>
                                                    <p className="text-sm text-gray-500">{booking.user?.email || 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="font-semibold">{booking.car?.name || 'N/A'}</p>
                                            </td>
                                            <td className="px-4 py-4 text-sm">
                                                <p>{new Date(booking.pickupDate).toLocaleDateString()}</p>
                                                <p className="text-gray-500">to {new Date(booking.dropDate).toLocaleDateString()}</p>
                                            </td>
                                            <td className="px-4 py-4 font-semibold text-primary-600">
                                                ₹{booking.totalAmount}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="capitalize text-sm">{booking.paymentMethod}</span>
                                                <p className={`text-xs ${booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {booking.paymentStatus}
                                                </p>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
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

export default AdminDashboard;
