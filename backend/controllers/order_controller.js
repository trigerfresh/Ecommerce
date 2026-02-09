import Order from '../models/orderSchema.js'
import mongoose from 'mongoose'

export const completeOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body, orderDate: Date.now() })
    const result = await order.save()
    res.status(201).json({ orderId: result._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const getOrderDetails = async (req, res) => {
  try {
    const uId = new mongoose.Types.ObjectId(req.body.userId)

    const result = await Order.aggregate([
      {
        $match: {
          userId: uId,
          paymentStatus: 'Paid',
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $lookup: {
          from: 'addresses',
          localField: 'addressId',
          foreignField: '_id',
          as: 'addressDetails',
        },
      },
      { $unwind: '$addressDetails' },
      { $sort: { createdAt: -1 } },
    ])

    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
