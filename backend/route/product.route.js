import express from 'express'
import { protectedRoute } from '../utils/protectedRoute.js'
import { adminRoute } from '../utils/adminRoute.js'

const router = express.Router()

router.get('/', protectRoute, adminRoute, getAllProducts)
router.get('/featured', getFeaturedProducts)
router.get('/category/:category', getProductsByCategory)
router.get('/recommendations', getRecommendedProducts)
router.post('/', protectRoute, adminRoute, createProduct)
router.patch('/:id', protectRoute, adminRoute, toggleFeaturedProduct)
router.delete('/:id', protectRoute, adminRoute, deleteProduct)

export default router
