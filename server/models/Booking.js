import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Car',
            required: true,
        },
        pickupDate: {
            type: Date,
            required: [true, 'Please provide pickup date'],
        },
        dropDate: {
            type: Date,
            required: [true, 'Please provide drop date'],
        },
        totalDays: {
            type: Number,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        paymentMethod: {
            type: String,
            enum: ['card', 'cash', 'upi'],
            required: [true, 'Please provide payment method'],
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending',
        },
        razorpayPaymentId: {
            type: String,
        },
        razorpayOrderId: {
            type: String,
        },
        couponCode: {
            type: String,
            uppercase: true,
        },
        discount: {
            type: Number,
            default: 0,
        },
        originalAmount: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

// Index for date range queries
bookingSchema.index({ car: 1, pickupDate: 1, dropDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
