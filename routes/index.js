const express = require('express');
const router = express.Router();
const Product = require('../models/product');

router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching products');
    }
});

module.exports = router;
