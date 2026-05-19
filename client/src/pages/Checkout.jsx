import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import api from '../api/axios.js';
import Message from '../components/Message.jsx';
import { formatINR } from '../utils/formatPrice.js';
import { calculateOrderTotals } from '../utils/orderTotals.js';

function Checkout() {
  const { user } = useAuth();
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { tax, shipping, total } = calculateOrderTotals(subtotal);

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
    <div className="page-container py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      {error && <Message>{error}</Message>}

      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={placeOrder} className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">Shipping address</h2>
          <div>
            <label className="mb-1 block text-sm font-medium">Address</label>
            <input className="input" required value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input className="input" required value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">PIN code</label>
              <input className="input" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Country</label>
            <input className="input" required value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>

          <h2 className="pt-4 text-lg font-semibold">Payment</h2>
          <select className="input" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option>UPI</option>
            <option>Credit / Debit Card</option>
            <option>Cash on Delivery</option>
            <option>Net Banking</option>
          </select>

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Placing order...' : `Pay ${formatINR(total)}`}
          </button>
        </form>

        <div className="card h-fit p-6">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between text-stone-600">
                <span className="truncate pr-2">{item.name} × {item.qty}</span>
                <span>{formatINR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span>GST</span><span>{formatINR(tax)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
          </div>
          <div className="mt-3 flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-brand-700">{formatINR(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
