import { Link } from 'react-router-dom';
import { FaCar, FaGasPump, FaUsers, FaStar } from 'react-icons/fa';

const CarCard = ({ car }) => {
    return (
        <div className="card group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={car.images[0]?.url || 'https://via.placeholder.com/400x300'}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-primary-600">
                    ₹{car.pricePerDay}/day
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{car.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{car.brand}</p>

                {/* Features */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <FaCar className="text-primary-600" />
                        <span>{car.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <FaGasPump className="text-primary-600" />
                        <span>{car.fuelType}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 text-sm">
                        <FaUsers className="text-primary-600" />
                        <span>{car.seats} Seats</span>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold">{car.ratings.average}</span>
                    <span className="text-gray-500 text-sm">({car.ratings.count} reviews)</span>
                </div>

                {/* Button */}
                <Link
                    to={`/cars/${car._id}`}
                    className="block w-full text-center btn-primary"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default CarCard;
