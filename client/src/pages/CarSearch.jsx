import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchCars } from '../services/carService';
import { BookingContext } from '../context/BookingContext';
import CarCard from '../components/CarCard';
import { FaFilter, FaSort } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CarSearch = () => {
    const { searchParams } = useContext(BookingContext);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        fuelType: '',
        seats: '',
        sortBy: '',
    });

    useEffect(() => {
        fetchCars();
    }, [searchParams]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const params = {
                ...searchParams,
                ...filters,
                pickupDate: searchParams.pickupDate?.toISOString(),
                dropDate: searchParams.dropDate?.toISOString(),
            };

            const data = await searchCars(params);
            setCars(data);
        } catch (error) {
            toast.error('Failed to fetch cars');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const applyFilters = () => {
        fetchCars();
    };

    const clearFilters = () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            fuelType: '',
            seats: '',
            sortBy: '',
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                <h1 className="text-3xl font-bold mb-8">Available Cars</h1>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold flex items-center">
                                    <FaFilter className="mr-2 text-primary-600" />
                                    Filters
                                </h2>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary-600 hover:underline"
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range (₹/day)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            name="minPrice"
                                            value={filters.minPrice}
                                            onChange={handleFilterChange}
                                            placeholder="Min"
                                            className="input-field text-sm"
                                        />
                                        <input
                                            type="number"
                                            name="maxPrice"
                                            value={filters.maxPrice}
                                            onChange={handleFilterChange}
                                            placeholder="Max"
                                            className="input-field text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Fuel Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fuel Type
                                    </label>
                                    <select
                                        name="fuelType"
                                        value={filters.fuelType}
                                        onChange={handleFilterChange}
                                        className="input-field text-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                {/* Seats */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Seats
                                    </label>
                                    <select
                                        name="seats"
                                        value={filters.seats}
                                        onChange={handleFilterChange}
                                        className="input-field text-sm"
                                    >
                                        <option value="">All</option>
                                        <option value="2">2 Seater</option>
                                        <option value="4">4 Seater</option>
                                        <option value="5">5 Seater</option>
                                        <option value="7">7 Seater</option>
                                        <option value="8">8 Seater</option>
                                    </select>
                                </div>

                                {/* Sort */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaSort className="inline mr-2 text-primary-600" />
                                        Sort By
                                    </label>
                                    <select
                                        name="sortBy"
                                        value={filters.sortBy}
                                        onChange={handleFilterChange}
                                        className="input-field text-sm"
                                    >
                                        <option value="">Default</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </select>
                                </div>

                                <button
                                    onClick={applyFilters}
                                    className="btn-primary w-full"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cars Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                            </div>
                        ) : cars.length > 0 ? (
                            <>
                                <p className="text-gray-600 mb-4">{cars.length} cars found</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {cars.map((car) => (
                                        <CarCard key={car._id} car={car} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-600">No cars found</p>
                                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarSearch;
