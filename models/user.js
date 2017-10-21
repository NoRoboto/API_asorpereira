// Required modules
var mongoose = require('mongoose')

var userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 60 },
    id: { type: String, required: true, unique: true },
    type: { type: String, default: '' },
    rol: { type: String, default: '' }
  },
  { timestamps: true }
)

// Export the model
module.exports = mongoose.model('user', userSchema)
