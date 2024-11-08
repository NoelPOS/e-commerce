import Product from '../models/product.model'
import { client } from '../lib/redis'
import cloudinary from '../lib/cloudinary.js'

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

    const products = await Product.find({ isFeatured: true }).lean()

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

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, isFeatured } = req.body

    if (image) {
      const uploadedImage = await cloudinary.uploader.upload(image, {
        folder: 'products',
      })
    }
    const product = Product.create({
      name,
      description,
      price,
      image: uploadedImage?.secure_url ? uploadedImage.secure_url : '',
      category,
    })

    res.status(201).json(product)
  } catch (error) {
    console.log('Error in createProduct', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const deleteProduct = async (req, res) => {}
