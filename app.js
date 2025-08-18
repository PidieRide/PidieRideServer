if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const db = require("./models"); // Sequelize models/index.js

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// ✅ Tambahkan route root untuk pengecekan
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// ✅ Cek koneksi ke DB terlebih dahulu
db.sequelize
    .authenticate()
    .then(() => {
        console.log("✅ Database connected successfully via Sequelize");

        // ✅ Jalankan server hanya setelah DB siap
        app.listen(port, () => {
            console.log(`🚀 App listening on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ Unable to connect to database:", err);
        // Bisa juga: process.exit(1); untuk hentikan app dengan jelas
    });
