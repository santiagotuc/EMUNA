const express = require("express");
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// 1. Importamos el middleware de autenticación que creamos recién
const auth = require("../middleware/authMiddleware");

// 2. Definimos las rutas

// Esta ruta sigue siendo PÚBLICA (sin "auth")
// Para que cualquier cliente que entre a la web vea las plantas y artesanías
router.get("/", getProducts);

// Estas rutas ahora son PRIVADAS (con "auth")
// Si alguien intenta usar el Modal de "Nuevo Producto" o los botones de
// "Editar" o "Eliminar" sin estar logueado, el servidor los rechazará.
router.post("/", auth, createProduct);
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;
