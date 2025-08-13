const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: "profile_pictures",
        });
        return result.secure_url; // URL aman HTTPS
    } catch (err) {
        throw new Error("Gagal upload gambar: " + err.message);
    }
}

module.exports = { uploadImage };
