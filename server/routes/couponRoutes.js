import express from 'express';
const router = express.Router();
import {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    getActiveCoupons,
} from '../controllers/couponController.js';
import { protect } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

// Admin routes
router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getAllCoupons);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

// User routes
router.post('/validate', protect, validateCoupon);
router.get('/active', protect, getActiveCoupons);

export default router;
