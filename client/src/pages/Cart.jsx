import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatINR } from '../utils/formatPrice.js';
import { calculateOrderTotals } from '../utils/orderTotals.js';
import { FREE_SHIPPING_MIN } from '../constants/commerce.js';

function Cart() {
  const { cartItems, removeFromCart, updateQty, subtotal } = useCart();
  const { tax, shipping, total } = calculateOrderTotals(subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="page-container py-12 text-center">
        <h1 className="text-3xl font-bold">Your cart</h1>
        <p className="mt-4 text-stone-500">Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary mt-6 inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <h1 className="mb-8 text-3xl font-bold">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cartItems.map((item) => (
            <div key={item._id} className="card flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <img src={item.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <Link to={`/product/${item._id}`} className="font-semibold hover:text-brand-700">
                  {item.name}
                </Link>
                <p className="text-brand-700">{formatINR(item.price)}</p>
              </div>
              <select
                value={item.qty}
                onChange={(e) => updateQty(item._id, Number(e.target.value))}
                className="input max-w-[80px]"
              >
                {[...Array(10).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
              <span className="font-bold">{formatINR(item.price * item.qty)}</span>
              <button
                type="button"
                onClick={() => removeFromCart(item._id)}
                className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-600"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="card sticky top-24 h-fit p-6">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <div className="space-y-2 text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (10%)</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span>
            </div>
            {subtotal < FREE_SHIPPING_MIN && (
              <p className="text-xs text-brand-700">
                Add {formatINR(FREE_SHIPPING_MIN - subtotal)} more for free shipping
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>
            <span className="text-brand-700">{formatINR(total)}</span>
          </div>
          <Link to="/checkout" className="btn btn-primary mt-6 w-full">
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
