import express from 'express'
import { protectedRoute } from '../utils/protectedRoute.js'
import { adminRoute } from '../utils/adminRoute.js'

import {
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  createProduct,
  toggleFeaturedProduct,
  deleteProduct,
} from '../controller/product.controller.js'

const router = express.Router()

router.get('/', protectedRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/recommendations', getRecommendedProducts)
router.post('/', protectedRoute, adminRoute, createProduct)
router.patch('/:id', protectedRoute, adminRoute, toggleFeaturedProduct)
router.delete('/:id', protectedRoute, adminRoute, deleteProduct)

export default router
