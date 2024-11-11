import Coupon from '../models/coupon.model.js'
import Order from '../models/order.model.js'
import { stripe } from '../lib/stripe.js'

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty products' })
    }

    let totalAmount = 0

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100)
      totalAmount += amount * product.quantity

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      }
    })

    let coupon = null
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      })

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        )
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || '',
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    })

    if (totalAmount >= 20000) {
      await creaetNewCoupon(req.user._id)

      res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 })
    }
  } catch (error) {
    console.log('Error in createCheckoutSession', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}