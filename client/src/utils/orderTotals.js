import { FREE_SHIPPING_MIN, SHIPPING_FEE, TAX_RATE } from '../constants/commerce.js';

export function calculateOrderTotals(subtotal) {
  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
  const total = subtotal + tax + shipping;
  return { tax, shipping, total };
}
