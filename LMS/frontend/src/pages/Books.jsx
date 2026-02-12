import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import BorrowModal from '../components/BorrowModal';
import { useAuth } from '../context/AuthContext';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { updateUser } = useAuth();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      if (data.success) {
        setBooks(data.books);
      }
    } catch (error) {
      toast.error('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleBorrowClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleBorrowSuccess = () => {
    fetchBooks();
    updateUser();
    setShowModal(false);
    setSelectedBook(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Books</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book._id} className="card hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
              <p className="text-gray-600 mb-2">by {book.author}</p>
              <p className="text-sm text-gray-500">ID: {book.bookId}</p>
            </div>

            <div className="mb-4 space-y-1">
              <p className="text-gray-700">
                <span className="font-medium">Price/Day:</span> ${book.pricePerDay}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Group Price:</span> ${book.groupPricePerDay}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  book.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {book.isAvailable ? 'Available' : 'Borrowed'}
              </span>

              {book.isAvailable && (
                <button
                  onClick={() => handleBorrowClick(book)}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  Borrow
                </button>
              )}
            </div>

            {!book.isAvailable && book.currentBorrower && (
              <p className="text-xs text-gray-500 mt-2">
                Borrowed by: {book.currentBorrower.name}
              </p>
            )}
          </div>
        ))}
      </div>

      {showModal && selectedBook && (
        <BorrowModal
          book={selectedBook}
          onClose={() => {
            setShowModal(false);
            setSelectedBook(null);
          }}
          onSuccess={handleBorrowSuccess}
        />
      )}
    </div>
  );
};

export default Books;
