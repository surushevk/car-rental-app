import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create
// @access  Private
export const createPaymentOrder = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Get booking
        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Verify user owns this booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if payment method is card or UPI
        if (booking.paymentMethod === 'cash') {
            return res.status(400).json({
                message: 'This booking is set for cash payment'
            });
        }

        // Create Razorpay order
        const options = {
            amount: Math.round(booking.totalAmount * 100), // Convert to paise
            currency: 'INR',
            receipt: `receipt_${bookingId}`,
            notes: {
                bookingId: booking._id.toString(),
                userId: req.user._id.toString(),
                paymentMethod: booking.paymentMethod,
            },
        };

        const order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Razorpay order creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

        // Verify signature
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            // Update booking
            const booking = await Booking.findById(bookingId);

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            booking.paymentStatus = 'completed';
            booking.status = 'confirmed';
            booking.razorpayPaymentId = razorpay_payment_id;
            booking.razorpayOrderId = razorpay_order_id;
            await booking.save();

            // Create payment record
            await Payment.create({
                booking: bookingId,
                user: req.user._id,
                amount: booking.totalAmount,
                paymentMethod: booking.paymentMethod,
                razorpayPaymentId: razorpay_payment_id,
                razorpayOrderId: razorpay_order_id,
                status: 'completed',
            });

            res.json({
                success: true,
                message: 'Payment verified successfully',
                booking
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get payment by booking
// @route   GET /api/payments/booking/:bookingId
// @access  Private
export const getPaymentByBooking = async (req, res) => {
    try {
        const payment = await Payment.findOne({ booking: req.params.bookingId })
            .populate('booking')
            .populate('user', 'name email');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        // Check authorization
        if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
