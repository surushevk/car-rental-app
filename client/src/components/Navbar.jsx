import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaCar, FaUser, FaSignOutAlt, FaUserShield } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <FaCar className="text-primary-600 text-3xl" />
                        <span className="text-2xl font-bold text-gray-900">
                            Car<span className="text-primary-600">Rental</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/cars"
                            className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                        >
                            Browse Cars
                        </Link>

                        {user ? (
                            <>
                                {isAdmin ? (
                                    <Link
                                        to="/admin/dashboard"
                                        className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
                                    >
                                        <FaUserShield />
                                        <span>Admin Panel</span>
                                    </Link>
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
                                    >
                                        <FaUser />
                                        <span>My Bookings</span>
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center space-x-1"
                                >
                                    <FaSignOutAlt />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
                                    <FaUser className="text-gray-700 text-xl" />
                                </Link>
                                <button onClick={handleLogout}>
                                    <FaSignOutAlt className="text-gray-700 text-xl" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary text-sm px-4 py-2">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
