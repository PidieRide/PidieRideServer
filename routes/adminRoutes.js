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

// Constants CRUD (hanya bisa diakses admin yang login)
router.post("/constants", authMiddleware, ControllerAdmin.createConstant);
router.get("/constants", authMiddleware, ControllerAdmin.listConstants);
router.get("/constants/:id", authMiddleware, ControllerAdmin.getConstant);
router.put("/constants/:id", authMiddleware, ControllerAdmin.updateConstant);
router.delete("/constants/:id", authMiddleware, ControllerAdmin.deleteConstant);

module.exports = router;
