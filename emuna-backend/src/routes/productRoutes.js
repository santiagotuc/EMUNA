const Product = require("../models/Product");

// Crear producto
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Si req.file existe, usamos la URL de Cloudinary. Si no, usamos imageURL de texto.
    const imageURL = req.file ? req.file.path : req.body.imageURL;

    const nuevoProducto = new Product({
      name,
      description,
      price,
      stock,
      category,
      imageURL,
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear producto", error: error.message });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    let updateData = { name, description, price, stock, category };

    // Si se subió una imagen nueva, actualizamos el link
    if (req.file) {
      updateData.imageURL = req.file.path;
    }

    const productoActualizado = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    res.json(productoActualizado);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar", error: error.message });
  }
};

// Obtener productos
exports.getProducts = async (req, res) => {
  try {
    const productos = await Product.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};
