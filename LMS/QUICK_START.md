# Smart Library Borrowing System - Quick Start Guide

## Prerequisites Check
- [ ] Node.js installed (v16+)
- [ ] MongoDB installed and running
- [ ] Git (optional)

## Installation Steps

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# The .env file is already configured with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/smart-library
# JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
# NODE_ENV=development

# Start backend server
npm run dev
```

Expected output: 
```
🚀 Server running on port 5000
✅ MongoDB connected successfully
📚 Books initialized successfully
```

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start frontend development server
npm run dev
```

Expected output:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Access the Application

Open your browser and go to: **http://localhost:5173**

## First Time Use

1. **Create an Account**
   - Click "Sign up"
   - Fill in: Name, Email, Student ID, Password (min 6 characters)
   - Click "Sign Up"

2. **Browse Books**
   - Navigate to "Books" from the navbar
   - View 20 available books

3. **Borrow a Book**
   - Click "Borrow" on any available book
   - Enter number of days (1-30)
   - Confirm borrowing

4. **Return a Book**
   - Go to "Active Borrows"
   - Click "Return Book"
   - Select return date
   - Confirm return (overdue fees calculated automatically)

## Test Credentials (Create your own)

No default credentials - you need to sign up first!

## Common Issues

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod` or start MongoDB service
- Check connection string in backend/.env

### Port Already in Use
- Backend (5000): Change PORT in backend/.env
- Frontend (5173): Will auto-increment to 5174

### Dependencies Install Error
- Clear cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

## Project Structure
```
LMS/
├── backend/              # Express + MongoDB
│   ├── controllers/     # Business logic
│   ├── models/          # Database models
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   └── server.js        # Entry point
├── frontend/            # React + Vite
│   ├── src/
│   │   ├── components/  # Reusable UI
│   │   ├── pages/       # Route pages
│   │   ├── context/     # Auth context
│   │   └── utils/       # API utilities
│   └── index.html
└── README.md
```

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Health Check

Test if backend is running:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

## Features Checklist

- [x] User Authentication (Signup/Login)
- [x] JWT Token-based security
- [x] Password hashing
- [x] Book browsing (20 books)
- [x] Borrow validation
- [x] Cost calculation
- [x] Active borrow tracking
- [x] Book return with overdue
- [x] Borrow history
- [x] Payment tracking
- [x] Dashboard summary
- [x] Responsive UI

## Need Help?

Check the main README.md for:
- Complete API documentation
- Database models
- Business rules
- Security features
- Tech stack details

Enjoy using Smart Library! 📚
