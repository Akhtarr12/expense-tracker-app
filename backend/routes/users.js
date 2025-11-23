const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'expense-tracker-secret-change-in-production';

// Register
router.post('/register/', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            name
        });

        await user.save();

        // Create token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Guest/Demo Login
router.post('/demo/', async (req, res) => {
    try {
        const demoEmail = 'demo@expensetracker.com';
        const demoPassword = 'demo123';
        const demoName = 'Demo User';

        // Check if demo user exists
        let demoUser = await User.findOne({ email: demoEmail });

        // Create demo user if doesn't exist
        if (!demoUser) {
            const hashedPassword = await bcrypt.hash(demoPassword, 10);
            demoUser = new User({
                email: demoEmail,
                password: hashedPassword,
                name: demoName
            });
            await demoUser.save();
        }

        // Create token
        const token = jwt.sign({ userId: demoUser._id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            token,
            user: {
                id: demoUser._id,
                email: demoUser.email,
                name: demoUser.name
            }
        });
    } catch (error) {
        console.error('Demo login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
