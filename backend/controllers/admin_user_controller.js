import Order from '../models/orderSchema.js'
import User from '../models/userSchema.js'
import PDFDocument from 'pdfkit'

// export const adminGetUsers = async (req, res) => {
//   try {
//     const users = await User.find(
//       { role: { $ne: 'admin' } },
//       { password: 0, tokens: 0 },
//     )
//     res.json(users)
//   } catch (err) {
//     res.status(500).json({ message: err.message })
//   }
// }

// export const adminDeleteUser = async (req, res) => {
//   await User.findByIdAndDelete(req.params.id)
//   res.json({ message: 'User deleted' })
// }

export const adminGetUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 7
    const skip = (page - 1) * limit

    // Only normal users, including inactive if needed
    const query = { role: { $ne: 'admin' } } // You can add isActive: true to show only active users
    const totalUsers = await User.countDocuments(query)

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      success: true,
      users,
      pagination: {
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
}

export const adminUpdateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, req.body)
  res.json({ message: 'User updated' })
}

export const adminCreate = async (req, res) => {
  try {
    const { fname, lname, phone, email, password, gender } = req.body

    const existing = await User.findOne({ phone })
    if (existing)
      return res.status(400).json({ message: 'User already exists' })

    const user = new User({
      fname,
      lname,
      phone,
      email,
      password, // will be hashed automatically in userSchema pre-save hook
      gender,
      role: 'admin',
    })

    await user.save()
    res.status(201).json({ message: 'Admin created successfully', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminGetOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 3
    const skip = (page - 1) * limit

    // **count total non‑deleted orders**
    const totalOrders = await Order.countDocuments({})

    const orders = await Order.aggregate([
      // join user
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },

      { $unwind: { path: '$products', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'products.productDetails',
        },
      },
      {
        $unwind: {
          path: '$products.productDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: '$_id',
          userDetails: { $first: '$userDetails' },
          totalAmount: { $first: '$totalAmount' },
          paymentMode: { $first: '$paymentMode' },
          paymentStatus: { $first: '$paymentStatus' },
          orderStatus: { $first: '$orderStatus' },
          isDeleted: { $first: '$isDeleted' },
          createdAt: { $first: '$createdAt' },
          products: {
            $push: {
              productId: '$products.productId',
              quantity: '$products.quantity',
              price: '$products.price',
              productDetails: '$products.productDetails',
            },
          },
        },
      },

      { $sort: { createdAt: -1 } }, // recent first
      { $skip: skip }, // skip to page
      { $limit: limit }, // limit records to page size
    ])

    const totalPages = Math.ceil(totalOrders / limit)

    res.json({
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

// soft delete admin order
export const softDeleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    await Order.findByIdAndUpdate(orderId, {
      isDeleted: true,
      deletedAt: new Date(),
    })
    res.json({ success: true, message: 'Order soft deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// restore soft deleted admin order
export const restoreOrder = async (req, res) => {
  try {
    const { orderId } = req.params
    await Order.findByIdAndUpdate(orderId, {
      isDeleted: false,
      deletedAt: null,
    })
    res.json({ success: true, message: 'Order restored' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// controllers/orderController.js

export const markOrderCompleted = async (req, res) => {
  try {
    const { orderId } = req.params

    const order = await Order.findById(orderId)
    if (!order)
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' })

    if (order.isDeleted)
      return res
        .status(400)
        .json({ success: false, message: 'Cannot complete a deleted order' })

    order.orderStatus = 'Completed'
    order.paymentStatus = 'Paid'

    await order.save()

    res.json({ success: true, order })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: err.message })
  }
}

export const getInvoicePDF_Admin = async (req, res) => {
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
