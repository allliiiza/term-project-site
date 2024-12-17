const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');

// Route to add product to cart
router.post('/add/:id', async (req, res) => {
    
    console.log('Route Hit: /cart/add/:id')
    console.log('Product ID:', req.params.id);
    res.send('Product ID recieved: ${req.params.id}');

    const productId = req.params.id;
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');

        // Find or create the cart
        let cart = await Cart.findOne();
        if (!cart) cart = new Cart({ items: [] });

        // Check if product exists in cart
        const existingItem = cart.items.find(item => item.productId.equals(product._id));
        if (existingItem) {
            existingItem.quantity += 1; // Increment quantity
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
            });
        }

        // Update totals
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding product to cart');
    }
});

// Route to display cart
router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne().populate('items.productId');
        res.render('cart', { cart });
    } catch (err) {
        res.status(500).send('Error fetching cart');
    }
});

// Route to update item quantity
router.post('/update/:id', async (req, res) => {
    try {
        const { action } = req.body; // 'increase' or 'decrease'
        const cart = await Cart.findOne();
        const item = cart.items.find(item => item.productId.equals(req.params.id));

        if (item) {
            if (action === 'increase') item.quantity += 1;
            if (action === 'decrease') item.quantity = Math.max(1, item.quantity - 1);
        }

        // Update totals
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        res.status(500).send('Error updating cart');
    }
});

// Route to remove item
router.post('/remove/:id', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        cart.items = cart.items.filter(item => !item.productId.equals(req.params.id));

        // Update totals
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        res.status(500).send('Error removing product');
    }
});

module.exports = router;
