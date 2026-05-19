import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import Toast from '../components/Toast.jsx';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [devLink, setDevLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    setDevLink('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', {
        email: email.trim().toLowerCase(),
      });
      setToast({ message: data.message, type: 'success' });
      if (data.devResetUrl) setDevLink(data.devResetUrl);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Request failed. Try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">Forgot password</h1>
        <p className="mt-2 text-sm text-stone-500">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        {devLink && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-900">
            <p className="font-medium">Dev mode — reset link:</p>
            <a href={devLink} className="mt-1 break-all text-brand-700 underline">
              {devLink}
            </a>
          </div>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
