const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Authentication middleware is in place
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/users/login');
    }
};

// Profile page route
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId)
            .populate('favorites')
            .populate('cart.product')
            .populate('purchaseHistory.products.product');
            
        if (!user) {
            return res.redirect('/users/login');
        }
        
        res.render('profile', { user });
    } catch (err) {
        console.error('Profile route error:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router; 