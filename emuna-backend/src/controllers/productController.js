const Product = require("../models/Product");

// 1. CREAR PRODUCTO
exports.createProduct = async (req, res) => {
  try {
    console.log("--- Petición recibida en Backend ---");

    // Verificación de seguridad si el body llega vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      console.log("⚠️ Advertencia: req.body llegó vacío al controlador");
    }

    const { name, description, price, stock, category } = req.body;

    // Validación de nombre (Campo obligatorio)
    if (!name) {
      return res.status(400).json({
        message: "No se recibieron los datos del producto (nombre faltante).",
      });
    }

    // Procesar Imagen: Prioridad Multer (req.file) > imageURL manual > Placeholder
    let finalImage = "https://via.placeholder.com/300";
    if (req.file && req.file.path) {
      finalImage = req.file.path; // URL de Cloudinary
    } else if (req.body.imageURL) {
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
    // --- ESTA ES LA PARTE QUE CAMBIAMOS PARA CAZAR EL ERROR ---
    console.error("❌ ERROR DETALLADO DE CLOUDINARY/SERVER:");
    // console.dir permite ver el contenido del objeto error completo en el Log de Render
    console.dir(error, { depth: null });

    res.status(500).json({
      message: "Error interno en el servidor",
      error: error.message,
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

    if (req.file && req.file.path) {
      updateData.imageURL = req.file.path;
    }

    const productoActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!productoActualizado) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(productoActualizado);
  } catch (error) {
    console.error("❌ Error al actualizar:", error.message);
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
