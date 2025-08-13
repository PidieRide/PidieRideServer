const express = require('express');
const router = express.Router();
const ControllerPartner = require('../controllers/controllerPartner');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');

// 3.1 Auth & Profile
router.post('/register', ControllerPartner.register);
router.post('/login', ControllerPartner.login);
router.post('/logout', authMiddleware, ControllerPartner.logout);
router.post('/refresh-token', authMiddleware, ControllerPartner.refreshToken);
router.get('/profile', authMiddleware, ControllerPartner.getProfile);
router.put('/profile', authMiddleware, ControllerPartner.updateProfile);
router.put('/profile/password', authMiddleware, ControllerPartner.changePassword);
router.post('/profile/logo', authMiddleware, upload.single('logo'), ControllerPartner.uploadLogo);

// 3.2 Menu Management
router.get('/menu', authMiddleware, ControllerPartner.listMenu);
router.post('/menu', authMiddleware, ControllerPartner.addMenuItem);
router.put('/menu/:menuId', authMiddleware, ControllerPartner.updateMenuItem);
router.delete('/menu/:menuId', authMiddleware, ControllerPartner.deleteMenuItem);

// 3.3 Order Management
router.get('/orders/incoming', authMiddleware, ControllerPartner.getIncomingOrders);
router.get('/orders/:orderId', authMiddleware, ControllerPartner.orderDetails);
router.post('/orders/:orderId/accept', authMiddleware, ControllerPartner.acceptOrder);
router.post('/orders/:orderId/reject', authMiddleware, ControllerPartner.rejectOrder);
router.post('/orders/:orderId/ready', authMiddleware, ControllerPartner.markOrderReady);

module.exports = router;
