import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import { addRecentlyViewed } from '../hooks/useRecentlyViewed.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import ProductReviews from '../components/ProductReviews.jsx';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wishlistMsg, setWishlistMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        addRecentlyViewed(data);
      } catch {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    navigate('/cart');
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await toggleWishlist(product._id);
      setWishlistMsg(isInWishlist(product._id) ? 'Removed from wishlist' : 'Added to wishlist');
      setTimeout(() => setWishlistMsg(''), 2000);
    } catch {
      setWishlistMsg('Wishlist update failed');
    }
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="page-container">
        <Message>{error}</Message>
        <Link to="/products" className="text-brand-700">← Back to shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="page-container">
      <Link to="/products" className="text-sm text-stone-500 hover:text-brand-700">← Back to shop</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
        </div>
        <div>
          <span className="text-xs font-bold uppercase text-brand-700">{product.category}</span>
          <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
          <p className="text-stone-500">{product.brand}</p>
          <p className="mt-4 text-3xl font-bold text-brand-700">${product.price.toFixed(2)}</p>
          <p className="mt-4 text-stone-600">{product.description}</p>
          <p className="mt-2 text-sm">
            {product.countInStock > 0 ? (
              <span className="text-green-700">In stock ({product.countInStock})</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )}
          </p>

          {product.countInStock > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))} className="input max-w-[100px]">
                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
              <button type="button" className="btn btn-primary" onClick={addToCartHandler}>Add to cart</button>
              <button type="button" className="btn btn-outline" onClick={handleWishlist}>
                {inWishlist ? '♥ In wishlist' : '♡ Add to wishlist'}
              </button>
            </div>
          )}
          {wishlistMsg && <p className="mt-2 text-sm text-brand-700">{wishlistMsg}</p>}
        </div>
      </div>

      <ProductReviews product={product} onReviewAdded={(p) => setProduct(p)} />
    </div>
  );
}

export default ProductDetail;
