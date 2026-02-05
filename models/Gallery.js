const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { type: String },
  imageUrl: { type: String, required: true },
  category: { type: String, default: 'General' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
