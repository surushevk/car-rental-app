import { useState, useEffect, useContext } from 'react';
import { getCities, getAllCities, addCity, updateCity, deleteCity } from '../services/cityService';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const ManageCities = () => {
    const { user, token } = useContext(AuthContext);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        state: '',
        imageUrl: '',
    });

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const data = await getAllCities(token);
            setCities(data);
        } catch (error) {
            toast.error('Failed to fetch cities');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingCity) {
                await updateCity(editingCity._id, formData, token);
                toast.success('City updated successfully');
            } else {
                await addCity(formData, token);
                toast.success('City added successfully');
            }

            setShowModal(false);
            resetForm();
            fetchCities();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleEdit = (city) => {
        setEditingCity(city);
        setFormData({
            name: city.name,
            state: city.state,
            imageUrl: city.imageUrl || '',
        });
        setShowModal(true);
    };

    const handleToggleActive = async (city) => {
        try {
            await updateCity(city._id, { isActive: !city.isActive }, token);
            toast.success(`City ${city.isActive ? 'deactivated' : 'activated'} successfully`);
            fetchCities();
        } catch (error) {
            toast.error('Failed to update city status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this city?')) {
            try {
                await deleteCity(id, token);
                toast.success('City deleted successfully');
                fetchCities();
            } catch (error) {
                toast.error('Failed to delete city');
            }
        }
    };

    const resetForm = () => {
        setEditingCity(null);
        setFormData({
            name: '',
            state: '',
            imageUrl: '',
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activePage="Cities" />

            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Manage Cities</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center space-x-2"
                    >
                        <FaPlus />
                        <span>Add City</span>
                    </button>
                </div>

                {/* Cities Table */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Image
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        City
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        State
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cities.map((city) => (
                                    <tr key={city._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                <img
                                                    src={city.imageUrl || 'https://via.placeholder.com/100'}
                                                    alt={city.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{city.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{city.state}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleToggleActive(city)}
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${city.isActive
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {city.isActive ? (
                                                    <>
                                                        <FaToggleOn className="mr-1" /> Active
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaToggleOff className="mr-1" /> Inactive
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleEdit(city)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <FaEdit className="inline" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(city._id)}
                                                className="text-red-600 hover:text-red-900 ml-4"
                                            >
                                                <FaTrash className="inline" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-md w-full">
                            <div className="flex justify-between items-center p-6 border-b">
                                <h2 className="text-2xl font-bold">
                                    {editingCity ? 'Edit City' : 'Add New City'}
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

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        City Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter city name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter state name"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        required
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image URL (Landmark Photo)
                                    </label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="input-field"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter a URL of a famous landmark from this city
                                    </p>
                                </div>

                                {formData.imageUrl && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preview
                                        </label>
                                        <div className="w-32 h-32 rounded-lg overflow-hidden">
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/150';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="btn-primary w-full">
                                    {editingCity ? 'Update City' : 'Add City'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCities;
