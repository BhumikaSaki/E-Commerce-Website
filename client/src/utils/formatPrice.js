/**
 * Format price in Indian Rupees (no decimals for whole rupee display).
 * Examples: ₹999 | ₹1,499 | ₹24,999
 */
export function formatINR(amount) {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
