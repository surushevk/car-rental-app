import { createContext, useState } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useState({
        city: '',
        pickupDate: null,
        dropDate: null,
        type: '',
    });

    const [selectedCar, setSelectedCar] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);

    const updateSearchParams = (params) => {
        setSearchParams((prev) => ({ ...prev, ...params }));
    };

    const clearBooking = () => {
        setSelectedCar(null);
        setBookingDetails(null);
    };

    return (
        <BookingContext.Provider
            value={{
                searchParams,
                updateSearchParams,
                selectedCar,
                setSelectedCar,
                bookingDetails,
                setBookingDetails,
                clearBooking,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
};
