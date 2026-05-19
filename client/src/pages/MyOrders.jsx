import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import Message from '../components/Message.jsx';
import { formatINR } from '../utils/formatPrice.js';

function MyOrders() {
  const { user } = useAuth();
  const [data, setData] = useState({ paginatedData: [], currentPage: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data: res } = await api.get('/orders/myorders', { params: { page, limit: 10 } });
        setData(res);
      } catch {
        setError('Could not load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, page]);

  if (!user) return <Navigate to="/login" />;
  if (loading) return <Loader />;

  return (
    <div className="page-container">
      <h1 className="mb-8 text-3xl font-bold">My orders</h1>
      {error && <Message>{error}</Message>}
      {data.paginatedData.length === 0 ? (
        <p className="text-stone-500">No orders yet.</p>
      ) : (
        <>
          <div className="space-y-3">
            {data.paginatedData.map((order) => (
              <Link
                key={order._id}
                to={`/order/${order._id}`}
                className="card flex items-center justify-between p-4 hover:shadow-md"
              >
                <div>
                  <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-700">{formatINR(order.totalPrice)}</p>
                  <span className={`text-xs font-medium ${order.isPaid ? 'text-green-700' : 'text-amber-700'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Pagination currentPage={data.currentPage} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}

export default MyOrders;
