import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import Toast from '../components/Toast.jsx';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      await login(email, password);
      setToast({ message: 'Welcome back!', type: 'success' });
      setTimeout(() => navigate(redirect, { replace: true }), 400);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK' ? 'Cannot reach server. Is the API running?' : 'Login failed');
      setToast({ message: msg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container flex min-h-[70vh] items-center justify-center py-12">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="card w-full max-w-md p-8 shadow-md transition-shadow hover:shadow-lg">
        <h1 className="text-2xl font-bold text-stone-900">Sign in to ShopBy</h1>
        <p className="mt-1 text-stone-500">Welcome back! Enter your credentials.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (toast?.type === 'error') setToast(null);
              }}
            />
          </div>

          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (toast?.type === 'error') setToast(null);
            }}
            autoComplete="current-password"
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm font-medium text-brand-700 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full transition hover:shadow-md disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:underline">
            Create account
          </Link>
        </p>

        <div className="mt-4 rounded-xl border border-stone-100 bg-stone-50 p-3 text-xs text-stone-500">
          <p className="font-medium text-stone-700">Demo accounts (run npm run seed)</p>
          <p className="mt-1">demo@shopby.com / demo123</p>
          <p>admin@shopby.com / admin123</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
