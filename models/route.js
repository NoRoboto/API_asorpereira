// Required modules
var mongoose = require('mongoose')

// Schema definition
var routeSchema = new mongoose.Schema(
  {
    user: { type: String, ref: 'user', required: true },
    path: [
      {
        lat: { type: String },
        lng: { type: String }
      }
    ],
    responsible: { type: String },
    commune: { type: String },
    frequency: { type: Number, required: true, min: 1, max: 7 }
  },
  { timestamps: true }
)

// Export model
module.exports = mongoose.model('route', routeSchema)
