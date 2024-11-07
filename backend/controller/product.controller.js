import Product from '../models/product.model'
import { client } from '../lib/redis'
import cloudinary from 'cloudinary'

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (error) {
    console.log('Error in getAllProducts', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    res.json(product)
  } catch (error) {
    console.log('Error in getProductById', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await client.get('featuredProducts')
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts))
    }

    const products = await Product.find({ isFeatured: true })

    if (!products) {
      return res.status(404).json({ message: 'No featured products found' })
    }

    await client.set('featuredProducts', JSON.stringify(products))

    res.json(products)
  } catch (error) {
    console.log('Error in getFeaturedProducts', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}
