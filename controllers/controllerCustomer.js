const { Customer, Order, Menu, Partner, Payment, Delivery } = require('../models');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const cloudinary = require('../helpers/cloudinary');

class ControllerCustomer {
    // 1.1 Auth & Profile
    static async register(req, res, next) {
        try {
            const { name, email, password, phone } = req.body;
            const customer = await Customer.create({ name, email, password, phone });
            res.status(201).json({ message: 'Register success', customer });
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const customer = await Customer.findOne({ where: { email } });
            if (!customer || !bcrypt.comparePassword(password, customer.password)) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.generateToken({ id: customer.id, role: 'customer' });
            res.json({ token });
        } catch (err) {
            next(err);
        }
    }

    static async logout(req, res) {
        res.json({ message: 'Logout success' });
    }

    static async refreshToken(req, res) {
        res.json({ token: jwt.generateToken({ id: req.user.id, role: 'customer' }) });
    }

    static async getProfile(req, res, next) {
        try {
            const profile = await Customer.findByPk(req.user.id);
            res.json(profile);
        } catch (err) {
            next(err);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            await Customer.update(req.body, { where: { id: req.user.id } });
            res.json({ message: 'Profile updated' });
        } catch (err) {
            next(err);
        }
    }

    static async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const customer = await Customer.findByPk(req.user.id);
            if (!bcrypt.comparePassword(oldPassword, customer.password)) {
                return res.status(400).json({ message: 'Wrong password' });
            }
            await Customer.update({ password: bcrypt.hashPassword(newPassword) }, { where: { id: req.user.id } });
            res.json({ message: 'Password changed' });
        } catch (err) {
            next(err);
        }
    }

    static async uploadProfilePhoto(req, res, next) {
        try {
            const file = req.file;
            const result = await cloudinary.upload(file.path);
            await Customer.update({ photoUrl: result.secure_url }, { where: { id: req.user.id } });
            res.json({ message: 'Photo updated', photoUrl: result.secure_url });
        } catch (err) {
            next(err);
        }
    }

    // 1.2 Ride Service
    static async requestRide(req, res, next) {
        try {
            const { pickupLocation, dropLocation } = req.body;
            const ride = await Delivery.create({
                customerId: req.user.id,
                pickupLocation,
                dropLocation,
                status: 'pending'
            });
            res.status(201).json(ride);
        } catch (err) {
            next(err);
        }
    }

    static async rideStatus(req, res, next) {
        try {
            const ride = await Delivery.findByPk(req.params.rideId);
            res.json(ride);
        } catch (err) {
            next(err);
        }
    }

    static async rideHistory(req, res, next) {
        try {
            const rides = await Delivery.findAll({ where: { customerId: req.user.id } });
            res.json(rides);
        } catch (err) {
            next(err);
        }
    }

    static async cancelRide(req, res, next) {
        try {
            await Delivery.update({ status: 'cancelled' }, { where: { id: req.params.rideId, customerId: req.user.id } });
            res.json({ message: 'Ride cancelled' });
        } catch (err) {
            next(err);
        }
    }

    // 1.3 Food Delivery
    static async foodCategories(req, res, next) {
        try {
            const categories = await Menu.findAll({ attributes: ['category'], group: ['category'] });
            res.json(categories);
        } catch (err) {
            next(err);
        }
    }

    static async listRestaurants(req, res, next) {
        try {
            const restaurants = await Partner.findAll();
            res.json(restaurants);
        } catch (err) {
            next(err);
        }
    }

    static async restaurantDetails(req, res, next) {
        try {
            const restaurant = await Partner.findByPk(req.params.id, { include: Menu });
            res.json(restaurant);
        } catch (err) {
            next(err);
        }
    }

    static async createFoodOrder(req, res, next) {
        try {
            const { items, partnerId } = req.body;
            const order = await Order.create({
                customerId: req.user.id,
                partnerId,
                status: 'pending'
            });
            for (let item of items) {
                await order.createOrderitem(item);
            }
            res.status(201).json(order);
        } catch (err) {
            next(err);
        }
    }

    static async foodOrderStatus(req, res, next) {
        try {
            const order = await Order.findByPk(req.params.orderId, { include: ['orderitems'] });
            res.json(order);
        } catch (err) {
            next(err);
        }
    }

    static async foodOrderHistory(req, res, next) {
        try {
            const orders = await Order.findAll({ where: { customerId: req.user.id } });
            res.json(orders);
        } catch (err) {
            next(err);
        }
    }

    static async cancelFoodOrder(req, res, next) {
        try {
            await Order.update({ status: 'cancelled' }, { where: { id: req.params.orderId, customerId: req.user.id } });
            res.json({ message: 'Order cancelled' });
        } catch (err) {
            next(err);
        }
    }

    // 1.4 Payment
    static async paymentMethods(req, res) {
        res.json([{ id: 1, name: 'Cash' }, { id: 2, name: 'Wallet' }]);
    }

    static async topupWallet(req, res, next) {
        try {
            const { amount } = req.body;
            const payment = await Payment.create({
                customerId: req.user.id,
                amount,
                type: 'topup',
                status: 'completed'
            });
            res.status(201).json(payment);
        } catch (err) {
            next(err);
        }
    }

    static async walletBalance(req, res, next) {
        try {
            const payments = await Payment.findAll({ where: { customerId: req.user.id } });
            const balance = payments.reduce((acc, p) => acc + (p.type === 'topup' ? p.amount : -p.amount), 0);
            res.json({ balance });
        } catch (err) {
            next(err);
        }
    }

    static async walletHistory(req, res, next) {
        try {
            const payments = await Payment.findAll({ where: { customerId: req.user.id } });
            res.json(payments);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ControllerCustomer;
