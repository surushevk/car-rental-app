import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide coupon code'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Please specify discount type'],
    },
    discountValue: {
        type: Number,
        required: [true, 'Please provide discount value'],
        min: 0,
    },
    minBookingAmount: {
        type: Number,
        default: 0,
        min: 0,
    },
    maxDiscount: {
        type: Number,
        min: 0,
    },
    validFrom: {
        type: Date,
        default: Date.now,
    },
    validUntil: {
        type: Date,
        required: [true, 'Please provide expiry date'],
    },
    usageLimit: {
        type: Number,
        default: null, // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    applicableTo: {
        type: String,
        enum: ['all', 'specific'],
        default: 'all',
    },
    carTypes: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();

    // Check if active
    if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };

    // Check date range
    if (now < this.validFrom) return { valid: false, message: 'Coupon is not yet valid' };
    if (now > this.validUntil) return { valid: false, message: 'Coupon has expired' };

    // Check usage limit
    if (this.usageLimit !== null && this.usedCount >= this.usageLimit) {
        return { valid: false, message: 'Coupon usage limit reached' };
    }

    return { valid: true };
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (bookingAmount) {
    let discount = 0;

    if (this.discountType === 'percentage') {
        discount = (bookingAmount * this.discountValue) / 100;
        // Apply max discount cap if set
        if (this.maxDiscount && discount > this.maxDiscount) {
            discount = this.maxDiscount;
        }
    } else {
        discount = this.discountValue;
    }

    // Discount cannot exceed booking amount
    if (discount > bookingAmount) {
        discount = bookingAmount;
    }

    return Math.round(discount);
};

export default mongoose.model('Coupon', couponSchema);
