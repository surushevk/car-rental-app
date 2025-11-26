import express from 'express';
import {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar,
} from '../controllers/carController.js';
import { protect } from '../middlewares/auth.js';
import { admin } from '../middlewares/admin.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.route('/')
    .get(getCars)
    .post(protect, admin, upload.array('images', 5), createCar);

router.route('/:id')
    .get(getCarById)
    .put(protect, admin, upload.array('images', 5), updateCar)
    .delete(protect, admin, deleteCar);

export default router;
