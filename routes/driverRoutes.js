const express = require('express');
const router = express.Router();
const ControllerDriver = require('../controllers/controllerDriver');
const authMiddleware = require('../middlewares/authMiddleware');

// 2.1 Auth
router.post('/register', ControllerDriver.register);
router.post('/login', ControllerDriver.login);
router.post('/logout', authMiddleware, ControllerDriver.logout);
router.post('/refresh-token', authMiddleware, ControllerDriver.refreshToken);

// 2.2 Profile
router.get('/profile', authMiddleware, ControllerDriver.getProfile);
router.put('/profile', authMiddleware, ControllerDriver.updateProfile);
router.put('/profile/password', authMiddleware, ControllerDriver.changePassword);
router.post('/profile/photo', authMiddleware, ControllerDriver.uploadProfilePhoto);
// router.post('/profile/status', authMiddleware, ControllerDriver.updateAvailabilityStatus || ((req, res) => res.status(501).json({ message: 'Not implemented' })));

// 2.3 Rides
router.get('/rides', authMiddleware, ControllerDriver.getNearbyRideRequests);
router.post('/rides/:rideId/accept', authMiddleware, ControllerDriver.acceptRide);
router.post('/rides/:rideId/start', authMiddleware, ControllerDriver.startRide);
router.post('/rides/:rideId/complete', authMiddleware, ControllerDriver.completeRide);
router.post('/rides/:rideId/cancel', authMiddleware, ControllerDriver.cancelRide);

// 2.4 Food Deliveries
router.get('/food-orders', authMiddleware, ControllerDriver.getNearbyFoodOrders);
router.post('/food-orders/:orderId/accept', authMiddleware, ControllerDriver.acceptFoodOrder);
router.post('/food-orders/:orderId/pickup', authMiddleware, ControllerDriver.pickupFood);
router.post('/food-orders/:orderId/deliver', authMiddleware, ControllerDriver.deliverFood);
router.post('/food-orders/:orderId/complete', authMiddleware, ControllerDriver.completeDelivery);

// 2.5 Wallet & Earnings
router.get('/wallet/balance', authMiddleware, ControllerDriver.walletBalance);
router.get('/wallet/history', authMiddleware, ControllerDriver.walletHistory);
router.get('/earnings', authMiddleware, ControllerDriver.earnings);

module.exports = router;