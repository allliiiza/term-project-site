const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Cart = require('../models/cart');

// Route to add product to cart
router.post('/add/:id', async (req, res) => {
    console.log('Route Hit: /cart/add/:id');
    console.log(`Product ID received: ${req.params.id}`);

    const productId = req.params.id;
    try {
        // Fetch the product
        const product = await Product.findById(productId);
        console.log('Product fetched:', product); // Debug log
        if (!product || !product.name || !product.price) {
            return res.status(400).send('Invalid product details');
        }

        // Find or create the cart
        let cart = await Cart.findOne();
        if (!cart) cart = new Cart({ items: [] });
        console.log('Cart before update:', cart); // Debug log

        // Check if product exists in cart
        const existingItem = cart.items.find(item => item.productId && item.productId.equals(product._id));
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

        // Update totals safely
        cart.totalPrice = cart.items.reduce((sum, item) => {
            const price = item.price || 0;
            const quantity = item.quantity || 0;
            return sum + price * quantity;
        }, 0);

        cart.totalQuantity = cart.items.reduce((sum, item) => {
            const quantity = item.quantity || 0;
            return sum + quantity;
        }, 0);

        // Save cart
        await cart.save();
        console.log('Cart saved successfully:', cart);
        res.redirect('/cart');
    } catch (err) {
        console.error('Error adding product to cart:', err);
        res.status(500).send('Error adding product to cart');
    }
});

// Route to display cart
router.get('/', async (req, res) => {
    try {
        let cart = await Cart.findOne().populate({
            path: 'items.productId',
            select: 'name price imageURL' // Fetch only required fields
        });

        // Clean up invalid items (missing product data)
        cart.items = cart.items.filter(item => item.productId);

        // Recalculate totals
        cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.productId.price || 0) * (item.quantity || 0), 0);
        cart.totalQuantity = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

        await cart.save(); // Save cleaned-up cart
        console.log('Cleaned Cart:', cart);

        res.render('cart', { cart });
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).send('Error fetching cart');
    }
});

// Route to update item quantity
router.post('/update/:id', async (req, res) => {
    try {
        const { action } = req.body; // 'increase' or 'decrease'
        const cart = await Cart.findOne();

        const item = cart.items.find(item => item.productId && item.productId.equals(req.params.id));

        if (item) {
            if (action === 'increase') item.quantity += 1;
            if (action === 'decrease') item.quantity = Math.max(1, item.quantity - 1);
        }

        // Recalculate totals
        cart.totalPrice = cart.items.reduce((sum, item) => {
            const price = item.productId.price || 0;
            const quantity = item.quantity || 0;
            return sum + price * quantity;
        }, 0);

        cart.totalQuantity = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).send('Error updating cart');
    }
});

// Route to remove item
router.post('/remove/:id', async (req, res) => {
    try {
        const cart = await Cart.findOne();

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.productId && !item.productId.equals(req.params.id));

        // Recalculate totals
        cart.totalPrice = cart.items.reduce((sum, item) => {
            const price = item.productId.price || 0;
            const quantity = item.quantity || 0;
            return sum + price * quantity;
        }, 0);

        cart.totalQuantity = cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);

        await cart.save();
        res.redirect('/cart');
    } catch (err) {
        console.error('Error removing product from cart:', err);
        res.status(500).send('Error removing product from cart');
    }
});

module.exports = router;
