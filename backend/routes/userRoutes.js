import express from 'express';
import {
  loginUser,
  registerUser,
  adminLogin,
  forgotPassword,
  resetPassword,
  resendOtp,
  getUserData,
  getUserById,
  toggleFavorite,
  getFavorites

} from '../controllers/userController.js';
import { authUser } from '../middleware/auth.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.post('/admin', adminLogin);
userRoutes.post('/forgot-password', forgotPassword);
userRoutes.post('/reset-password', resetPassword);
userRoutes.post('/resend-otp', resendOtp);
userRoutes.get('/data', getUserData);

// Favorites/Wishlist
userRoutes.post('/favorites-toggle', authUser, toggleFavorite);
userRoutes.get('/favorites', authUser, getFavorites);

userRoutes.get('/:userId', getUserById);

export default userRoutes;