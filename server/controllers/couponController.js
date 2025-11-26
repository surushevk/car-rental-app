import Coupon from '../models/Coupon.js';

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);

        res.status(201).json({
            success: true,
            data: coupon,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort('-createdAt');

        res.status(200).json({
            success: true,
            count: coupons.length,
            data: coupons,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found',
            });
        }

        res.status(200).json({
            success: true,
            data: coupon,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Validate coupon and calculate discount
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res) => {
    try {
        const { code, bookingAmount, carType } = req.body;

        // Find coupon
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code',
            });
        }

        // Check if coupon is valid
        const validityCheck = coupon.isValid();
        if (!validityCheck.valid) {
            return res.status(400).json({
                success: false,
                message: validityCheck.message,
            });
        }

        // Check minimum booking amount
        if (bookingAmount < coupon.minBookingAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum booking amount is ₹${coupon.minBookingAmount}`,
            });
        }

        // Check car type applicability
        if (coupon.applicableTo === 'specific' && !coupon.carTypes.includes(carType)) {
            return res.status(400).json({
                success: false,
                message: 'Coupon not applicable to this car type',
            });
        }

        // Calculate discount
        const discount = coupon.calculateDiscount(bookingAmount);
        const finalAmount = bookingAmount - discount;

        res.status(200).json({
            success: true,
            data: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discount,
                originalAmount: bookingAmount,
                finalAmount,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get active coupons
// @route   GET /api/coupons/active
// @access  Private
export const getActiveCoupons = async (req, res) => {
    try {
        const now = new Date();

        const coupons = await Coupon.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
        }).select('code discountType discountValue minBookingAmount validUntil');

        res.status(200).json({
            success: true,
            count: coupons.length,
            data: coupons,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};
