# Expense Tracker Backend API

Backend API for the Expense Tracker mobile app built with Express.js and MongoDB.

## Features

- User authentication (JWT)
- Categories management
- Transactions management
- MongoDB database
- Deployed on Vercel

## API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - Login user

### Categories
- `GET /api/categories/` - Get all categories (requires auth)
- `POST /api/categories/` - Create category (requires auth)
- `PUT /api/categories/:id` - Update category (requires auth)
- `DELETE /api/categories/:id` - Delete category (requires auth)

### Transactions
- `GET /api/categories/:categoryId/transactions/` - Get transactions (requires auth)
- `POST /api/categories/:categoryId/transactions/` - Create transaction (requires auth)
- `PUT /api/categories/:categoryId/transactions/:transactionId` - Update transaction (requires auth)
- `DELETE /api/categories/:categoryId/transactions/:transactionId` - Delete transaction (requires auth)

## Environment Variables

Create a `.env` file with:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=production
```

## Deployment

Deployed on Vercel. To deploy:

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

## License

MIT
