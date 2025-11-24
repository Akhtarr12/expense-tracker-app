const express = require('express');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all categories for user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const categories = await Category.find({ userId: req.userId });

        // Get transactions for each category
        const categoriesWithTransactions = await Promise.all(
            categories.map(async (category) => {
                const transactions = await Transaction.find({
                    categoryId: category._id
                }).sort({ date: -1 });

                const total = transactions.reduce((sum, t) => sum + t.amount, 0);

                return {
                    _id: category._id,
                    name: category.name,
                    color: category.color,
                    type: category.type,
                    transactions: transactions,  // Return full transactions array
                    total,
                    transactionCount: transactions.length
                };
            })
        );

        res.json(categoriesWithTransactions);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create category
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, color, type } = req.body;

        const category = new Category({
            name,
            color,
            type,
            userId: req.userId
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update category
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete category
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        // Delete all transactions for this category
        await Transaction.deleteMany({ categoryId: req.params.id });

        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
