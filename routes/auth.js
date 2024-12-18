const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Import User model

// Show login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Show register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle user registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.redirect('/auth/login');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error registering user');
    }
});

// Handle login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid email or password');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid email or password');

        res.redirect('/'); // Redirect to homepage after login
    } catch (err) {
        console.error(err);
        res.status(500).send('Error logging in');
    }
});

module.exports = router;
