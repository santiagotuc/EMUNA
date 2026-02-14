const Product = require("../models/Product");

// 1. CREAR PRODUCTO
exports.createProduct = async (req, res) => {
  try {
    console.log("--- Intentando crear producto ---");
    // Extraemos los datos del body
    const { name, description, price, stock, category } = req.body;

    // VALIDACIÓN MANUAL: Si no hay archivo ni URL, usamos el placeholder
    let finalImage = "https://via.placeholder.com/300";
    if (req.file && req.file.path) {
      finalImage = req.file.path;
    } else if (req.body.imageURL) {
      finalImage = req.body.imageURL;
    }

    const nuevoProducto = new Product({
      name,
      description,
      price: parseFloat(price) || 0, // Usamos parseFloat para asegurar número
      stock: parseInt(stock) || 0, // Usamos parseInt para asegurar entero
      category: category || "Plantas",
      imageURL: finalImage,
    });

    const productoGuardado = await nuevoProducto.save();
    console.log("✅ Producto guardado:", productoGuardado.name);
    res.status(201).json(productoGuardado);
  } catch (error) {
    console.error("❌ ERROR CRÍTICO EN BACKEND:", error);
    res.status(500).json({
      message: "Error interno del servidor al crear producto",
      error: error.message,
    });
  }
};

// 2. ACTUALIZAR PRODUCTO (Simplificado para evitar errores)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    let updateData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
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

    res.json(productoActualizado);
  } catch (error) {
    console.error("❌ Error al actualizar:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar", error: error.message });
  }
};

// ... el resto de tus funciones (get y delete) están perfectas
exports.getProducts = async (req, res) => {
  try {
    const productos = await Product.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};
