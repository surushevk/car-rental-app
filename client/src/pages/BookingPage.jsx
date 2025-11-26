import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookingContext } from '../context/BookingContext';
import { createBooking } from '../services/bookingService';
import { validateCoupon } from '../services/couponService';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { FaCalendarAlt, FaMoneyBillWave, FaCreditCard, FaMobileAlt, FaTicketAlt, FaTimes } from 'react-icons/fa';

const BookingPage = () => {
    const { user } = useContext(AuthContext);
    const { selectedCar, searchParams, setBookingDetails } = useContext(BookingContext);
    const navigate = useNavigate();

    // Initialize dates with default times (e.g., 9 AM)
    const [pickupDate, setPickupDate] = useState(() => {
        const date = searchParams.pickupDate ? new Date(searchParams.pickupDate) : new Date();
        date.setHours(9, 0, 0, 0);
        // If current time is past 9 AM, set to next hour or tomorrow
        if (date < new Date()) {
            date.setTime(Date.now() + 3600000); // +1 hour
        }
        return date;
    });
    const [dropDate, setDropDate] = useState(() => {
        const date = searchParams.dropDate ? new Date(searchParams.dropDate) : new Date(Date.now() + 86400000);
        date.setHours(9, 0, 0, 0);
        return date;
    });
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(false);

    // Coupon states
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponLoading, setCouponLoading] = useState(false);
    const [showCouponInput, setShowCouponInput] = useState(false);

    useEffect(() => {
        if (!selectedCar) {
            navigate('/cars');
        }
    }, [selectedCar, navigate]);

    if (!selectedCar) return null;

    const calculateTotal = () => {
        const diffTime = Math.abs(dropDate - pickupDate);
        const diffHours = diffTime / (1000 * 60 * 60);
        const days = Math.ceil(diffHours / 24);

        // Ensure at least 1 day charge if valid range
        const chargeableDays = days > 0 ? days : (diffHours > 0 ? 1 : 0);

        const baseAmount = chargeableDays * selectedCar.pricePerDay;
        const discount = appliedCoupon ? appliedCoupon.discount : 0;
        return {
            days: days > 0 ? days : 0,
            originalAmount: baseAmount,
            discount,
            amount: baseAmount - discount,
        };
    };

    const { days, originalAmount, discount, amount } = calculateTotal();

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        setCouponLoading(true);
        try {
            const response = await validateCoupon(couponCode, originalAmount, selectedCar.type);
            setAppliedCoupon(response.data);
            toast.success(`Coupon applied! You saved ₹${response.data.discount}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid coupon code');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        toast.info('Coupon removed');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (pickupDate >= dropDate) {
            toast.error('Drop date must be after pickup date');
            return;
        }

        // Prepare booking details
        const bookingData = {
            carId: selectedCar._id,
            car: selectedCar,
            totalDays: days,
            pickupDate: pickupDate.toISOString(),
            dropDate: dropDate.toISOString(),
            totalAmount: amount,
            originalAmount: originalAmount,
            discount: discount,
            paymentMethod,
            couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        };

        // Store booking details in context for payment page
        setBookingDetails(bookingData);

        // Navigate based on payment method
        if (paymentMethod === 'card' || paymentMethod === 'upi') {
            // For online payment, just navigate - booking created after payment
            navigate('/payment');
        } else {
            // For cash payment, create booking immediately
            setLoading(true);
            try {
                await createBooking(bookingData);
                toast.success('Booking confirmed successfully!');
                navigate('/dashboard');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to create booking');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container-custom">
            <h1 className="text-3xl font-bold mb-8">Complete Your Booking</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-6">Booking Details</h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaCalendarAlt className="inline mr-2 text-primary-600" />
                                        Pickup Date
                                    </label>
                                    <DatePicker
                                        selected={pickupDate}
                                        onChange={(date) => setPickupDate(date)}
                                        minDate={new Date()}
                                        showTimeSelect
                                        minTime={new Date().setHours(7, 0, 0, 0)}
                                        maxTime={new Date().setHours(22, 0, 0, 0)}
                                        dateFormat="dd/MM/yyyy h:mm aa"
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaCalendarAlt className="inline mr-2 text-primary-600" />
                                        Drop Date
                                    </label>
                                    <DatePicker
                                        selected={dropDate}
                                        onChange={(date) => setDropDate(date)}
                                        minDate={pickupDate}
                                        showTimeSelect
                                        minTime={
                                            dropDate.getDate() === pickupDate.getDate()
                                                ? pickupDate // If same day, min time is pickup time
                                                : new Date().setHours(7, 0, 0, 0) // Else 7 AM
                                        }
                                        maxTime={new Date().setHours(22, 0, 0, 0)}
                                        dateFormat="dd/MM/yyyy h:mm aa"
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-4">
                                    <FaMoneyBillWave className="inline mr-2 text-primary-600" />
                                    Payment Method
                                </label>

                                <div className="space-y-3">
                                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={paymentMethod === 'card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <FaCreditCard className="text-primary-600 text-xl mr-3" />
                                        <div>
                                            <p className="font-semibold">Pay with Card</p>
                                            <p className="text-sm text-gray-500">Secure online payment via Stripe</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="upi"
                                            checked={paymentMethod === 'upi'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <FaMobileAlt className="text-primary-600 text-xl mr-3" />
                                        <div>
                                            <p className="font-semibold">UPI Payment</p>
                                            <p className="text-sm text-gray-500">Pay via Google Pay, PhonePe, Paytm, or any UPI app</p>
                                        </div>
                                    </label>

                                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={paymentMethod === 'cash'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <FaMoneyBillWave className="text-primary-600 text-xl mr-3" />
                                        <div>
                                            <p className="font-semibold">Cash Payment</p>
                                            <p className="text-sm text-gray-500">Pay cash to driver after completing the ride</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setShowCouponInput(!showCouponInput)}
                                    className="flex items-center text-primary-600 font-semibold hover:text-primary-700"
                                >
                                    <FaTicketAlt className="mr-2" />
                                    {appliedCoupon ? 'Coupon Applied' : 'Have a coupon?'}
                                </button>

                                {showCouponInput && !appliedCoupon && (
                                    <div className="mt-3 flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code"
                                            className="input-field flex-1"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading}
                                            className="btn-primary px-6"
                                        >
                                            {couponLoading ? 'Applying...' : 'Apply'}
                                        </button>
                                    </div>
                                )}

                                {appliedCoupon && (
                                    <div className="mt-3 flex items-center justify-between bg-green-50 p-3 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-green-800">{appliedCoupon.code}</p>
                                            <p className="text-sm text-green-600">You saved ₹{appliedCoupon.discount}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full text-lg"
                            >
                                {loading ? 'Processing...' : (paymentMethod === 'card' || paymentMethod === 'upi') ? 'Proceed to Payment' : 'Confirm Booking'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Booking Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

                        {/* Car Info */}
                        <div className="mb-6">
                            <img
                                src={selectedCar.images[0]?.url}
                                alt={selectedCar.name}
                                className="w-full h-40 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-bold text-lg">{selectedCar.name}</h3>
                            <p className="text-gray-600">{selectedCar.brand}</p>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 border-t pt-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Price per day</span>
                                <span className="font-semibold">₹{selectedCar.pricePerDay}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Number of days</span>
                                <span className="font-semibold">{days}</span>
                            </div>
                            {appliedCoupon && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-semibold">₹{originalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span className="font-semibold">-₹{discount}</span>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t pt-3">
                                <span>Total Amount</span>
                                <span className="text-primary-600">₹{amount}</span>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Booking For:</p>
                            <p className="text-sm">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">{user.phone}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
