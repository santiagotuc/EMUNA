const Product = require("../models/Product");

// @desc Obtener todos los productos
// @route GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Crear un nuevo producto (Planta o artesanía)
// @route POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Si se subió un archivo, Multer nos da la URL en req.file.path
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
    res.status(500).json({ message: "Error al crear producto", error });
  }
};

// @desc Actualizar un producto
// @route PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    // CORRECCIÓN: Usamos req.params.id (con 's')
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }, // runValidators asegura que siga las reglas del modelo
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado para actualizar" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Eliminar un producto
// @route DELETE /api/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    // CORRECCIÓN: Validamos que el producto exista antes de decir que se borró
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado para eliminar" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
