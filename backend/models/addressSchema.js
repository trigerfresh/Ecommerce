import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    number: {
      type: String,
      required: true,
      trim: true,
    },

    alternateNumber: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    locality: {
      type: String,
      required: true,
      trim: true,
    },

    houseAddress: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    landmark: {
      type: String,
      trim: true,
    },

    addressType: {
      type: String,
      enum: ['Home', 'Work'],
      default: 'Home',
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

const Address = mongoose.model('Address', addressSchema)
export default Address
