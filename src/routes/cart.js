const express = require("express");
const { requireSignin, userMiddleware } = require("../common-middleware");
const { addToCart ,getCartItems, removeCartItems} = require("../controller/cart");
const router = express.Router();

router.post("/user/cart/addtocart", requireSignin, userMiddleware, addToCart);
router.post("/user/getCartItems", requireSignin, userMiddleware, getCartItems);
router.post(
  "/user/cart/removeItem",
  requireSignin,
  userMiddleware,
  removeCartItems
);


module.exports = router;
