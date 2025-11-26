import { useState, useEffect } from 'react';
import { searchCars, createCar, updateCar, deleteCar } from '../services/carService';
import { getCities } from '../services/cityService';
import AdminSidebar from '../components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AdminCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        type: 'Sedan',
        fuelType: 'Petrol',
        seats: 5,
        pricePerDay: '',
        city: '',
        features: '',
        transmission: 'Manual',
        mileage: '',
        engineCapacity: '',
        color: '',
        year: new Date().getFullYear(),
    });
    const [images, setImages] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        fetchCars();
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const data = await getCities();
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchCars = async () => {
        try {
            const data = await searchCars({});
            setCars(data);
        } catch (error) {
            toast.error('Failed to fetch cars');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        // Append basic fields
        Object.keys(formData).forEach((key) => {
            if (key === 'features') {
                formData[key].split(',').forEach((feature) => {
                    formDataToSend.append('features[]', feature.trim());
                });
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        // Append specifications
        formDataToSend.append('specifications[transmission]', formData.transmission);
        formDataToSend.append('specifications[mileage]', formData.mileage);
        formDataToSend.append('specifications[engineCapacity]', formData.engineCapacity);
        formDataToSend.append('specifications[color]', formData.color);
        formDataToSend.append('specifications[year]', formData.year);

        // Append images
        Array.from(images).forEach((image) => {
            formDataToSend.append('images', image);
        });

        try {
            if (editingCar) {
                await updateCar(editingCar._id, formDataToSend);
                toast.success('Car updated successfully');
            } else {
                await createCar(formDataToSend);
                toast.success('Car created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchCars();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (car) => {
        setEditingCar(car);
        setFormData({
            name: car.name,
            brand: car.brand,
            type: car.type,
            fuelType: car.fuelType,
            seats: car.seats,
            pricePerDay: car.pricePerDay,
            city: car.city,
            features: car.features.join(', '),
            transmission: car.specifications.transmission,
            mileage: car.specifications.mileage,
            engineCapacity: car.specifications.engineCapacity,
            color: car.specifications.color,
            year: car.specifications.year,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                await deleteCar(id);
                toast.success('Car deleted successfully');
                fetchCars();
            } catch (error) {
                toast.error('Failed to delete car');
            }
        }
    };

    const resetForm = () => {
        setEditingCar(null);
        setFormData({
            name: '',
            brand: '',
            type: 'Sedan',
            fuelType: 'Petrol',
            seats: 5,
            pricePerDay: '',
            city: '',
            features: '',
            transmission: 'Manual',
            mileage: '',
            engineCapacity: '',
            color: '',
            year: new Date().getFullYear(),
        });
        setImages([]);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activePage="Cars" />

            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Manage Cars</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <FaPlus />
                        <span>Add Car</span>
                    </button>
                </div>

                {/* Cars Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <div key={car._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                                <img
                                    src={car.images[0]?.url || 'https://via.placeholder.com/400x300'}
                                    alt={car.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-1">{car.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{car.brand}</p>
                                    <p className="text-primary-600 font-bold text-xl mb-4">₹{car.pricePerDay}/day</p>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(car)}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <FaEdit />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(car._id)}
                                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                                        >
                                            <FaTrash />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div className="bg-white rounded-xl max-w-2xl w-full my-8">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-2xl font-bold">
                                    {editingCar ? 'Edit Car' : 'Add New Car'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Car Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Brand"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Sedan">Sedan</option>
                                        <option value="SUV">SUV</option>
                                        <option value="Hatchback">Hatchback</option>
                                        <option value="Luxury">Luxury</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Electric">Electric</option>
                                    </select>
                                    <select
                                        value={formData.fuelType}
                                        onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Petrol">Petrol</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Electric">Electric</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Seats"
                                        value={formData.seats}
                                        onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Price per Day"
                                        value={formData.pricePerDay}
                                        onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        required
                                        className="input-field"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city._id} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={formData.transmission}
                                        onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                                        className="input-field"
                                    >
                                        <option value="Manual">Manual</option>
                                        <option value="Automatic">Automatic</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Mileage (e.g., 15 km/l)"
                                        value={formData.mileage}
                                        onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Engine Capacity"
                                        value={formData.engineCapacity}
                                        onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
                                        className="input-field"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="input-field"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Year"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="input-field"
                                    />
                                </div>

                                <input
                                    type="text"
                                    placeholder="Features (comma separated)"
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="input-field"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Car Images
                                    </label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setImages(e.target.files)}
                                        className="input-field"
                                    />
                                </div>

                                <button type="submit" className="btn-primary w-full">
                                    {editingCar ? 'Update Car' : 'Add Car'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCars;
