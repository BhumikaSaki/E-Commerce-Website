import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import PasswordInput from '../components/PasswordInput.jsx';
import Toast from '../components/Toast.jsx';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setToast({ message: 'Passwords do not match', type: 'error' });
      return;
    }
    setLoading(true);
    setToast(null);

    try {
      const { data } = await api.put(`/auth/reset-password/${token}`, { password });
      setToast({ message: data.message, type: 'success' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Reset failed',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="page-container py-12 text-center">
        <p>Invalid reset link.</p>
        <Link to="/forgot-password" className="text-brand-700">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold">Set new password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <PasswordInput
            id="password"
            label="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            autoComplete="new-password"
          />
          <PasswordInput
            id="confirm"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Updating...' : 'Reset password'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          <Link to="/login" className="text-brand-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
