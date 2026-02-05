const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String }, // Cloudinary URL
  bio: { type: String },
  order: { type: Number, default: 0 }
});

module.exports = mongoose.model('Team', TeamSchema);
