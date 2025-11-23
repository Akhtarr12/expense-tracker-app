const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'expense-tracker-secret-change-in-production';

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
