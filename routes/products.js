const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Import the Product model

// Route to display all products
router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find(); // Fetch all products from MongoDB
        res.render('product_list', { products }); // Render the product_list view
    } catch (err) {
        next(err);
    }
});

// Route to display product details
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id); // Find product by ID
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('product_detail', { product }); // Render the product_detail view
    } catch (err) {
        next(err);
    }
});

module.exports = router;
