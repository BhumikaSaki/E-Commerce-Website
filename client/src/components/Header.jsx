import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';
import SearchBar from './SearchBar.jsx';

function Header() {
  const { user, logout } = useAuth();
  const { itemsCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const avatarUrl =
    user?.avatar ||
    (user ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f766e&color=fff` : null);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-700 font-serif text-white">S</span>
          ShopBy
        </Link>

        <div className="order-3 w-full lg:order-2 lg:flex-1 lg:px-4">
          <SearchBar />
        </div>

        <nav className="order-2 ml-auto flex items-center gap-4 text-sm font-medium text-stone-600 lg:order-3">
          <Link to="/products" className="hover:text-brand-700">Shop</Link>
          {user && <Link to="/wishlist" className="hover:text-brand-700">Wishlist ({wishlistCount})</Link>}
          {user && <Link to="/orders" className="hover:text-brand-700">Orders</Link>}
          {user?.isAdmin && <Link to="/admin" className="text-brand-700 hover:underline">Admin</Link>}
        </nav>

        <div className="order-2 flex items-center gap-3 lg:order-4">
          <Link to="/cart" className="relative rounded-lg p-2 hover:bg-stone-100" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            {itemsCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-amber-400 px-1 text-xs font-bold">
                {itemsCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 rounded-xl p-1 hover:bg-stone-100">
                <img src={avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-100" />
                <span className="hidden text-sm sm:inline">{user.name.split(' ')[0]}</span>
              </Link>
              <button type="button" onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
