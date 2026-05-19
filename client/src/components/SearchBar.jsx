import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { formatINR } from '../utils/formatPrice.js';

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get('/products/search/suggest', {
          params: { q: debouncedQuery, limit: 6 },
        });
        setSuggestions(data);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestions();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder="Search products..."
          className="input w-full pr-10 text-sm"
          autoComplete="off"
        />
        {loading && (
          <span className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        )}
      </form>

      {open && debouncedQuery.length >= 2 && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg">
          {suggestions.length === 0 && !loading ? (
            <p className="px-4 py-3 text-sm text-stone-500">No products found</p>
          ) : (
            <ul>
              {suggestions.map((item) => (
                <li key={item._id}>
                  <Link
                    to={`/product/${item._id}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery('');
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-stone-50"
                  >
                    <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-sm text-brand-700">{formatINR(item.price)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
