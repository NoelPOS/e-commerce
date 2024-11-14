import Product from '../models/product.model.js'
import { client } from '../lib/redis.js'
import cloudinary from '../lib/cloudinary.js'

export const getAllProducts = async (req, res) => {
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
    const product = await Product.create({
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

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id

    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (product.image) {
      const imageId = product.image.split('/').pop().split('.')[0]

      try {
        await cloudinary.uploader.destroy(`products/${imageId}`)
        console.log('Image deleted from cloudinary')
      } catch (error) {
        console.log('Error deleting image from cloudinary', error.message)
      }
    }

    await Product.findByIdAndDelete(id)
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.log('Error in deleteProduct', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getRecommendedProducts = async (req, res) => {
  try {
    const recommendedProducts = await Product.aggregate([
      { $sample: { size: 4 } },
      { $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 } },
    ])

    res.json(recommendedProducts)
  } catch (error) {
    console.log('Error in getRecommendedProducts', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params

    const products = await Product.find({ category })

    res.json(products)
  } catch (error) {
    console.log('Error in getProductsByCategory', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)

    if (product) {
      product.isFeatured = !product.isFeatured
      const updatedProduct = await product.save()
      await updateFeaturedProductsCache()
      res.json(updatedProduct)
    } else {
      res.status(404).json({ message: 'Product not found' })
    }
  } catch (error) {
    console.log('Error in toggleFeaturedProduct', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

async function updateFeaturedProductsCache() {
  try {
    const products = await Product.find({ isFeatured: true }).lean()

    await client.set('featuredProducts', JSON.stringify(products))
  } catch (error) {
    console.log('Error in updateFeaturedProductsCache', error.message)
  }
}
