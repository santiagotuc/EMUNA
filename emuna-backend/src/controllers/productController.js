const Product = require("../models/Product");

// 1. CREAR PRODUCTO
exports.createProduct = async (req, res) => {
  try {
    console.log("--- Petición recibida en Backend (Create) ---");

    // 1. Verificación de seguridad si el body llega vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("⚠️ Advertencia: req.body llegó vacío al controlador");
    }

    const { name, description, price, stock, category } = req.body;

    // 2. Validación de nombre (Campo obligatorio)
    if (!name) {
      return res.status(400).json({
        message: "No se recibieron los datos del producto (nombre faltante).",
      });
    }

    // 3. Procesar Imagen: Prioridad Multer (req.file) > imageURL manual > Placeholder
    let finalImage = "https://via.placeholder.com/300";

    if (req.file && req.file.path) {
      console.log("📸 Imagen recibida por Multer/Cloudinary:", req.file.path);
      finalImage = req.file.path;
    } else if (req.body.imageURL) {
      console.log("🔗 URL de imagen manual recibida:", req.body.imageURL);
      finalImage = req.body.imageURL;
    }

    const nuevoProducto = new Product({
      name,
      description: description || "",
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      category: category || "Plantas",
      imageURL: finalImage,
    });

    const productoGuardado = await nuevoProducto.save();
    console.log("✅ Producto guardado exitosamente:", productoGuardado.name);
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error("❌ ERROR AL CREAR PRODUCTO:");

    // A) Error específico: Archivo muy pesado (Multer)
    if (error.code === "LIMIT_FILE_SIZE") {
      console.error("⚠️ El archivo excede el límite de peso permitido.");
      return res.status(400).json({
        message:
          "La imagen es demasiado pesada. Por favor sube una imagen de menos de 5MB.",
      });
    }

    // B) Error de Cloudinary u otros (desglosamos el objeto para leerlo en logs)
    // Esto convierte el [object Object] en texto legible
    console.error(JSON.stringify(error, null, 2));

    res.status(500).json({
      message: "Error interno al procesar la solicitud",
      error: error.message || error, // Enviamos el detalle si existe
    });
  }
};

// 2. ACTUALIZAR PRODUCTO
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    let updateData = {
      name,
      description,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      category,
    };

    // Si hay nueva foto, actualizamos la URL
    if (req.file && req.file.path) {
      updateData.imageURL = req.file.path;
    }

    const productoActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }, // Devuelve el producto ya modificado
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(productoActualizado);
  } catch (error) {
    console.error("❌ ERROR AL ACTUALIZAR:");

    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "La imagen es demasiado pesada. Máximo 5MB.",
      });
    }

    console.error(JSON.stringify(error, null, 2));
    res
      .status(500)
      .json({ message: "Error al actualizar", error: error.message });
  }
};

// 3. OBTENER PRODUCTOS
exports.getProducts = async (req, res) => {
  try {
    const productos = await Product.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// 4. ELIMINAR PRODUCTO
exports.deleteProduct = async (req, res) => {
  try {
    const eliminado = await Product.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: "No encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};
