import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCarById } from '../services/carService';
import { getCarReviews } from '../services/reviewService';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';
import { FaCar, FaGasPump, FaUsers, FaStar, FaCog, FaTachometerAlt, FaPalette, FaCalendar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { setSelectedCar, searchParams } = useContext(BookingContext);

    const [car, setCar] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchCar();
    }, [id]);

    const fetchCar = async () => {
        try {
            const data = await getCarById(id);
            setCar(data);
            const reviewsData = await getCarReviews(id);
            setReviews(reviewsData);
        } catch (error) {
            toast.error('Failed to fetch car details');
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = () => {
        if (!user) {
            toast.info('Please login to book a car');
            navigate('/login', { state: { from: { pathname: `/cars/${id}` } } });
            return;
        }

        setSelectedCar(car);
        navigate('/booking');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">Car not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                        {/* Images */}
                        <div>
                            <div className="mb-4 rounded-lg overflow-hidden">
                                <img
                                    src={car.images[selectedImage]?.url || 'https://via.placeholder.com/600x400'}
                                    alt={car.name}
                                    className="w-full h-96 object-cover"
                                />
                            </div>
                            {car.images.length > 1 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {car.images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img.url}
                                            alt={`${car.name} ${index + 1}`}
                                            onClick={() => setSelectedImage(index)}
                                            className={`h-20 object-cover rounded cursor-pointer ${selectedImage === index ? 'ring-2 ring-primary-600' : ''
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.name}</h1>
                            <p className="text-xl text-gray-600 mb-4">{car.brand}</p>

                            {/* Rating */}
                            <div className="flex items-center space-x-2 mb-6">
                                <FaStar className="text-yellow-400 text-xl" />
                                <span className="text-xl font-semibold">{car.ratings.average}</span>
                                <span className="text-gray-500">({car.ratings.count} reviews)</span>
                            </div>

                            {/* Price */}
                            <div className="bg-primary-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-600">Price per day</p>
                                <p className="text-3xl font-bold text-primary-600">₹{car.pricePerDay}</p>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center space-x-3">
                                    <FaCar className="text-primary-600 text-xl" />
                                    <div>
                                        <p className="text-sm text-gray-500">Type</p>
                                        <p className="font-semibold">{car.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaGasPump className="text-primary-600 text-xl" />
                                    <div>
                                        <p className="text-sm text-gray-500">Fuel</p>
                                        <p className="font-semibold">{car.fuelType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaUsers className="text-primary-600 text-xl" />
                                    <div>
                                        <p className="text-sm text-gray-500">Seats</p>
                                        <p className="font-semibold">{car.seats} Seater</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaCog className="text-primary-600 text-xl" />
                                    <div>
                                        <p className="text-sm text-gray-500">Transmission</p>
                                        <p className="font-semibold">{car.specifications.transmission}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Book Button */}
                            <button
                                onClick={handleBookNow}
                                className="btn-primary w-full text-lg"
                            >
                                Book Now
                            </button>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="border-t p-8">
                        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="flex items-center space-x-3">
                                <FaTachometerAlt className="text-primary-600 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Mileage</p>
                                    <p className="font-semibold">{car.specifications.mileage}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaCog className="text-primary-600 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Engine</p>
                                    <p className="font-semibold">{car.specifications.engineCapacity}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaPalette className="text-primary-600 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Color</p>
                                    <p className="font-semibold">{car.specifications.color}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaCalendar className="text-primary-600 text-2xl" />
                                <div>
                                    <p className="text-sm text-gray-500">Year</p>
                                    <p className="font-semibold">{car.specifications.year}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="border-t p-8">
                        <h2 className="text-2xl font-bold mb-6">Features</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {car.features.map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="border-t p-8">
                        <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                        {reviews.length > 0 ? (
                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review._id} className="border-b pb-6 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                                    {review.user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{review.user.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded">
                                                <FaStar className="text-yellow-400" />
                                                <span className="font-semibold">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 ml-12">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No reviews yet. Be the first to rate this car!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
