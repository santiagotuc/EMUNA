require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");

// 1. Inicializar la aplicacion
const app = express();

// 2. Conectar a MongoDb Atlas
connectDB();

// 3. Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
