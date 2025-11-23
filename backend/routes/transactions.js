const express = require('express');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get transactions for a category
router.get('/:categoryId/transactions/', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            categoryId: req.params.categoryId,
            userId: req.userId
        }).sort({ date: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create transaction
router.post('/:categoryId/transactions/', authMiddleware, async (req, res) => {
    try {
        const { amount, description, date } = req.body;

        // Verify category belongs to user
        const category = await Category.findOne({
            _id: req.params.categoryId,
            userId: req.userId
        });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const transaction = new Transaction({
            amount,
            description,
            date: date || new Date(),
            categoryId: req.params.categoryId,
            userId: req.userId
        });

        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update transaction
router.put('/:categoryId/transactions/:transactionId', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.transactionId,
                categoryId: req.params.categoryId,
                userId: req.userId
            },
            req.body,
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(transaction);
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete transaction
router.delete('/:categoryId/transactions/:transactionId', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: req.params.transactionId,
            categoryId: req.params.categoryId,
            userId: req.userId
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
