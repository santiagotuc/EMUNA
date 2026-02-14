const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const uploadCloud = require("../config/cloudinaryConfig");

// Obtener productos (Público)
router.get("/", productController.getProducts);

// --- CAMBIO AQUÍ: Multer va ANTES que Auth ---
// Esto permite que Multer lea el formulario y llene el req.body
// antes de que el servidor intente validar al usuario.
router.post(
  "/",
  uploadCloud.single("image"),
  auth,
  productController.createProduct,
);

router.put(
  "/:id",
  uploadCloud.single("image"),
  auth,
  productController.updateProduct,
);

// Eliminar
router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;
