import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
    FaTachometerAlt,
    FaCar,
    FaCalendar,
    FaUserShield,
    FaSignOutAlt,
    FaTicketAlt,
} from 'react-icons/fa';

const AdminSidebar = ({ activePage }) => {
    const { user } = useContext(AuthContext);

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
        { name: 'Cars', path: '/admin/cars', icon: FaCar },
        { name: 'Bookings', path: '/admin/bookings', icon: FaCalendar },
        { name: 'Coupons', path: '/admin/coupons', icon: FaTicketAlt },
    ];

    // Add Manage Admins only for super admin
    if (user?.isSuperAdmin) {
        menuItems.push({ name: 'Admins', path: '/admin/users', icon: FaUserShield });
    }

    return (
        <div className="bg-gray-900 text-white w-64 min-h-screen p-6">
            <div className="mb-8">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                {user?.isSuperAdmin && (
                    <p className="text-xs text-yellow-400 mt-1">Super Admin</p>
                )}
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.name;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800'
                                }`}
                        >
                            <Icon />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}

                <Link
                    to="/"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors mt-8"
                >
                    <FaSignOutAlt />
                    <span>Back to Site</span>
                </Link>
            </nav>
        </div>
    );
};

export default AdminSidebar;
