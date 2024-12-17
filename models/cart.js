const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            name: String,
            price: Number,
            quantity: { type: Number, default: 1 },
        }
    ],
    totalPrice: { type: Number, default: 0 },
    totalQuantity: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', CartSchema);
