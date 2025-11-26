import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { FaCheckCircle, FaCar, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const Home = () => {
    const features = [
        {
            icon: FaCar,
            title: 'Wide Selection',
            description: 'Choose from a diverse fleet of well-maintained vehicles',
        },
        {
            icon: FaShieldAlt,
            title: 'Safe & Secure',
            description: 'All vehicles are regularly serviced and fully insured',
        },
        {
            icon: FaCheckCircle,
            title: 'Easy Booking',
            description: 'Simple and quick booking process in just a few clicks',
        },
        {
            icon: FaHeadset,
            title: '24/7 Support',
            description: 'Round-the-clock customer support for your convenience',
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4">
                            Find Your Perfect Ride
                        </h1>
                        <p className="text-xl text-primary-100">
                            Rent a car in minutes. Drive with confidence.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <SearchBar />
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Why Choose Us?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow"
                                >
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                                        <Icon className="text-primary-600 text-2xl" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 bg-gray-50">
                <div className="container-custom">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        How It Works
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Search</h3>
                            <p className="text-gray-600">
                                Enter your city and travel dates to find available cars
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Book</h3>
                            <p className="text-gray-600">
                                Select your preferred car and complete the booking
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Drive</h3>
                            <p className="text-gray-600">
                                Pick up your car and enjoy your journey
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary-600 text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Hit the Road?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Browse our collection of cars and book your ride today
                    </p>
                    <Link to="/cars" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block">
                        Browse Cars
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
