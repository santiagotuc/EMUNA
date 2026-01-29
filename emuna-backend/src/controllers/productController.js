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

// @desc Crear un nuevo producto (Planta o artesania)
// @route POST /api/products

exports.createProduct = async (req, res) => {
  const { name, description, price, category, stock, imageURL } = req.body;

  try {
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageURL,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Actualizar un producto
// @route PUT /api/products/:id

exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.param.id,
      req.body,
      { new: true }, //aqui devuelve el producto ya modificado
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
