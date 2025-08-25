
const express = require('express');
const router = express.Router();
const ControllerCustomer = require('../controllers/controllerCustomer');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');

// 1.1 Auth & Profile
router.post('/register', ControllerCustomer.register);
router.post('/login', ControllerCustomer.login);
router.post('/logout', authMiddleware, ControllerCustomer.logout);
router.post('/refresh-token', authMiddleware, ControllerCustomer.refreshToken);
router.post('/delete-account', authMiddleware, ControllerCustomer.deleteAccount);

router.get('/profile', authMiddleware, ControllerCustomer.getProfile);
router.put('/profile', authMiddleware, ControllerCustomer.updateProfile);
router.put('/profile/password', authMiddleware, ControllerCustomer.changePassword);
router.post('/profile/photo', authMiddleware, upload.single('photo'), ControllerCustomer.uploadProfilePhoto);

// 1.2 Ride Service
router.post('/rides', authMiddleware, ControllerCustomer.requestRide);
router.get('/rides/:rideId', authMiddleware, ControllerCustomer.rideStatus);
router.get('/rides', authMiddleware, ControllerCustomer.rideHistory);
router.post('/rides/:rideId/cancel', authMiddleware, ControllerCustomer.cancelRide);

// 1.3 Food Delivery
router.get('/food/categories', ControllerCustomer.foodCategories);
router.get('/restaurants', ControllerCustomer.listRestaurants);
router.get('/restaurants/:id', ControllerCustomer.restaurantDetails);
router.post('/orders', authMiddleware, ControllerCustomer.createFoodOrder);
router.get('/orders/:orderId', authMiddleware, ControllerCustomer.foodOrderStatus);
router.get('/orders', authMiddleware, ControllerCustomer.foodOrderHistory);
router.post('/orders/:orderId/cancel', authMiddleware, ControllerCustomer.cancelFoodOrder);

// 1.4 Payment
router.get('/payment/methods', ControllerCustomer.paymentMethods);
router.post('/wallet/topup', authMiddleware, ControllerCustomer.topupWallet);
router.get('/wallet/balance', authMiddleware, ControllerCustomer.walletBalance);
router.get('/wallet/history', authMiddleware, ControllerCustomer.walletHistory);

module.exports = router;
