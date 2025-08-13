const multer = require("multer");
const path = require("path");

// Konfigurasi penyimpanan file sementara sebelum diupload ke Cloudinary
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // simpan sementara di folder uploads/
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${ext}`;
        cb(null, uniqueName);
    },
});

// Filter file hanya boleh gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const ext = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, gif)"));
    }
};

// Batas ukuran file (misal 5MB)
const limits = {
    fileSize: 5 * 1024 * 1024,
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
