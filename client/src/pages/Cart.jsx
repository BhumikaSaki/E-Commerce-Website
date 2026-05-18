import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import './Cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQty, subtotal } = useCart();

  const tax = Number((subtotal * 0.1).toFixed(2));
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container page cart-page">
        <h1 className="page-title">Your cart</h1>
        <p className="empty-state">Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container page cart-page">
      <h1 className="page-title">Your cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/product/${item._id}`}>{item.name}</Link>
                <p>${item.price.toFixed(2)}</p>
              </div>
              <select
                value={item.qty}
                onChange={(e) => updateQty(item._id, Number(e.target.value))}
              >
                {[...Array(10).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
              <span className="cart-item-total">${(item.price * item.qty).toFixed(2)}</span>
              <button
                type="button"
                className="cart-remove"
                onClick={() => removeFromCart(item._id)}
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary btn-block">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
