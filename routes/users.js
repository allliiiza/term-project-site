const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid password');
        }

        // Set user session
        req.session.userId = user._id;
        res.redirect('/profile');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Register route
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            email,
            password: hashedPassword
        });

        await user.save();
        res.redirect('/users/login');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
