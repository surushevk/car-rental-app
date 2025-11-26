import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BookingContext } from '../context/BookingContext';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaCar } from 'react-icons/fa';

const SearchBar = () => {
    const { updateSearchParams } = useContext(BookingContext);
    const navigate = useNavigate();

    const [city, setCity] = useState('');
    const [pickupDate, setPickupDate] = useState(null);
    const [dropDate, setDropDate] = useState(null);
    const [type, setType] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();

        const params = {
            city,
            pickupDate,
            dropDate,
            type,
        };

        updateSearchParams(params);
        navigate('/cars');
    };

    return (
        <form
            onSubmit={handleSearch}
            className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4"
        >
            {/* City */}
            <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-primary-600" />
                    City
                </label>
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                />
            </div>

            {/* Pickup Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-primary-600" />
                    Pickup Date
                </label>
                <DatePicker
                    selected={pickupDate}
                    onChange={(date) => setPickupDate(date)}
                    minDate={new Date()}
                    placeholderText="Select date"
                    className="input-field"
                    dateFormat="dd/MM/yyyy"
                />
            </div>

            {/* Drop Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCalendarAlt className="inline mr-2 text-primary-600" />
                    Drop Date
                </label>
                <DatePicker
                    selected={dropDate}
                    onChange={(date) => setDropDate(date)}
                    minDate={pickupDate || new Date()}
                    placeholderText="Select date"
                    className="input-field"
                    dateFormat="dd/MM/yyyy"
                />
            </div>

            {/* Car Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaCar className="inline mr-2 text-primary-600" />
                    Car Type
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="input-field"
                >
                    <option value="">All Types</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Sports">Sports</option>
                    <option value="Electric">Electric</option>
                </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
                <button type="submit" className="btn-primary w-full">
                    <FaSearch className="inline mr-2" />
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
