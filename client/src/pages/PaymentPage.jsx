import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import { createBooking } from '../services/bookingService';
import { createPaymentOrder, verifyPayment } from '../services/paymentService';
import { toast } from 'react-toastify';
import { FaCreditCard, FaLock, FaMobileAlt } from 'react-icons/fa';

const PaymentPage = () => {
    const navigate = useNavigate();
    const { bookingDetails, clearBooking } = useContext(BookingContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!bookingDetails) {
            navigate('/cars');
            return;
        }

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [bookingDetails, navigate]);

    const handlePayment = async () => {
        if (!bookingDetails) return;

        setLoading(true);

        try {
            // First, create the booking
            const createdBooking = await createBooking(bookingDetails);

            // Create Razorpay order with the booking ID
            const orderData = await createPaymentOrder(createdBooking._id);

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Car Rental Booking',
                description: `Booking for ${createdBooking.car.name}`,
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        // Verify payment
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookingId: createdBooking._id,
                        });

                        toast.success('Payment successful! Your booking is confirmed.');
                        clearBooking();
                        navigate('/dashboard');
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: createdBooking.user?.name || '',
                    email: createdBooking.user?.email || '',
                    contact: createdBooking.user?.phone || '',
                },
                theme: {
                    color: '#3B82F6',
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                        toast.info('Payment cancelled');
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to initialize payment');
            setLoading(false);
        }
    };

    if (!bookingDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl text-gray-600">No booking found</p>
            </div>
        );
    }

    const isUPI = bookingDetails.paymentMethod === 'upi';
    const isCard = bookingDetails.paymentMethod === 'card';

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-2xl">
                <h1 className="text-3xl font-bold mb-8">Complete Payment</h1>

                <div className="bg-white rounded-xl shadow-md p-8">
                    {/* Booking Summary */}
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h2 className="font-bold text-lg mb-3">Booking Summary</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Car</span>
                                <span className="font-semibold">{bookingDetails.car?.name || 'Car Name Unavailable'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Duration</span>
                                <span className="font-semibold">{bookingDetails.totalDays || 0} days</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-semibold capitalize flex items-center gap-2">
                                    {isUPI && <FaMobileAlt className="text-primary-600" />}
                                    {isCard && <FaCreditCard className="text-primary-600" />}
                                    {bookingDetails.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span>Total Amount</span>
                                <span className="text-primary-600">₹{bookingDetails.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-3 mb-4">
                            <FaLock className="text-blue-600 mt-1" />
                            <div>
                                <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
                                <p className="text-sm text-blue-800">
                                    Your payment is processed securely through Razorpay
                                </p>
                            </div>
                        </div>

                        {isUPI && (
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-green-900 mb-2">
                                    <FaMobileAlt className="inline mr-2" />
                                    UPI Payment
                                </p>
                                <p className="text-sm text-green-800">
                                    You can pay using Google Pay, PhonePe, Paytm, or any UPI app
                                </p>
                            </div>
                        )}

                        {isCard && (
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm font-semibold text-purple-900 mb-2">
                                    <FaCreditCard className="inline mr-2" />
                                    Card Payment
                                </p>
                                <p className="text-sm text-purple-800">
                                    Pay securely with your Credit or Debit card
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="btn-primary w-full text-lg"
                    >
                        {loading ? 'Processing...' : `Pay ₹${bookingDetails.totalAmount}`}
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-4">
                        By clicking "Pay", you agree to our terms and conditions
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
