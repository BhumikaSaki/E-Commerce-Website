import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../api/axios.js';
import Message from '../components/Message.jsx';
import './Checkout.css';

function Checkout() {
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tax = Number((subtotal * 0.1).toFixed(2));
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (!user) {
    navigate('/login', { state: { from: '/checkout' } });
    return null;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data: order } = await api.post('/orders', {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: { address, city, postalCode, country },
        paymentMethod,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      });

      await api.put(`/orders/${order._id}/pay`);
      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page checkout-page">
      <h1 className="page-title">Checkout</h1>
      {error && <Message>{error}</Message>}

      <div className="checkout-layout">
        <form onSubmit={placeOrder} className="checkout-form">
          <h2>Shipping address</h2>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input id="city" required value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="postalCode">Postal code</label>
            <input
              id="postalCode"
              required
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              id="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <h2>Payment</h2>
          <div className="form-group">
            <label htmlFor="payment">Method</label>
            <select
              id="payment"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>PayPal</option>
              <option>Credit Card</option>
              <option>Cash on Delivery</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Placing order...' : 'Place order'}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order summary</h2>
          {cartItems.map((item) => (
            <div key={item._id} className="checkout-item">
              <span>
                {item.name} × {item.qty}
              </span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-row">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
