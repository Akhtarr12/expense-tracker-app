const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const usersRouter = require('../routes/users');
const categoriesRouter = require('../routes/categories');
const transactionsRouter = require('../routes/transactions');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Expense Tracker API is running!' });
});

app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/categories', transactionsRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;
