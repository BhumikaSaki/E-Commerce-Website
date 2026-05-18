import { useState } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

function ProductReviews({ product, onReviewAdded }) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post(`/products/${product._id}/reviews`, { rating, comment });
      onReviewAdded(data.product);
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold">Reviews ({product.numReviews})</h2>
      <div className="mb-4 flex items-center gap-2">
        <span className="text-2xl font-bold text-brand-700">★ {product.rating?.toFixed(1) || '0.0'}</span>
        <span className="text-stone-500">average rating</span>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="card mb-6 p-4">
          <label className="mb-2 block text-sm font-medium">Your rating</label>
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input mb-3 max-w-xs">
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} ★
              </option>
            ))}
          </select>
          <label className="mb-2 block text-sm font-medium">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            rows={3}
            className="input mb-3"
            placeholder="Share your experience..."
          />
          {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {product.reviews?.length === 0 && <p className="text-stone-500">No reviews yet.</p>}
        {product.reviews?.map((review) => (
          <div key={review._id} className="card p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium">{review.name}</span>
              <span className="text-brand-700">{'★'.repeat(review.rating)}</span>
            </div>
            <p className="text-sm text-stone-600">{review.comment}</p>
            <p className="mt-1 text-xs text-stone-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductReviews;
