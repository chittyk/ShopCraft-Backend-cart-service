const Cart = require("../models/Cart");
const axios = require("axios");



const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const user = req.userId;

    const baseURL = process.env.BASEURL.replace(/\/$/, ""); // remove trailing slash
    console.log("🔗 Fetching Product:", `${baseURL}/${productId}`);

    // ✅ Fetch single product
    const productRes = await axios.get(`${baseURL}/${productId}`);
    const product = productRes.data;

    if (!product) return res.status(404).json({ msg: "Product not found" });

    // ✅ Find or create user cart
    let cart = await Cart.findOne({ user });

    if (!cart) {
      cart = new Cart({
        user,
        items: [{ product: productId, quantity }],
        totalPrice: product.price * quantity,
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity = quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      // ✅ Recalculate total price
      let total = 0;
      for (const item of cart.items) {
        const prodRes = await axios.get(`${baseURL}/${item.product}`);
        const prod = prodRes.data;
        if (prod) total += prod.price * item.quantity;
      }

      cart.totalPrice = total;
    }

    await cart.save();
    res.status(200).json({ msg: "Added to cart successfully 🛒", cart });
  } catch (error) {
    console.error("❌ error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};




const getCart = async (req, res) => {
  try {
    const user = req.userId;
    // or
    // const { user } = req.body;

    const productRes = await axios.get(process.env.BASEURL);
    if (!productRes.data) return res.json({ msg: "product api not working" });
    const products = productRes.data;

    const cart = await Cart.findOne({ user });
    if (!cart || cart.items.length === 0)
      return res.status(404).json({ msg: "Cart is empty" });

    const cartWithProducts = cart.items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() == item.product.toString()
      );
      return {
        product,
        quantity: item.quantity,
        price: item.price,
        isSelected: item.isSelected,
      };
    });

    res.status(200).json({
      cart: {
        user: cart.user,
        items: cartWithProducts,
        totalPrice: cart.totalPrice,
      },
    });
  } catch (error) {
    console.error("server Error :", error);
    return res.status(502).json({ msg: "server side error" });
  }
};


const getCartQuantity = async (req, res) => {
  try {

    
    const userId = req.userId;

    // Ensure userId is available
    if (!userId) {
      return res.status(401).json({ msg: "Unauthorized: user ID missing" });
    }

    // Find cart and only select items (to optimize query)
    const cart = await Cart.findOne({ user: userId }).select("items");

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(200).json({ quantity: 0 });
    }

    console.log("jhhjgjkgjgkjgkjgjgkgjkgkjgkjgkjgkgjgkjgj",cart





      
    )
    // You can count total quantity or unique items
    const quantity = cart.items.length
    console.log("jgjgkgkjggjgggjgjkjgggjgkjgjkgjgjgjgkjgjjgkjggkjgkjgkjgkjg: ",quantity)
    return res.status(200).json({ quantity });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const getCartById = async (req, res) => {
  try {
    const user = req.userId;
    const { product } = req.params;

    const cart = await Cart.findOne({ user });

    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    console.log(cart.items);
    const item = cart.items.find(
      (i) => i.product.toString() === product.toString()
    );

    if (!item)
      return res.status(404).json({ msg: "Product not 1 found in cart" });

    // ✅ Return only count (quantity)
    return res.status(200).json({
      product,
      count: item.quantity,
    });
  } catch (error) {
    console.error("Error fetching cart item:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// const updateCart = async (req, res) => {
//   try {
//     const { productId, action } = req.params;
//     const user = req.userId; // added by your userAuth middleware

//     if (!user || !productId) {
//       return res.status(400).json({ message: "Missing userId or productId" });
//     }

//     // Fetch product details
//     const productRes = await axios.get(`${process.env.BASEURL}${productId}`);
//     const productDetails = productRes.data;

//     if (!productDetails) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     // Find the user's cart
//     const cart = await Cart.findOne({ user });
//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Check for existing item in cart
//     const item = cart.items.find(
//       (i) => i.product.toString() === productId.toString()
//     );

//     // If no item found and action is increment → add it
//     if (!item && action === "increment") {
//       cart.items.push({
//         product: productId,
//         quantity: 1,
//         price: productDetails.price,
//       });
//       cart.totalPrice += productDetails.price;
//       await cart.save();
//       return res.status(200).json({ msg: "Item added to cart", cart });
//     }

//     if (!item) {
//       return res.status(404).json({ msg: "Item not found in cart" });
//     }

//     // Adjust total price before modifying quantity
//     cart.totalPrice -= item.quantity * item.price;

//     // Handle increment/decrement logic
//     if (action === "increment") {
//       if (item.quantity < 6) item.quantity += 1;
//     } else if (action === "decrement") {
//       item.quantity -= 1;
//     }

//     // Remove if quantity is zero or less
//     if (item.quantity <= 0) {
//       cart.items = cart.items.filter(
//         (i) => i.product.toString() !== productId.toString()
//       );
//     } else {
//       // Recalculate total price
//       cart.totalPrice += item.quantity * item.price;
//     }

//     await cart.save();
//     return res.status(200).json({ msg: "Cart updated successfully", cart });
//   } catch (error) {
//     console.error("Error updating cart:", error);
//     return res.status(500).json({ msg: "Server error" });
//   }
// };

const updateCart = async (req, res) => {
  try {
    const { product } = req.params;
    const { quantity } = req.body;
    const user = req.userId;
    // or
    // const { user } = req.body;

    if (!user || !product) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    const productRes = await axios.get(process.env.BASEURL + product);
    console.log(productRes.data);
    const productDetails = productRes.data;

    if (!productDetails) {
      return res.status(404).json({ message: "Product not found" });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === product.toString()
    );

    if (!item) return res.status(404).json({ msg: "Item not found" });
    console.log("item", item);

    if (quantity <= 0) {
      console.log("successfuy remove");
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== product.toString()
      );
      await cart.save();
      res.status(200).json(cart);
    } else {
      //remove quantity*price from total price
      let quantityPrice = item.quantity * item.price;
      cart.totalPrice = cart.totalPrice - quantityPrice;

      item.quantity = quantity;
      quantityPrice = item.quantity * item.price;

      cart.totalPrice += quantityPrice;

      item.save();
    }
    cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.log("error : ", error);
    return res.status(502).json({ msg: "server error" });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { product } = req.params;
    const user = req.userId; // Recommended: get user from JWT
    // const { user } = req.body;

    if (!product || !user) {
      return res.status(400).json({ message: "Missing user or product ID" });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the item
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== product.toString()
    );

    // Recalculate totalPrice
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    console.error("deleteCart error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = req.userId; // Recommended: get user from JWT
    // const { user } = req.body;

    if (!user) {
      return res.status(400).json({ message: "Missing user or product ID" });
    }

    const cart = await Cart.findOne({ user });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];

    cart.totalPrice = 0;
    cart.save();
    return res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    console.error("deleteCart error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  getCartById,
  getCartQuantity,
  updateCart,
  deleteCart,
  clearCart,
};
