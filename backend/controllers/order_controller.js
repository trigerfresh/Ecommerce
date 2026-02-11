import Order from '../models/orderSchema.js'
import mongoose from 'mongoose'

export const createOrder = async (req, res) => {
  try {
    const { userId, products, addressId, totalAmount, paymentMode } = req.body
    const order = new Order({
      userId,
      products,
      addressId,
      totalAmount,
      paymentMode,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
    })

    const savedOrder = await order.save()
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

export const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { paymentStatus } = req.body

    const updated = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus,
        orderStatus: paymentStatus === 'Paid' ? 'Processing' : 'Pending',
      },
      { new: true },
      res.json({ success: true, order: updated }),
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// 3️⃣ Get order history (exclude soft deleted)
export const getOrderDetails = async (req, res) => {
  try {
    const uId = new mongoose.Types.ObjectId(req.body.userId)

    const result = await Order.aggregate([
      { $match: { userId: uId, paymentStatus: 'Paid', isDeleted: false } },
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

export const softDeleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    await Order.findByIdAndUpdate(orderId, { isDeleted: true })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get orders for logged-in user
// export const getUserOrders = async (req, res) => {
//   try {
//     const userId = req.user._id

//     const orders = await Order.aggregate([
//       {
//         $match: {
//           userId: new mongoose.Types.ObjectId(userId),
//           isDeleted: false,
//         },
//       },
//       {
//         // fetch product details for each item
//         $lookup: {
//           from: 'products',
//           localField: 'products.productId',
//           foreignField: '_id',
//           as: 'productDetails',
//         },
//       },
//       {
//         // include only chosen fields for response
//         $project: {
//           _id: 1,
//           products: 1,
//           totalAmount: 1,
//           paymentMode: 1,
//           paymentStatus: 1,
//           orderStatus: 1,
//           createdAt: 1,
//           productDetails: 1,
//         },
//       },
//       { $sort: { createdAt: -1 } },
//     ])

//     res.status(200).json({ success: true, orders })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ success: false, message: err.message })
//   }
// }

//Pending order edit from user
// Update user’s pending order (edit products & quantities)
export const updatePendingOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    const { products } = req.body

    const order = await Order.findById(orderId)

    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (order.paymentStatus !== 'Pending')
      return res.status(400).json({ message: 'Cannot edit after payment' })

    if (order.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Unauthorized' })

    order.products = products
    order.totalAmount = products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )

    await order.save()

    res.json({ success: true, order })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}

//fetch single order
export const getUserOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId

    const result = await Order.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
          userId: new mongoose.Types.ObjectId(req.user._id),
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
    ])

    if (!result.length)
      return res.status(404).json({ message: 'Order not found' })

    res.json({ success: true, order: result[0] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 3
    const skip = (page - 1) * limit

    // total count of orders for this user
    const totalOrders = await Order.countDocuments({
      userId,
      isDeleted: false,
    })

    const orders = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
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
        $project: {
          _id: 1,
          products: 1,
          totalAmount: 1,
          paymentMode: 1,
          paymentStatus: 1,
          orderStatus: 1,
          createdAt: 1,
          productDetails: 1,
        },
      },
      { $sort: { createdAt: -1 } },

      // pagination
      { $skip: skip },
      { $limit: limit },
    ])

    const totalPages = Math.ceil(totalOrders / limit)

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}
