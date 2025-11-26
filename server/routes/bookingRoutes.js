import express from 'express';
import {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    getBookingById,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

const router = express.Router();

router.route('/')
    .post(protect, createBooking);

router.get('/user', protect, getUserBookings);
router.get('/admin', protect, admin, getAllBookings);

router.route('/:id')
    .get(protect, getBookingById);

router.put('/:id/status', protect, admin, updateBookingStatus);

export default router;
