const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    imageURL: { type: String, required: true},
    category: {type: String, required: true},
    subcategory: {type: String },
});

module.exports = mongoose.model('Product', productSchema);
