import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { bookingId, rating, comment } = req.body;
        const userId = req.user._id;

        // Check if booking exists and belongs to user
        const booking = await Booking.findOne({
            _id: bookingId,
            user: userId,
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if booking is completed
        if (booking.status !== 'completed') {
            return res.status(400).json({ message: 'You can only review completed bookings' });
        }

        // Check if review already exists for this booking
        const existingReview = await Review.findOne({ booking: bookingId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this booking' });
        }

        // Create review
        const review = await Review.create({
            user: userId,
            car: booking.car,
            booking: bookingId,
            rating,
            comment,
        });

        // Update car ratings
        const carId = booking.car;
        const reviews = await Review.find({ car: carId });

        const totalRating = reviews.reduce((acc, item) => item.rating + acc, 0);
        const averageRating = totalRating / reviews.length;

        await Car.findByIdAndUpdate(carId, {
            'ratings.average': averageRating,
            'ratings.count': reviews.length,
        });

        res.status(201).json(review);
    } catch (error) {
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get reviews for a car
// @route   GET /api/reviews/:carId
// @access  Public
export const getCarReviews = async (req, res) => {
    try {
        const { carId } = req.params;

        const reviews = await Review.find({ car: carId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
