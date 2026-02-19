require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// 1. Conectar a Base de Datos
connectDB();

// 2. Middlewares de Configuración (Deben ir antes de las rutas)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan("dev"));

// IMPORTANTE: Estos procesan los datos del formulario
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Rutas
app.get("/", (req, res) => {
  res.json("🌿 API DE EMUNA Funcionando correctamente");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// --- NUEVO: MANEJO DE ERRORES GLOBAL (El "Atrapalotodo") ---
// Este código debe ir SIEMPRE DESPUÉS de las rutas y ANTES del app.listen
app.use((err, req, res, next) => {
  console.error("🔥 ERROR CAPTURADO POR EL SERVER (Middleware Global):");

  // Imprimimos el error completo para verlo en los Logs de Render
  console.error(err);

  // 1. Si el error es por peso de archivo (Multer)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "La imagen es demasiado pesada. El límite permitido es de 5MB.",
    });
  }

  // 2. Si el error viene de Cloudinary (a veces traen http_code)
  if (err.http_code) {
    return res.status(err.http_code).json({
      message: err.message || "Error en el servicio de imágenes (Cloudinary)",
    });
  }

  // 3. Error genérico (evita que el frontend reciba HTML roto)
  res.status(500).json({
    message:
      "Ocurrió un error inesperado en el servidor. Revisa los logs de Render.",
    error: err.message || "Error desconocido",
  });
});

// 4. Encender Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
