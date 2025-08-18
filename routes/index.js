const express = require("express");
const routes = express.Router();
const adminRoutes = require("./adminRoutes");
const customerRoutes = require("./customerRoutes");
const driverRoutes = require("./driverRoutes");
const partnerRoutes = require("./partnerRoutes");

// routes.get("/", (req, res) => {
//     res.send("Berhasil Masuk API Pidie Ride");
// });
routes.use("/admin", adminRoutes);
routes.use("/customers", customerRoutes);
routes.use("/drivers", driverRoutes);
routes.use("/partners", partnerRoutes);
module.exports = routes;