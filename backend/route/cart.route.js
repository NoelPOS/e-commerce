import express from 'express'

import { protectedRoute } from '../utils/protectedRoute.js'

import {
  getCartProducts,
  addToCart,
  removeAllFromCart,
  updateQuantity,
} from '../controller/cart.controller.js'

const router = express.Router()

router.get('/', protectedRoute, getCartProducts)
router.post('/', protectedRoute, addToCart)
router.delete('/', protectedRoute, removeAllFromCart)
router.put('/:id', protectedRoute, updateQuantity)

export default router
