const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Import the Product model

// Route to filter products by category
router.get('/:category', async (req, res, next) => {
    try {
        const category = req.params.category; // Extract category from URL
        const products = await Product.find({ category }); // Find products by category
        res.render('category', { products, category }); // Render category view
    } catch (err) {
        next(err);
    }
});

// Route to filter products by category and subcategory
router.get('/:category/:subcategory', async (req, res, next) => {
    try {
        const { category, subcategory } = req.params; // Extract category and subcategory from URL
        const products = await Product.find({ category, subcategory }); // Find products by category and subcategory
        res.render('category', { products, category, subcategory }); // Render category view with filtered products
    } catch (err) {
        next(err);
    }
});

module.exports = router;
