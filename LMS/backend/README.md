# Smart Library Backend

Express.js backend for the Smart Library Borrowing System.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-library
JWT_SECRET=your_secret_key
NODE_ENV=development
```

3. Start the server:
```bash
npm run dev
```

## API Documentation

See main README.md for complete API documentation.

## Database Models

- **User**: Student accounts with authentication
- **Book**: Library books (20 hardcoded books)
- **Borrow**: Borrowing records
- **Payment**: Payment tracking

## Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Input validation
- Error handling middleware
- CORS enabled for frontend
- Automatic book initialization
