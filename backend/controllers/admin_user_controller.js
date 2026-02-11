import Order from '../models/orderSchema.js'
import User from '../models/userSchema.js'

export const adminGetUsers = async (req, res) => {
  try {
    const users = await User.find(
      { role: { $ne: 'admin' } },
      { password: 0, tokens: 0 },
    )
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminDeleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'User deleted' })
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

// export const adminGetOrders = async (req, res) => {
//   try {
//     const orders = await Order.aggregate([
//       { $match: { isDeleted: false } },

//       {
//         $lookup: {
//           from: 'users',
//           localField: 'userId',
//           foreignField: '_id',
//           as: 'userDetails',
//         },
//       },
//       { $unwind: '$userDetails' },

//       {
//         $unwind: {
//           path: '$products',
//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       {
//         $lookup: {
//           from: 'products',
//           localField: 'products.productId',
//           foreignField: '_id',
//           as: 'products.productDetails',
//         },
//       },

//       {
//         $unwind: {
//           path: '$products.productDetails',
//           preserveNullAndEmptyArrays: true,
//         },
//       },

//       {
//         $group: {
//           _id: '$_id',
//           userDetails: { $first: '$userDetails' },
//           addressId: { $first: '$addressId' },
//           totalAmount: { $first: '$totalAmount' },
//           paymentMode: { $first: '$paymentMode' },
//           paymentStatus: { $first: '$paymentStatus' },
//           orderStatus: { $first: '$orderStatus' },
//           createdAt: { $first: '$createdAt' },

//           products: {
//             $push: {
//               productId: '$products.productId',
//               quantity: '$products.quantity',
//               price: '$products.price',
//               productDetails: '$products.productDetails',
//             },
//           },
//         },
//       },

//       // Optional: sort by newest first
//       { $sort: { createdAt: -1 } },
//     ])

//     res.json({ success: true, orders })
//   } catch (err) {
//     console.error(err)
//     res
//       .status(500)
//       .json({ success: false, message: 'Admin orders fetch failed' })
//   }
// }

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
