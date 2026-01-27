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
