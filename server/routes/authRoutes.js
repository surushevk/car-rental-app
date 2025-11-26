import express from 'express';
import { register, login, getMe, createAdmin, getAllAdmins, deleteAdmin, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { superAdminOnly } from '../middlewares/superAdminAuth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resetToken', resetPassword);

// Super Admin routes
router.post('/create-admin', protect, superAdminOnly, createAdmin);
router.get('/admins', protect, superAdminOnly, getAllAdmins);
router.delete('/admins/:id', protect, superAdminOnly, deleteAdmin);

export default router;
