const Product = require("../models/Product");

// 1. CREAR PRODUCTO
exports.createProduct = async (req, res) => {
  try {
    // Estos logs son para que vos veas en Render qué está llegando
    console.log("--- Intentando crear producto ---");
    console.log("Cuerpo de la petición (req.body):", req.body);
    console.log("Archivo recibido (req.file):", req.file);

    const { name, description, price, stock, category } = req.body;

    // Prioridad: Si hay archivo de Cloudinary lo usamos, sino el link de texto
    const imageURL = req.file ? req.file.path : req.body.imageURL;

    const nuevoProducto = new Product({
      name,
      description,
      price: Number(price), // Nos aseguramos de que sea número
      stock: Number(stock), // Nos aseguramos de que sea número
      category,
      imageURL,
    });

    await nuevoProducto.save();
    console.log("✅ Producto guardado con éxito en MongoDB");
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("❌ Error en createProduct:", error.message);
    res.status(500).json({
      message: "Error al crear producto",
      error: error.message,
    });
  }
};

// 2. ACTUALIZAR PRODUCTO
exports.updateProduct = async (req, res) => {
  try {
    console.log("--- Intentando actualizar producto ---");
    const { name, description, price, stock, category } = req.body;

    let updateData = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
    };

    // Si el usuario subió una imagen nueva en la edición
    if (req.file) {
      console.log("Nueva imagen detectada para actualizar:", req.file.path);
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

    console.log("✅ Producto actualizado con éxito");
    res.json(productoActualizado);
  } catch (error) {
    console.error("❌ Error en updateProduct:", error.message);
    res.status(500).json({
      message: "Error al actualizar",
      error: error.message,
    });
  }
};

// 3. OBTENER TODOS LOS PRODUCTOS
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
    const { id } = req.params;
    const eliminado = await Product.findByIdAndDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: "No se encontró el producto" });
    }

    console.log("✅ Producto eliminado ID:", id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};
