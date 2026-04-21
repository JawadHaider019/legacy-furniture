// routes/cartRoutes.js
import express from "express"
import {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
  clearCart
} from "../controllers/cartController.js"
import { authUser } from "../middleware/auth.js"

const cartRoutes = express.Router()

cartRoutes.get("/", authUser, getCart)
cartRoutes.post("/add", authUser, addToCart)
cartRoutes.post("/update", authUser, updateCart)
cartRoutes.post("/remove", authUser, removeFromCart)
cartRoutes.post("/clear", authUser, clearCart)

export default cartRoutes;