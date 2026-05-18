import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

function Wishlist() {
  const { user } = useAuth();
  const { wishlist, loading } = useWishlist();

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="page-container">
      <h1 className="mb-8 text-3xl font-bold">My wishlist</h1>
      {loading ? (
        <Loader />
      ) : wishlist.length === 0 ? (
        <p className="text-stone-500">
          Your wishlist is empty. <Link to="/products" className="text-brand-700">Browse products</Link>
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
