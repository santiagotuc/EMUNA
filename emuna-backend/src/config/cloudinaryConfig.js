const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// 1. Configuración de credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configuración del Almacenamiento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "emuna_productos", // Carpeta en Cloudinary
    allowed_formats: ["jpg", "png", "jpeg", "webp"], // Solo imágenes permitidas
    // TRANSFORMACIÓN AUTOMÁTICA:
    // Si la foto es gigante, la bajamos a 1000px de ancho y calidad automática
    transformation: [{ width: 1000, crop: "limit", quality: "auto" }],
  },
});

// 3. Configuración de Multer con LÍMITES
const uploadCloud = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de 5 MB (Bytes * KB * MB)
  },
});

module.exports = uploadCloud;
