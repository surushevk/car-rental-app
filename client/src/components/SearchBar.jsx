import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BookingContext } from '../context/BookingContext';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaCar } from 'react-icons/fa';
import { getCities } from '../services/cityService';

const SearchBar = ({ compact = false }) => {
    const { searchParams, updateSearchParams } = useContext(BookingContext);
    const navigate = useNavigate();

    const [city, setCity] = useState(searchParams.city || '');
    const [pickupDate, setPickupDate] = useState(
        searchParams.pickupDate ? new Date(searchParams.pickupDate) : null
    );
    const [dropDate, setDropDate] = useState(
        searchParams.dropDate ? new Date(searchParams.dropDate) : null
    );
    const [type, setType] = useState(searchParams.type || '');
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);

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
            setLoadingCities(false);
        }
    };

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

    // Styles based on compact prop
    const containerClasses = compact
        ? "bg-white rounded-xl shadow-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-3"
        : "bg-white rounded-xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-5 gap-4";

    const labelClasses = compact
        ? "block text-xs font-medium text-gray-700 mb-1"
        : "block text-sm font-medium text-gray-700 mb-2";

    const inputClasses = compact
        ? "input-field !py-2 !px-3 !text-sm"
        : "input-field";

    const buttonClasses = compact
        ? "btn-primary w-full !py-2 !text-sm"
        : "btn-primary w-full";

    return (
        <form
            onSubmit={handleSearch}
            className={containerClasses}
        >
            {/* City */}
            <div className="relative">
                <label className={labelClasses}>
                    <FaMapMarkerAlt className={`inline ${compact ? 'mr-1' : 'mr-2'} text-primary-600`} />
                    City
                </label>
                <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={inputClasses}
                    disabled={loadingCities}
                >
                    <option value="">Select city</option>
                    {cities.map((cityItem) => (
                        <option key={cityItem._id} value={cityItem.name}>
                            {cityItem.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Pickup Date */}
            <div>
                <label className={labelClasses}>
                    <FaCalendarAlt className={`inline ${compact ? 'mr-1' : 'mr-2'} text-primary-600`} />
                    Pickup Date
                </label>
                <DatePicker
                    selected={pickupDate}
                    onChange={(date) => {
                        if (!date) {
                            setPickupDate(null);
                            setDropDate(null);
                            return;
                        }

                        const newDate = new Date(date);
                        const now = new Date();
                        const isToday = newDate.toDateString() === now.toDateString();

                        // Check if time needs to be adjusted:
                        // 1. If it's 00:00 (default from fresh pick)
                        // 2. If it's Today and the time is in the past
                        const isDefaultTime = newDate.getHours() === 0 && newDate.getMinutes() === 0;
                        const isPastTime = isToday && newDate < now;

                        if (isDefaultTime || isPastTime) {
                            if (isToday) {
                                // Round to next 30 min
                                let hours = now.getHours();
                                let minutes = now.getMinutes();

                                if (minutes < 30) {
                                    minutes = 30;
                                } else {
                                    minutes = 0;
                                    hours += 1;
                                }

                                // Enforce min 7 AM
                                if (hours < 7) {
                                    hours = 7;
                                    minutes = 0;
                                }

                                newDate.setHours(hours, minutes, 0, 0);
                            } else {
                                // Future date: 7 AM (only if it was 00:00)
                                if (isDefaultTime) {
                                    newDate.setHours(7, 0, 0, 0);
                                }
                            }
                        }

                        setPickupDate(newDate);
                        setDropDate(null);
                    }}
                    minDate={new Date()}
                    showTimeSelect
                    minTime={new Date().setHours(7, 0, 0, 0)}
                    maxTime={new Date().setHours(22, 0, 0, 0)}
                    dateFormat="dd/MM/yyyy h:mm aa"
                    placeholderText="Select date & time"
                    className={inputClasses}
                />
            </div>

            {/* Drop Date */}
            <div>
                <label className={labelClasses}>
                    <FaCalendarAlt className={`inline ${compact ? 'mr-1' : 'mr-2'} text-primary-600`} />
                    Drop Date
                </label>
                <DatePicker
                    selected={dropDate}
                    onChange={(date) => {
                        if (!date) {
                            setDropDate(null);
                            return;
                        }

                        const newDate = new Date(date);

                        // Check if it's a fresh date selection (default time 00:00)
                        // Since minTime is 7 AM, 00:00 can only come from date click, not time select
                        const isDefaultTime = newDate.getHours() === 0 && newDate.getMinutes() === 0;

                        if (isDefaultTime && pickupDate) {
                            const isSameDay = newDate.toDateString() === pickupDate.toDateString();

                            if (isSameDay) {
                                // Same day: Set to pickup time + 1 hour
                                newDate.setHours(pickupDate.getHours() + 1);
                                newDate.setMinutes(pickupDate.getMinutes());
                            } else {
                                // Different day: Set to 7 AM
                                newDate.setHours(7, 0, 0, 0);
                            }
                        }

                        setDropDate(newDate);
                    }}
                    minDate={pickupDate || new Date()}
                    showTimeSelect
                    minTime={
                        pickupDate && dropDate && dropDate.getDate() === pickupDate.getDate()
                            ? new Date(pickupDate.getTime() + 30 * 60000) // Pickup + 30 mins
                            : new Date().setHours(7, 0, 0, 0)
                    }
                    maxTime={new Date().setHours(22, 0, 0, 0)}
                    dateFormat="dd/MM/yyyy h:mm aa"
                    placeholderText="Select date & time"
                    className={inputClasses}
                />
            </div>

            {/* Car Type */}
            <div>
                <label className={labelClasses}>
                    <FaCar className={`inline ${compact ? 'mr-1' : 'mr-2'} text-primary-600`} />
                    Car Type
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={inputClasses}
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
                <button type="submit" className={buttonClasses}>
                    <FaSearch className="inline mr-2" />
                    Search
                </button>
            </div>
        </form>
    );
};

export default SearchBar;
