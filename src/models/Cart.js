const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          default: 0,
        },
        isSelected: {
          type: Boolean,
          default: true,
        },
      },
    ],
    totalPrice: {
      required: true,
      default: 0,
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
