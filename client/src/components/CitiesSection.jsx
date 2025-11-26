import { useState, useEffect } from 'react';
import { getCities } from '../services/cityService';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { BookingContext } from '../context/BookingContext';

const CitiesSection = () => {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { updateSearchParams } = useContext(BookingContext);

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const data = await getCities();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCityClick = (cityName) => {
        updateSearchParams({ city: cityName });
        navigate('/cars');
    };

    if (loading) {
        return null;
    }

    return (
        <section className="py-12 bg-gradient-to-r from-primary-50 to-primary-100 overflow-hidden">
            <div className="container-custom mb-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        We Serve Across India
                    </h2>
                    <p className="text-gray-600">
                        Select your city to find available cars
                    </p>
                </div>
            </div>

            {/* Horizontal Scrolling Animation */}
            <div className="relative">
                <div className="cities-scroll-container">
                    <div className="cities-scroll">
                        {/* Duplicate cities for seamless loop */}
                        {[...cities, ...cities].map((city, index) => (
                            <button
                                key={`${city._id}-${index}`}
                                onClick={() => handleCityClick(city.name)}
                                className="city-card group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                                        <img
                                            src={city.imageUrl || 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&q=80'}
                                            alt={city.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-primary-700 transition-colors">
                                            {city.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{city.state}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CSS for animation */}
            <style>{`
                .cities-scroll-container {
                    width: 100%;
                    overflow: hidden;
                }

                .cities-scroll {
                    display: flex;
                    gap: 1.5rem;
                    animation: scroll 40s linear infinite;
                    width: fit-content;
                }

                .city-card {
                    flex-shrink: 0;
                    background: white;
                    padding: 1.25rem 1.75rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: 2px solid transparent;
                }

                .city-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
                    border-color: var(--primary-600, #0ea5e9);
                }

                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }

                .cities-scroll:hover {
                    animation-play-state: paused;
                }

                @media (max-width: 768px) {
                    .city-card {
                        padding: 1rem 1.25rem;
                    }

                    .city-card .w-12 {
                        width: 2.5rem;
                        height: 2.5rem;
                    }
                }
            `}</style>
        </section>
    );
};

export default CitiesSection;
