import express from 'express';
import {
    getCities,
    getAllCities,
    addCity,
    updateCity,
    deleteCity,
} from '../controllers/cityController.js';
import { protect } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';

const router = express.Router();

// Public route - get active cities
router.get('/', getCities);

// Admin routes
router.get('/all', protect, admin, getAllCities);
router.post('/', protect, admin, addCity);
router.put('/:id', protect, admin, updateCity);
router.delete('/:id', protect, admin, deleteCity);

export default router;
