const { Client } = require("pg");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}


const isProduction = process.env.NODE_ENV === "production";

const client = new Client({
  connectionString: process.env.DATABASE_URL ,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

client.connect()
  .then(() => {
    console.log("✅ Connected to Postgres!");
    console.log(process.env.DATABASE_URL);
    return client.end();
  })
  .catch(err => console.error("❌ DB error:", err));