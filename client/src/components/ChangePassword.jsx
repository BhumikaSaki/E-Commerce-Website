import { useState } from 'react';
import api from '../api/axios.js';

function ChangePassword({ onSuccess, onError }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const validate = () => {
    if (!currentPassword) return 'Current password is required';
    if (newPassword.length < 6) return 'New password must be at least 6 characters';
    if (newPassword !== confirmPassword) return 'New passwords do not match';
    if (currentPassword === newPassword) return 'New password must be different from current password';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    const err = validate();
    if (err) {
      setLocalError(err);
      onError?.(err);
      return;
    }

    setLoading(true);
    try {
      await api.put('/users/password', { currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess?.('Password changed successfully');
    } catch (apiErr) {
      const msg = apiErr.response?.data?.message || 'Failed to change password';
      setLocalError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {localError && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {localError}
        </p>
      )}
      <div>
        <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-stone-700">
          Current password
        </label>
        <input
          id="currentPassword"
          type="password"
          className="input"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-stone-700">
          New password
        </label>
        <input
          id="newPassword"
          type="password"
          className="input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          autoComplete="new-password"
          required
        />
        <p className="mt-1 text-xs text-stone-500">Minimum 6 characters</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-stone-700">
          Confirm new password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className="input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full transition hover:shadow-md disabled:opacity-60"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Updating...
          </span>
        ) : (
          'Change password'
        )}
      </button>
    </form>
  );
}

export default ChangePassword;
