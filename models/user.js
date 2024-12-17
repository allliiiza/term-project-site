const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true,
        unique: true
    },
    favorites: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    purchaseHistory: [{
        products: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: Number,
            price: Number
        }],
        date: {
            type: Date,
            default: Date.now
        },
        totalAmount: Number
    }]
});

module.exports = mongoose.model('User', userSchema); 