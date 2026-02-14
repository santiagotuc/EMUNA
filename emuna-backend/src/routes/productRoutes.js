const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../middleware/authMiddleware");
const uploadCloud = require("../config/cloudinaryConfig"); // Importamos Multer

// El GET sigue igual
router.get("/", productController.getProducts);

// El POST ahora acepta un archivo llamado 'image'
router.post(
  "/",
  auth,
  uploadCloud.single("image"),
  productController.createProduct,
);

// El PUT también para cuando quiera cambiar la foto
router.put(
  "/:id",
  auth,
  uploadCloud.single("image"),
  productController.updateProduct,
);

router.delete("/:id", auth, productController.deleteProduct);

module.exports = router;
