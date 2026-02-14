const Product = require("../models/Product");

// 1. CREAR PRODUCTO
exports.createProduct = async (req, res) => {
  try {
    console.log("--- Petición de creación recibida ---");

    // Si req.body es undefined, usamos un objeto vacío para evitar el crash
    const data = req.body || {};
    const { name, description, price, stock, category } = data;

    // Validación de seguridad para evitar el error del log anterior
    if (!name) {
      console.log("⚠️ Error: El nombre no llegó en el body");
      return res
        .status(400)
        .json({ message: "El nombre del producto es obligatorio." });
    }

    // Procesar Imagen: Prioridad Multer (req.file) > imageURL manual > Placeholder
    let finalImage = "https://via.placeholder.com/300";
    if (req.file && req.file.path) {
      finalImage = req.file.path;
    } else if (data.imageURL) {
      finalImage = data.imageURL;
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
    console.error("❌ ERROR EN BACKEND:", error.message);
    res.status(500).json({
      message: "Error interno en el servidor",
      error: error.message,
    });
  }
};

// 2. ACTUALIZAR PRODUCTO
exports.updateProduct = async (req, res) => {
  try {
    const data = req.body || {};
    const { name, description, price, stock, category } = data;

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
