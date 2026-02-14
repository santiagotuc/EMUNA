const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const uploadCloud = require("../config/cloudinaryConfig"); // <-- ESTO ES CLAVE

// Obtener productos (Público)
router.get("/", productController.getProducts);

// Crear producto (Protegido + Multer)
// "image" debe ser igual al nombre que pusimos en el FormData del App.js
router.post(
  "/",
  auth,
  uploadCloud.single("image"),
  productController.createProduct,
);

// Actualizar producto (Protegido + Multer)
router.put(
  "/:id",
  auth,
  uploadCloud.single("image"),
  productController.updateProduct,
);

// Eliminar
router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;
