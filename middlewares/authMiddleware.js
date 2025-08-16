const jwtHelper = require("../helpers/jwt");
const { Customer, Driver, Partner, Admin } = require("../models");

module.exports = async function authMiddleware(req, res, next) {
    console.log("masuk auth", req.headers);
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Token missing" });
        }

        const token = authHeader.split(" ")[1];
        const payload = await jwtHelper.decodeToken(token); // verifyToken dari helpers/jwt.js
        console.log("payload: ", payload);
        if (!payload || !payload.id || !payload.role) {
            return res
                .status(401)
                .json({ message: "Unauthorized: Invalid token payload" });
        }

        let user;
        switch (payload.role) {
            case "customer":
                user = await Customer.findByPk(payload.id);
                break;
            case "driver":
                user = await Driver.findByPk(payload.id);
                break;
            case "partner":
                user = await Partner.findByPk(payload.id);
                break;
            case "admin":
                user = await Admin.findByPk(payload.id);
                break;
            default:
                return res
                    .status(401)
                    .json({ message: "Unauthorized: Invalid role" });
        }

        if (!user) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        req.userRole = payload.role;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res
            .status(401)
            .json({ message: "Unauthorized: Invalid or expired token" });
    }
};
