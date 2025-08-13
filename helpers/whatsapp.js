// helpers/whatsapp.js
const axios = require("axios");

// Base URL API WhatsApp (ganti sesuai API Pidieride)
const WA_API_URL = "https://api.pidieride.com/whatsapp/send";
const WA_TOKEN = process.env.WA_TOKEN || "ISI_TOKEN_API_WA_DISINI";

async function sendWhatsApp(to, message) {
    try {
        const response = await axios.post(
            WA_API_URL,
            {
                phone: to,      // Nomor tujuan (format internasional tanpa +)
                message: message
            },
            {
                headers: {
                    Authorization: `Bearer ${WA_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        console.error("Error kirim WhatsApp:", error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = { sendWhatsApp };
