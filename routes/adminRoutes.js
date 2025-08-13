const express = require("express");
const router = express.Router();
const ControllerAdmin = require("../controllers/controllerAdmin");
const authMiddleware = require("../middlewares/authMiddleware");

// Auth
router.post("/register", ControllerAdmin.register);
router.post("/login", ControllerAdmin.login);

// Dashboard
router.get("/dashboard", authMiddleware, ControllerAdmin.dashboardStats);

// Data Management
router.get("/customers", authMiddleware, ControllerAdmin.listCustomers);
router.get("/drivers", authMiddleware, ControllerAdmin.listDrivers);
router.get("/partners", authMiddleware, ControllerAdmin.listPartners);
router.get("/orders", authMiddleware, ControllerAdmin.listOrders);
router.get("/rides", authMiddleware, ControllerAdmin.listRides);

module.exports = router;
