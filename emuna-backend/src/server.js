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

// 4. Encender Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));
