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
      enum: ["plantas", "artesanias"],
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
