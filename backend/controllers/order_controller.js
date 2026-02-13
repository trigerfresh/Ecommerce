import Order from '../models/orderSchema.js'
import mongoose from 'mongoose'
import PDFDocument from 'pdfkit'

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

    // ✅ Send back created order
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder,
    })
  } catch (err) {
    console.error(err)
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
    )

    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' })

    res.json({ success: true, order: updated })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// When user add to cart and proceed to checkout

export const createPendingOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body

    const order = new Order({
      userId,
      products,
      totalAmount,
      paymentMode: 'COD',
      paymentStatus: 'Pending',
      orderStatus: 'Add to Cart',
      // addressId is optional for pending orders
    })

    const savedOrder = await order.save()

    res.status(201).json({
      success: true,
      message: 'Pending order created',
      order: savedOrder,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

// Create Order with payment
// export const createOrder = async (req, res) => {
//   try {
//     const { products, addressId, totalAmount, paymentMode } = req.body
//     const order = new Order({
//       userId: req.user._id,
//       products,
//       addressId,
//       totalAmount,
//       paymentMode,
//       paymentStatus: paymentMode === 'COD' ? 'Pending' : 'Pending', // Online remains Pending until payment
//       orderStatus: 'Pending',
//     })

//     const savedOrder = await order.save()
//     res.status(201).json({ success: true, order: savedOrder })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ success: false, message: err.message })
//   }
// }

// // Update Payment Status
// export const updatePaymentStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params
//     const { paymentStatus } = req.body

//     const updated = await Order.findByIdAndUpdate(
//       orderId,
//       {
//         paymentStatus,
//         orderStatus: paymentStatus === 'Paid' ? 'Processing' : 'Pending',
//       },
//       { new: true },
//     )

//     res.json({ success: true, order: updated })
//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ success: false, message: err.message })
//   }
// }

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

export const getInvoicePDF_Orders = async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await Order.findById(orderId)
      .populate('userId', 'fname lname email phone')
      .populate('addressId')
      .populate('products.productId')

    if (!order) return res.status(404).send('Order not found')

    // PDF headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice_${orderId}.pdf`,
    )

    const doc = new PDFDocument({ margin: 50 })

    doc.pipe(res) // pipe PDF output to response

    // Header
    doc.fontSize(20).text('Invoice', { align: 'center' })
    doc.moveDown()
    doc.text(`Order ID: ${order._id}`)
    doc.text(`Name: ${order.userId.fname} ${order.userId.lname}`)
    doc.text(`Phone: ${order.userId.phone}`)
    doc.moveDown()

    // Address block
    doc.text('Delivery Address:')
    doc.text(order.addressId.houseAddress)
    doc.text(`${order.addressId.city}, ${order.addressId.state}`)
    doc.text(`Pincode: ${order.addressId.pincode}`)
    doc.moveDown()

    // Items table
    doc.text('Products:')
    order.products.forEach((item, idx) => {
      doc.text(
        `${idx + 1}. ${item.productId.title.shortTitle} — Qty: ${
          item.quantity
        } — Price: ₹${item.price} — Total: ₹${item.price * item.quantity}`,
      )
    })

    doc.moveDown()
    // Totals
    doc.text(`Total Amount: ₹${order.totalAmount}`)
    doc.text(`Payment Mode: ${order.paymentMode}`)
    doc.text(`Payment Status: ${order.paymentStatus}`)
    doc.text(`Order Status: ${order.orderStatus}`)

    doc.end() // finalize PDF
  } catch (err) {
    console.error(err)
    res.status(500).send('Could not generate invoice')
  }
}

// PATCH: Update payment after success router.patch('/update-payment/:id
export const updatePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Update payment and order status
    order.paymentStatus = 'Paid'
    order.orderStatus = 'Processing'
    // (Recommended instead of Completed)

    await order.save()

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Order summary edit cart
export const loadOrderToCart = async (req, res) => {
  try {
    const userId = req.user._id
    const { orderId } = req.params

    const order = await Order.findOne({ _id: orderId, userId })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Clear existing cart
    await Cart.deleteMany({ userId })

    // Insert order products into cart
    const cartItems = order.products.map((item) => ({
      userId,
      productId: item.productId,
      quantity: item.quantity,
    }))

    await Cart.insertMany(cartItems)

    res.status(200).json({ message: 'Cart loaded from order' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
