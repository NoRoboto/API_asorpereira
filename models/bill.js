// Required modules
var mongoose = require('mongoose')

// Schema definition
var billSchema = mongoose.Schema(
  {
    serial: { type: String, required: true, maxlength: 20 },
    user: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    items: [
      {
        _id: false,
        material: { type: String },
        quantity: { type: Number, min: 1, max: 10000 },
        weight: { type: Number, min: 1, max: 1000 },
        price: { type: Number, min: 0 }
      }
    ],
    total: { type: Number, min: 0 }
  },
  { timestamps: true }
)

// Export the prev. model
module.exports = mongoose.model('bill', billSchema)
