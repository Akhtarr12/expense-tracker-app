const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('../routes/users');
const categoriesRouter = require('../routes/categories');
const transactionsRouter = require('../routes/transactions');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with caching for serverless
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    try {
        const connection = await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        cachedDb = connection;
        console.log('MongoDB connected');
        return connection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Routes
app.get('/', async (req, res) => {
    try {
        await connectToDatabase();
        res.json({ message: 'Expense Tracker API is running!' });
    } catch (error) {
        res.status(500).json({ message: 'API is running but database connection failed', error: error.message });
    }
});

app.use('/api/users', async (req, res, next) => {
    await connectToDatabase();
    usersRouter(req, res, next);
});

app.use('/api/categories', async (req, res, next) => {
    await connectToDatabase();
    categoriesRouter(req, res, next);
});

app.use('/api/categories', async (req, res, next) => {
    await connectToDatabase();
    transactionsRouter(req, res, next);
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Export for Vercel
module.exports = app;
