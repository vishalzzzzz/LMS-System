# Smart Library Borrowing System

A full-stack web application for managing book borrowing, cost calculation, expense splitting, and user balances among students.

## 🚀 Features

- **Authentication**: User signup, login, and profile management with JWT
- **Book Management**: Browse 20 predefined books with availability status
- **Borrowing System**: 
  - Borrow books with validation (availability, no debt, one book at a time)
  - Calculate costs based on days borrowed
  - Track active borrows with due dates
  - Return books with overdue calculation
- **Dashboard**: Summary of active borrows, debt, balance, and recent activity
- **History**: Complete borrowing history with cost breakdown
- **Payment Tracking**: View pending and paid payments

## 📁 Project Structure

```
LMS/
├── backend/          # Express.js + MongoDB backend
│   ├── config/       # Database configuration
│   ├── controllers/  # Route controllers
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Authentication middleware
│   └── server.js     # Entry point
└── frontend/         # React + Vite frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── context/     # Auth context
    │   ├── pages/       # Page components
    │   ├── utils/       # API utilities
    │   └── App.jsx      # Main app component
    └── index.html
```

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- cookie-parser
- CORS enabled

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or Atlas connection)
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the backend folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-library
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or `http://localhost:5174` if 5173 is in use)

**Note:** Vite will automatically use the next available port if 5173 is busy.

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Books
- `GET /api/books` - Get all books (protected)
- `GET /api/books/available` - Get available books (protected)
- `GET /api/books/:bookId` - Get book by ID (protected)

### Borrowing
- `POST /api/borrow/validate` - Validate if user can borrow (protected)
- `POST /api/borrow/calculate` - Calculate borrow cost (protected)
- `POST /api/borrow` - Borrow a book (protected)
- `GET /api/borrows/active` - Get active borrows (protected)
- `GET /api/borrows/:borrowId/summary` - Get borrow summary (protected)
- `POST /api/borrows/:borrowId/submit` - Return a book (protected)
- `GET /api/borrows/history` - Get borrow history (protected)

### Payments
- `GET /api/payments/history` - Get payment history (protected)
- `POST /api/payments/:paymentId/pay` - Mark payment as paid (protected)

### Dashboard
- `GET /api/dashboard/summary` - Get dashboard summary (protected)

## 📝 Usage

1. **Sign Up**: Create a new account with name, email, student ID, and password
2. **Login**: Access your account
3. **Browse Books**: View available books with pricing information
4. **Borrow**: Select a book and specify borrowing duration (1-30 days)
5. **Active Borrows**: Track your current borrows with due dates
6. **Return**: Submit book returns with automatic overdue calculation
7. **History**: View complete borrowing history
8. **Payments**: Track and manage payment status
9. **Dashboard**: Overview of your library activity

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- Protected routes
- Input validation
- Unauthorized access prevention

## 💡 Business Rules

- Students can borrow only one book at a time
- Maximum borrowing period: 30 days
- Cannot borrow if there's outstanding debt
- Overdue fee: 50% of daily price per overdue day
- Books must be available to borrow
- Return date can be manually inputted (mock return)

## 🎨 UI Features

- Responsive design with Tailwind CSS
- Toast notifications for user feedback
- Modal dialogs for borrowing and returning
- Color-coded status indicators
- Real-time cost calculation
- Clean and intuitive interface

## 📊 Data Models

### User
- Name, Email, Password, Student ID
- Balance, Total Debt
- Active Borrow Status

### Book
- Title, Author, Book ID
- Price Per Day, Group Price Per Day
- Availability Status

### Borrow
- User, Book references
- Borrow Date, Due Date, Return Date
- Number of Days, Total Cost
- Overdue Days, Overdue Amount
- Status (Active/Returned/Overdue)

### Payment
- User, Borrow references
- Amount, Status
- Payment Date

## 🚧 Future Enhancements

- Group borrowing feature
- Real payment gateway integration
- Email notifications
- Book reservations
- Advanced search and filters
- User reviews and ratings
- Admin dashboard
- Fine management system

## 📄 License

This project is created for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
