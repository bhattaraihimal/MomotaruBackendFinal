const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String }, // e.g., "Food Blogger" or "Regular Customer"
  content: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  image: { type: String }, // Optional user photo
  active: { type: Boolean, default: false } // Admin approval needed
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', TestimonialSchema);
