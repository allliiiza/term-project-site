const express = require('express');
const router = express.Router();
const Product = require('../models/product'); 

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

// Route to filter by category
router.get('/category/:category', async (req, res, next) => {
    try {
        const category = req.params.category; // Extract category from URL
        const products = await Product.find({ category }); 
        res.render('category', { products, category }); // Render category.ejs with filtered products
    } catch (err) {
        next(err);
    }
});

// Route to filter by category and subcategory
router.get('/category/:category/:subcategory', async (req, res, next) => {
    try {
        const { category, subcategory } = req.params; // Extract category and subcategory from URL
        const products = await Product.find({ category, subcategory }); 
        res.render('category', { products, category, subcategory }); // Render category.ejs with filtered products
    } catch (err) {
        next(err);
    }
});


module.exports = router;
