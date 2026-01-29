require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

// 1. Inicializar la aplicacion
const app = express();

// 2. Conectar a MongoDb Atlas
connectDB();

// 3. Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 4. Rutas

app.get("/", (req, res) => {
  res.json("🌿API DE EMUNA Funcionando correctamente");
});
app.use("/api/products", productRoutes);

// 5. Configuración del puerto

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀Servidor encendido en http://localhost:${PORT}`);
});
