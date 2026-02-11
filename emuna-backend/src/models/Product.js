const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },

    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      default: 0,
    },

    category: {
      type: String,
      required: true,
      enum: ["Plantas", "Artesanías"],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    imageURL: {
      type: String,
      default: "https://via.placeholder.com/300", // Una imagen por defecto si no ponemos nada
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
