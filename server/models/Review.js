import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
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
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please provide rating'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Please provide review comment'],
        },
    },
    {
        timestamps: true,
    }
);

// Prevent user from submitting multiple reviews for the same booking
reviewSchema.index({ booking: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
