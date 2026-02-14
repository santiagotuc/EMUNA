const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Verifica que estos nombres coincidan con tus variables en Render
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "emuna_productos",
    allowed_formats: ["jpg", "png", "jpeg"],
    // Borra cualquier otra línea que tengas aquí por ahora
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
