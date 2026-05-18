import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload.jsx';
import api from '../api/axios.js';
import Message from '../components/Message.jsx';

function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put('/users/profile', { name, email });
      await refreshUser();
      setMessage('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-lg">
      <h1 className="mb-8 text-3xl font-bold">My profile</h1>
      <ProfilePhotoUpload />
      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6">
        {message && <Message variant="success">{message}</Message>}
        {error && <Message>{error}</Message>}
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
