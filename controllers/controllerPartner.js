const { Partner, Menu, Order } = require('../models');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jwt');
const cloudinary = require('../helpers/cloudinary');

class ControllerPartner {
    // 3.1 Auth & Profile
    static async register(req, res, next) {
        try {
            const { name, email, password, phone, address } = req.body;
            const partner = await Partner.create({ name, email, password, phone, address });
            res.status(201).json({ message: 'Register success', partner });
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const partner = await Partner.findOne({ where: { email } });
            if (!partner || !bcrypt.comparePassword(password, partner.password)) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.generateToken({ id: partner.id, role: 'partner' });
            res.json({ token });
        } catch (err) {
            next(err);
        }
    }

    static async logout(req, res) {
        res.json({ message: 'Logout success' });
    }

    static async refreshToken(req, res) {
        res.json({ token: jwt.generateToken({ id: req.user.id, role: 'partner' }) });
    }

    static async getProfile(req, res, next) {
        try {
            const profile = await Partner.findByPk(req.user.id);
            res.json(profile);
        } catch (err) {
            next(err);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            await Partner.update(req.body, { where: { id: req.user.id } });
            res.json({ message: 'Profile updated' });
        } catch (err) {
            next(err);
        }
    }

    static async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            const partner = await Partner.findByPk(req.user.id);
            if (!bcrypt.comparePassword(oldPassword, partner.password)) {
                return res.status(400).json({ message: 'Wrong password' });
            }
            await Partner.update({ password: bcrypt.hashPassword(newPassword) }, { where: { id: req.user.id } });
            res.json({ message: 'Password changed' });
        } catch (err) {
            next(err);
        }
    }

    static async uploadLogo(req, res, next) {
        try {
            const file = req.file;
            const result = await cloudinary.upload(file.path);
            await Partner.update({ logoUrl: result.secure_url }, { where: { id: req.user.id } });
            res.json({ message: 'Logo updated', logoUrl: result.secure_url });
        } catch (err) {
            next(err);
        }
    }

    // 3.2 Menu Management
    static async listMenu(req, res, next) {
        try {
            const menus = await Menu.findAll({ where: { partnerId: req.user.id } });
            res.json(menus);
        } catch (err) {
            next(err);
        }
    }

    static async addMenuItem(req, res, next) {
        try {
            const menu = await Menu.create({ ...req.body, partnerId: req.user.id });
            res.status(201).json(menu);
        } catch (err) {
            next(err);
        }
    }

    static async updateMenuItem(req, res, next) {
        try {
            await Menu.update(req.body, { where: { id: req.params.menuId, partnerId: req.user.id } });
            res.json({ message: 'Menu updated' });
        } catch (err) {
            next(err);
        }
    }

    static async deleteMenuItem(req, res, next) {
        try {
            await Menu.destroy({ where: { id: req.params.menuId, partnerId: req.user.id } });
            res.json({ message: 'Menu deleted' });
        } catch (err) {
            next(err);
        }
    }

    // 3.3 Order Management
    static async getIncomingOrders(req, res, next) {
        try {
            const orders = await Order.findAll({ where: { partnerId: req.user.id, status: 'pending' } });
            res.json(orders);
        } catch (err) {
            next(err);
        }
    }

    static async orderDetails(req, res, next) {
        try {
            const order = await Order.findByPk(req.params.orderId, { include: ['orderitems'] });
            res.json(order);
        } catch (err) {
            next(err);
        }
    }

    static async acceptOrder(req, res, next) {
        try {
            await Order.update({ status: 'accepted' }, { where: { id: req.params.orderId, partnerId: req.user.id } });
            res.json({ message: 'Order accepted' });
        } catch (err) {
            next(err);
        }
    }

    static async rejectOrder(req, res, next) {
        try {
            await Order.update({ status: 'rejected' }, { where: { id: req.params.orderId, partnerId: req.user.id } });
            res.json({ message: 'Order rejected' });
        } catch (err) {
            next(err);
        }
    }

    static async markOrderReady(req, res, next) {
        try {
            await Order.update({ status: 'ready' }, { where: { id: req.params.orderId, partnerId: req.user.id } });
            res.json({ message: 'Order ready' });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ControllerPartner;
