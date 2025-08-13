const { Driver, Delivery, Order, Payment } = require('../models');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const cloudinary = require('../helpers/cloudinary');

class ControllerDriver {
    // 2.1 Auth & Profile
    static async register(req, res, next) {
        try {
            const { name, email, password, phone } = req.body;
            const driver = await Driver.create({ name, email, password, phone });
            res.status(201).json({ message: 'Register success', driver });
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const driver = await Driver.findOne({ where: { email } });
            if (!driver || !bcrypt.comparePassword(password, driver.password)) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.generateToken({ id: driver.id, role: 'driver' });
            res.json({ token });
        } catch (err) {
            next(err);
        }
    }

    static async logout(req, res) {
        res.json({ message: 'Logout success' });
    }

    static async refreshToken(req, res) {
        res.json({ token: jwt.generateToken({ id: req.user.id, role: 'driver' }) });
    }

    static async getProfile(req, res, next) {
        try {
            const profile = await Driver.findByPk(req.user.id);
            res.json(profile);
        } catch (err) {
            next(err);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            await Driver.update(req.body, { where: { id: req.user.id } });
            res.json({ message: 'Profile updated' });
        } catch (err) {
            next(err);
        }
    }

    static async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const driver = await Driver.findByPk(req.user.id);
            if (!bcrypt.comparePassword(oldPassword, driver.password)) {
                return res.status(400).json({ message: 'Wrong password' });
            }
            await Driver.update({ password: bcrypt.hashPassword(newPassword) }, { where: { id: req.user.id } });
            res.json({ message: 'Password changed' });
        } catch (err) {
            next(err);
        }
    }

    static async uploadProfilePhoto(req, res, next) {
        try {
            const file = req.file;
            const result = await cloudinary.upload(file.path);
            await Driver.update({ photoUrl: result.secure_url }, { where: { id: req.user.id } });
            res.json({ message: 'Photo updated', photoUrl: result.secure_url });
        } catch (err) {
            next(err);
        }
    }

    // 2.2 Ride Handling
    static async getNearbyRideRequests(req, res, next) {
        try {
            const rides = await Delivery.findAll({ where: { status: 'pending' } });
            res.json(rides);
        } catch (err) {
            next(err);
        }
    }

    static async acceptRide(req, res, next) {
        try {
            await Delivery.update({ status: 'accepted', driverId: req.user.id }, { where: { id: req.params.rideId } });
            res.json({ message: 'Ride accepted' });
        } catch (err) {
            next(err);
        }
    }

    static async startRide(req, res, next) {
        try {
            await Delivery.update({ status: 'ongoing' }, { where: { id: req.params.rideId, driverId: req.user.id } });
            res.json({ message: 'Ride started' });
        } catch (err) {
            next(err);
        }
    }

    static async completeRide(req, res, next) {
        try {
            await Delivery.update({ status: 'completed' }, { where: { id: req.params.rideId, driverId: req.user.id } });
            res.json({ message: 'Ride completed' });
        } catch (err) {
            next(err);
        }
    }

    static async cancelRide(req, res, next) {
        try {
            await Delivery.update({ status: 'cancelled' }, { where: { id: req.params.rideId, driverId: req.user.id } });
            res.json({ message: 'Ride cancelled' });
        } catch (err) {
            next(err);
        }
    }

    // 2.3 Food Delivery Handling
    static async getNearbyFoodOrders(req, res, next) {
        try {
            const orders = await Order.findAll({ where: { status: 'ready' } });
            res.json(orders);
        } catch (err) {
            next(err);
        }
    }

    static async acceptFoodOrder(req, res, next) {
        try {
            await Order.update({ status: 'accepted', driverId: req.user.id }, { where: { id: req.params.orderId } });
            res.json({ message: 'Order accepted' });
        } catch (err) {
            next(err);
        }
    }

    static async pickupFood(req, res, next) {
        try {
            await Order.update({ status: 'picked_up' }, { where: { id: req.params.orderId, driverId: req.user.id } });
            res.json({ message: 'Food picked up' });
        } catch (err) {
            next(err);
        }
    }

    static async deliverFood(req, res, next) {
        try {
            await Order.update({ status: 'delivering' }, { where: { id: req.params.orderId, driverId: req.user.id } });
            res.json({ message: 'Delivering food' });
        } catch (err) {
            next(err);
        }
    }

    static async completeDelivery(req, res, next) {
        try {
            await Order.update({ status: 'completed' }, { where: { id: req.params.orderId, driverId: req.user.id } });
            res.json({ message: 'Delivery completed' });
        } catch (err) {
            next(err);
        }
    }

    // 2.4 Earnings & Wallet
    static async walletBalance(req, res, next) {
        try {
            const payments = await Payment.findAll({ where: { driverId: req.user.id } });
            const balance = payments.reduce((acc, p) => acc + (p.type === 'earning' ? p.amount : -p.amount), 0);
            res.json({ balance });
        } catch (err) {
            next(err);
        }
    }

    static async walletHistory(req, res, next) {
        try {
            const payments = await Payment.findAll({ where: { driverId: req.user.id } });
            res.json(payments);
        } catch (err) {
            next(err);
        }
    }

    static async earnings(req, res, next) {
        try {
            const orders = await Order.findAll({ where: { driverId: req.user.id, status: 'completed' } });
            const total = orders.reduce((acc, o) => acc + o.fee, 0);
            res.json({ total });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ControllerDriver;
