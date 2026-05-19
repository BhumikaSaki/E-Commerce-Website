import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { formatINR } from '../utils/formatPrice.js';

function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
      } catch {
        setError('Order not found');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user, navigate]);

  if (!user) return null;
  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="container page">
        <Message>{error}</Message>
        <Link to="/orders">← Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="container page order-detail-page">
      <Link to="/orders" className="back-link">
        ← Back to orders
      </Link>
      <h1 className="page-title">Order #{order._id.slice(-8)}</h1>

      {order.isPaid && (
        <div className="alert alert-success">Payment confirmed — thank you for your order!</div>
      )}

      <div className="order-detail-grid">
        <section className="order-section">
          <h2>Items</h2>
          {order.orderItems.map((item) => (
            <div key={item.product} className="order-item-row">
              <img src={item.image} alt={item.name} />
              <div>
                <p>{item.name}</p>
                <p className="muted">
                  {item.qty} × {formatINR(item.price)}
                </p>
              </div>
              <span className="font-medium">{formatINR(item.qty * item.price)}</span>
            </div>
          ))}
        </section>

        <section className="order-section">
          <h2>Shipping</h2>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>

          <h2>Payment</h2>
          <p>{order.paymentMethod}</p>
          <p className="mt-4 text-xl font-bold text-brand-700">Total: {formatINR(order.totalPrice)}</p>
        </section>
      </div>
    </div>
  );
}

export default OrderDetail;
