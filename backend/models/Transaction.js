const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
