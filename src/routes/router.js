const express = require("express")
const { addToCart, getCart, updateCart, deleteCart, clearCart, getCartById, getCartQuantity } = require("../controller/cartController")
const userAuth = require("../middlewares/userAuth")


const router = express.Router()

router.post('/:productId',userAuth,addToCart)
router.get('/',userAuth,getCart)
router.get('/cartQuantity', userAuth, getCartQuantity);
router.get('/:product', userAuth, getCartById);


// router.put('/:productId/:action', userAuth, updateCart);
router.put('/:product',userAuth,updateCart)

router.delete('/:product',userAuth,deleteCart)
router.delete('/',userAuth,clearCart)

module.exports = router


