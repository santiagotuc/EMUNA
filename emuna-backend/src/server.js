require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Conectar a MongoDb Atlas
connectDB();

// Middlewares
app.use(helmet({ contentSecurityPolicy: false })); // Ajuste para que se vean las fotos de Cloudinary
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// --- ESTA LÍNEA ES LA QUE FALTABA ---
// Permite que el servidor entienda los datos del formulario (FormData)
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get("/", (req, res) => {
  res.json("🌿API DE EMUNA Funcionando correctamente");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
