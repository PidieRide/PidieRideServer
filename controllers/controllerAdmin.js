const { Admin, Customer, Driver, Partner, Order, Delivery, Constant } = require('../models');
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

     // === CRUD Constant ===

    // Create Constant
    static async createConstant(req, res, next) {
        try {
            const { type, pricePerKM, serviceFee } = req.body;
            const constant = await Constant.create({ type, pricePerKM, serviceFee });
            res.status(201).json({ message: "Constant created", constant });
        } catch (err) {
            next(err);
        }
    }

    // Read All Constants
    static async listConstants(req, res, next) {
        try {
            const constants = await Constant.findAll();
            res.json(constants);
        } catch (err) {
            next(err);
        }
    }

    // Read One Constant by ID
    static async getConstant(req, res, next) {
        try {
            const { id } = req.params;
            const constant = await Constant.findByPk(id);
            if (!constant) {
                return res.status(404).json({ message: "Constant not found" });
            }
            res.json(constant);
        } catch (err) {
            next(err);
        }
    }

    // Update Constant
    static async updateConstant(req, res, next) {
        try {
            const { id } = req.params;
            const { type, pricePerKM, serviceFee } = req.body;

            const constant = await Constant.findByPk(id);
            if (!constant) {
                return res.status(404).json({ message: "Constant not found" });
            }

            await constant.update({ type, pricePerKM, serviceFee });
            res.json({ message: "Constant updated", constant });
        } catch (err) {
            next(err);
        }
    }

    // Delete Constant
    static async deleteConstant(req, res, next) {
        try {
            const { id } = req.params;
            const constant = await Constant.findByPk(id);
            if (!constant) {
                return res.status(404).json({ message: "Constant not found" });
            }

            await constant.destroy();
            res.json({ message: "Constant deleted" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ControllerAdmin;
