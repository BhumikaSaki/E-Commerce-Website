import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed.js';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const recent = useRecentlyViewed();

  useEffect(() => {
    api.get('/products', { params: { page: 1, limit: 4 } })
      .then(({ data }) => setProducts(data.paginatedData || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="bg-gradient-to-br from-teal-50 via-stone-50 to-amber-50 py-20">
        <div className="page-container">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">Welcome to ShopBy</p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl lg:text-6xl">
            Discover products you&apos;ll <em className="text-brand-700">love</em>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-stone-600">
            Curated essentials with live search, wishlists, reviews, and secure checkout.
          </p>
          <Link to="/products" className="btn btn-primary mt-8">Browse collection</Link>
        </div>
      </section>

      <section className="page-container py-12">
        <div className="mb-8 flex justify-between">
          <h2 className="text-2xl font-bold">Featured products</h2>
          <Link to="/products" className="font-semibold text-brand-700 hover:underline">View all →</Link>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section className="border-t border-stone-200 bg-white py-12">
          <div className="page-container">
            <h2 className="mb-6 text-2xl font-bold">Recently viewed</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {recent.map((p) => (
                <Link key={p._id} to={`/product/${p._id}`} className="card overflow-hidden">
                  <img src={p.image} alt="" className="aspect-square object-cover" />
                  <p className="truncate p-2 text-sm font-medium">{p.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Home;
