import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Car from '../models/Car.js';
import Coupon from '../models/Coupon.js';

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
    try {
        const { carId, pickupDate, dropDate, paymentMethod, couponCode } = req.body;

        // Validate dates
        const pickup = new Date(pickupDate);
        const drop = new Date(dropDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (pickup < today) {
            return res.status(400).json({ message: 'Pickup date cannot be in the past' });
        }

        if (drop <= pickup) {
            return res.status(400).json({ message: 'Drop date must be after pickup date' });
        }

        // Validate operating hours (7 AM - 10 PM)
        const pickupHour = pickup.getHours();
        const dropHour = drop.getHours();

        if (pickupHour < 7 || pickupHour > 22) {
            return res.status(400).json({ message: 'Pickup time must be between 7 AM and 10 PM' });
        }

        if (dropHour < 7 || dropHour > 22) {
            return res.status(400).json({ message: 'Drop time must be between 7 AM and 10 PM' });
        }

        // Check car exists
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Check availability - look for overlapping bookings
        const overlappingBooking = await Booking.findOne({
            car: carId,
            status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    pickupDate: { $lte: drop },
                    dropDate: { $gte: pickup },
                },
            ],
        });

        if (overlappingBooking) {
            return res.status(400).json({
                message: 'Car is not available for the selected dates'
            });
        }

        // Calculate total days and amount
        // Calculate total days and amount (24-hour cycle)
        const diffTime = Math.abs(drop - pickup);
        const diffHours = diffTime / (1000 * 60 * 60);
        const totalDays = Math.ceil(diffHours / 24);

        // Ensure at least 1 day charge
        const chargeableDays = totalDays > 0 ? totalDays : 1;
        const originalAmount = chargeableDays * car.pricePerDay;
        let discount = 0;
        let finalAmount = originalAmount;

        // Handle coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (!coupon) {
                return res.status(400).json({ message: 'Invalid coupon code' });
            }

            // Validate coupon
            const validityCheck = coupon.isValid();
            if (!validityCheck.valid) {
                return res.status(400).json({ message: validityCheck.message });
            }

            // Check minimum booking amount
            if (originalAmount < coupon.minBookingAmount) {
                return res.status(400).json({
                    message: `Minimum booking amount is ₹${coupon.minBookingAmount}`
                });
            }

            // Check car type applicability
            if (coupon.applicableTo === 'specific' && !coupon.carTypes.includes(car.type)) {
                return res.status(400).json({
                    message: 'Coupon not applicable to this car type'
                });
            }

            // Calculate discount
            discount = coupon.calculateDiscount(originalAmount);
            finalAmount = originalAmount - discount;

            // Increment coupon usage
            coupon.usedCount += 1;
            await coupon.save();
        }

        // Create booking
        const booking = await Booking.create({
            user: req.user._id,
            car: carId,
            pickupDate: pickup,
            dropDate: drop,
            totalDays,
            originalAmount,
            discount,
            totalAmount: finalAmount,
            couponCode: couponCode ? couponCode.toUpperCase() : undefined,
            paymentMethod,
            paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
            status: 'pending',
        });

        // Populate car and user details
        await booking.populate('car');
        await booking.populate('user', 'name email phone');

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('car')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('car')
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = status;

        // If booking is completed and payment method is cash, mark payment as completed
        if (status === 'completed' && booking.paymentMethod === 'cash') {
            booking.paymentStatus = 'completed';

            // Create or update payment record
            await Payment.findOneAndUpdate(
                { booking: booking._id },
                {
                    booking: booking._id,
                    user: booking.user,
                    amount: booking.totalAmount,
                    paymentMethod: 'cash',
                    status: 'completed',
                },
                { upsert: true, new: true }
            );
        }

        await booking.save();

        await booking.populate('car');
        await booking.populate('user', 'name email phone');

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('car')
            .populate('user', 'name email phone');

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns this booking or is admin
        if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this booking' });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
