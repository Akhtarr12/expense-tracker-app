const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('../routes/users');
const categoriesRouter = require('../routes/categories');
const transactionsRouter = require('../routes/transactions');

const app = express();

// Middleware
app.use(cors());
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

let isConnected = false;

async function connectToDatabase() {
    if (isConnected && mongoose.connection.readyState === 1) {
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Connect to database on startup
connectToDatabase().catch(console.error);

// Routes
app.get('/', async (req, res) => {
    try {
        await connectToDatabase();
        res.json({ message: 'Expense Tracker API is running!', status: 'connected' });
    } catch (error) {
        res.status(500).json({ message: 'API is running but database connection failed', error: error.message });
    }
});

app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/categories', transactionsRouter);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Export for Vercel
module.exports = app;
