import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Accessories', 'Footwear', 'Home'];

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || '-createdAt';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { page, limit: 12, sort };
        if (keyword) params.keyword = keyword;
        if (category && category !== 'All') params.category = category;
        const { data } = await api.get('/products', { params });
        setProducts(data.paginatedData);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalItems: data.totalItems,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, page, sort]);

  const setPage = (p) => {
    const params = { page: String(p) };
    if (keyword) params.keyword = keyword;
    if (category && category !== 'All') params.category = category;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  const handleCategory = (cat) => {
    const params = { page: '1' };
    if (keyword) params.keyword = keyword;
    if (cat !== 'All') params.category = cat;
    setSearchParams(params);
  };

  return (
    <div className="page-container">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Shop all products</h1>
          <p className="text-stone-500">{pagination.totalItems} products</p>
        </div>
        <select
          value={sort}
          onChange={(e) => {
            const params = Object.fromEntries(searchParams);
            params.sort = e.target.value;
            params.page = '1';
            setSearchParams(params);
          }}
          className="input max-w-[200px]"
        >
          <option value="-createdAt">Newest</option>
          <option value="price">Price: Low</option>
          <option value="-price">Price: High</option>
          <option value="-rating">Top rated</option>
        </select>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              (category || 'All') === cat ? 'bg-brand-700 text-white' : 'bg-white border border-stone-200 hover:border-brand-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {error && <Message>{error}</Message>}
      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <p className="py-12 text-center text-stone-500">No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default Products;
