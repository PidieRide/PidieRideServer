const {
    Customer,
    Order,
    Menu,
    Partner,
    Payment,
    Delivery,
} = require("../models");
const bcrypt = require("../helpers/bcrypt");
const jwt = require("../helpers/jwt");
const cloudinary = require("../helpers/cloudinary");
const responseJson = require("../helpers/response");

class ControllerCustomer {
    // 1.1 Auth & Profile
    static async register(req, res, next) {
        try {
            const { name, email, password, phone } = req.body;
            if (!email || !password) {
                throw { name: "EmailOrPasswordRequired" };
            }

            const existing = await Customer.findOne({ where: { email } });
            if (existing) {
                throw {
                    name: "SequelizeUniqueConstraintError",
                    errors: [{ message: "Email already registered" }],
                };
            }
            const customer = await Customer.create({
                fullName: name,
                email,
                password,
                phone,
                isDeleted: false,
            });
            responseJson(res, 1, customer);
        } catch (err) {
            next(err);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                throw { name: "EmailOrPasswordRequired" };
            }

            const customer = await Customer.findOne({
                where: { email, isDeleted: false },
            });
            if (
                !customer ||
                !(await bcrypt.compareHash(password, customer.password))
            ) {
                throw { name: "InvalidCredentials" };
            }
            const token = await jwt.generateToken({
                id: customer.id,
                role: "customer",
            });
            responseJson(res, 0, { token });
            // res.json({ token });
        } catch (err) {
            next(err);
        }
    }

    static async logout(req, res) {
        responseJson(res, 0, { message: "Logout success" });
    }

    static async refreshToken(req, res) {
        responseJson(res, 0, {
            token: jwt.generateToken({ id: req.user.id, role: "customer" }),
        });
    }

    static async getProfile(req, res, next) {
        try {
            const profile = await Customer.findOne({
                where: { id: req.user.id, isDeleted: false },
                attributes: { exclude: ["password"] },
            });
            responseJson(res, 0, profile);
        } catch (err) {
            next(err);
        }
    }

    static async updateProfile(req, res, next) {
        try {
            let data = await Customer.update(req.body, {
                where: { id: req.user.id },
            });
            responseJson(res, 2, data);
        } catch (err) {
            next(err);
        }
    }

    static async changePassword(req, res, next) {
        try {
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) {
                throw {
                    name: "ValidationError",
                    errors: [{ message: "Old and new password are required" }],
                };
            }

            const customer = await Customer.findByPk(req.user.id);
            if (!customer) throw { name: "errorNotFound" };
            if (!(await bcrypt.compareHash(oldPassword, customer.password))) {
                throw { name: "InvalidCredentials" };
            }
            let data = await Customer.update(
                { password: await bcrypt.hashPassword(newPassword) },
                { where: { id: req.user.id } }
            );
            responseJson(res, 2, data);
            // res.json({ message: "Password changed" });
        } catch (err) {
            next(err);
        }
    }

    static async uploadProfilePhoto(req, res, next) {
        try {
            const file = req.file;
            const result = await cloudinary.upload(file.path);
            await Customer.update(
                { photoUrl: result.secure_url },
                { where: { id: req.user.id } }
            );
            responseJson(res, 1, {
                message: "Photo updated",
                photoUrl: result.secure_url,
            });
        } catch (err) {
            next(err);
        }
    }

    static async deleteAccount(req, res, next) {
        try {
            const customer = await Customer.findOne({
                where: { id: req.user.id, isDeleted: false },
            });

            if (!customer) {
                return res
                    .status(404)
                    .json({ message: "Customer not found or already deleted" });
            }

            let data = await Customer.update(
                { isDeleted: true },
                { where: { id: req.user.id } }
            );

            responseJson(res, 3, data);
            // res.json({ message: "Account deleted (soft delete)" });
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
                status: "pending",
            });
            responseJson(res, 1, ride);
            // res.status(201).json(ride);
        } catch (err) {
            next(err);
        }
    }

    static async rideStatus(req, res, next) {
        try {
            const ride = await Delivery.findByPk(req.params.rideId);
            responseJson(res, 0, ride);
            // res.json(ride);
        } catch (err) {
            next(err);
        }
    }

    static async rideHistory(req, res, next) {
        try {
            const rides = await Delivery.findAll({
                where: { customerId: req.user.id },
            });
            responseJson(res, 0, rides);
            // res.json(rides);
        } catch (err) {
            next(err);
        }
    }

    static async cancelRide(req, res, next) {
        try {
            let data = await Delivery.update(
                { status: "cancelled" },
                { where: { id: req.params.rideId, customerId: req.user.id } }
            );
            responseJson(res, 2, data);
            // res.json({ message: "Ride cancelled" });
        } catch (err) {
            next(err);
        }
    }

    // 1.3 Food Delivery
    static async foodCategories(req, res, next) {
        try {
            const categories = await Menu.findAll({
                attributes: ["category"],
                group: ["category"],
            });
            responseJson(res, 0, categories);
            // res.json(categories);
        } catch (err) {
            next(err);
        }
    }

    static async listRestaurants(req, res, next) {
        try {
            const restaurants = await Partner.findAll();
            responseJson(res, 0, restaurants);
            // res.json(restaurants);
        } catch (err) {
            next(err);
        }
    }

    static async restaurantDetails(req, res, next) {
        try {
            const restaurant = await Partner.findByPk(req.params.id, {
                include: Menu,
            });
            responseJson(res, 0, restaurant);
            // res.json(restaurant);
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
                status: "pending",
            });
            for (let item of items) {
                await order.createOrderitem(item);
            }
            responseJson(res, 1, order);
            // res.status(201).json(order);
        } catch (err) {
            next(err);
        }
    }

    static async foodOrderStatus(req, res, next) {
        try {
            const order = await Order.findByPk(req.params.orderId, {
                include: ["orderitems"],
            });
            responseJson(res, 0, order);
            // res.json(order);
        } catch (err) {
            next(err);
        }
    }

    static async foodOrderHistory(req, res, next) {
        try {
            const orders = await Order.findAll({
                where: { customerId: req.user.id },
            });
            responseJson(res, 0, orders);
            // res.json(orders);
        } catch (err) {
            next(err);
        }
    }

    static async cancelFoodOrder(req, res, next) {
        try {
            let data = await Order.update(
                { status: "cancelled" },
                { where: { id: req.params.orderId, customerId: req.user.id } }
            );
            responseJson(res, 2, data);
            // res.json({ message: "Order cancelled" });
        } catch (err) {
            next(err);
        }
    }

    // 1.4 Payment
    static async paymentMethods(req, res) {
        responseJson(res, 0, [
            { id: 1, name: "Cash" },
            { id: 2, name: "Wallet" },
        ]);
        // res.json([
        //     { id: 1, name: "Cash" },
        //     { id: 2, name: "Wallet" },
        // ]);
    }

    static async topupWallet(req, res, next) {
        try {
            const { amount } = req.body;
            const payment = await Payment.create({
                customerId: req.user.id,
                amount,
                type: "topup",
                status: "completed",
            });
            responseJson(res, 1, payment);
            // res.status(201).json(payment);
        } catch (err) {
            next(err);
        }
    }

    static async walletBalance(req, res, next) {
        try {
            const payments = await Payment.findAll({
                where: { customerId: req.user.id },
            });
            const balance = payments.reduce(
                (acc, p) => acc + (p.type === "topup" ? p.amount : -p.amount),
                0
            );
            responseJson(res, 0, { balance });
            // res.json({ balance });
        } catch (err) {
            next(err);
        }
    }

    static async walletHistory(req, res, next) {
        try {
            const payments = await Payment.findAll({
                where: { customerId: req.user.id },
            });
            responseJson(res, 0, payments);
            res.json(payments);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ControllerCustomer;
