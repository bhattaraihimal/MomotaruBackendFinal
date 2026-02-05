const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Starters', 'Sushi', 'Ramen', 'Main Course', 'Drinks', 'Desserts'] 
  },
  image: { type: String }, // URL to image
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Menu', MenuSchema);
