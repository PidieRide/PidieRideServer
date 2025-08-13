const { Admin, Customer, Driver, Partner, Order, Delivery } = require('../models');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');

class ControllerAdmin {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const admin = await Admin.create({ name, email, password });
            res.status(201).json({ message: 'Admin created', admin });
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const admin = await Admin.findOne({ where: { email } });
            if (!admin || !bcrypt.comparePassword(password, admin.password)) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.generateToken({ id: admin.id, role: 'admin' });
            res.json({ token });
        } catch (err) {
            next(err);
        }
    }

    static async dashboardStats(req, res, next) {
        try {
            const customers = await Customer.count();
            const drivers = await Driver.count();
            const partners = await Partner.count();
            const orders = await Order.count();
            const rides = await Delivery.count();
            res.json({ customers, drivers, partners, orders, rides });
        } catch (err) {
            next(err);
        }
    }

    static async listCustomers(req, res, next) {
        try {
            const customers = await Customer.findAll();
            res.json(customers);
        } catch (err) {
            next(err);
        }
    }

    static async listDrivers(req, res, next) {
        try {
            const drivers = await Driver.findAll();
            res.json(drivers);
        } catch (err) {
            next(err);
        }
    }

    static async listPartners(req, res, next) {
        try {
            const partners = await Partner.findAll();
            res.json(partners);
        } catch (err) {
            next(err);
        }
    }

    static async listOrders(req, res, next) {
        try {
            const orders = await Order.findAll();
            res.json(orders);
        } catch (err) {
            next(err);
        }
    }

    static async listRides(req, res, next) {
        try {
            const rides = await Delivery.findAll();
            res.json(rides);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ControllerAdmin;
