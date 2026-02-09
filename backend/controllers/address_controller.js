import mongoose from 'mongoose'
import Address from '../models/addressSchema.js'

// ADD ADDRESS
export const addNewAddress = async (req, res) => {
  try {
    if (!req.body.userId) {
      return res.status(400).json({ message: 'User ID is required' })
    }

    const address = new Address({
      userId: new mongoose.Types.ObjectId(req.body.userId),
      name: req.body.name,
      number: Number(req.body.number),
      pincode: req.body.pincode,
      locality: req.body.locality,
      houseAddress: req.body.houseAddress,
      city: req.body.city,
      state: req.body.state,
      addressType: req.body.addressType || 'Home',
      landmark: req.body.landmark || '',
      alternateNumber: req.body.alternateNumber
        ? Number(req.body.alternateNumber)
        : undefined,
      isDeleted: false,
    })

    await address.save()

    res.status(201).json({ message: 'Address added successfully', address })
  } catch (err) {
    console.error('Error saving address:', err.message)
    res.status(500).json({ message: err.message })
  }
}

// GET USER ADDRESSES
export const getAddress = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId)

    const addresses = await Address.find({
      userId,
      isDeleted: false,
    }).sort({ createdAt: -1 })

    res.status(200).json({ addresses })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// DELETE ADDRESS (Soft delete recommended)
export const deleteAddress = async (req, res) => {
  try {
    const addressId = new mongoose.Types.ObjectId(req.params.addressId)

    const result = await Address.updateOne(
      { _id: addressId },
      { $set: { isDeleted: true } },
    )

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Address not found' })
    }

    res.status(200).json({ message: 'Address deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
