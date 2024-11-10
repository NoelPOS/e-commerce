import Coupon from '../models/coupon.model'

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.find({ userId: req.user._id, isActive: true })
    res.json(coupon || null)
  } catch (error) {
    console.log('Error in getCoupon', error.message)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// export const validateCoupon = async (req, res) => {
//     try{

//     }

// }
