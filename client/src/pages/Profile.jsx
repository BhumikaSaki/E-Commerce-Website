import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload.jsx';
import ChangePassword from '../components/ChangePassword.jsx';
import PhoneInput from '../components/PhoneInput.jsx';
import Toast from '../components/Toast.jsx';
import api from '../api/axios.js';
import { validatePhone } from '../utils/phoneValidation.js';

function Profile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCountryCode(user.countryCode || '+91');
      setPhone(user.phone || '');
    }
  }, [user]);

  const showToast = (message, type = 'success') => setToast({ message, type });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (phone) {
      const phoneValidation = validatePhone(phone);
      if (phoneValidation) {
        setPhoneError(phoneValidation);
        return;
      }
    }
    setPhoneError('');
    setProfileLoading(true);
    try {
      await api.put('/users/profile', { name, email, phone, countryCode });
      await refreshUser();
      showToast('Profile updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || 'Update failed', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="page-container py-8 sm:py-12">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <h1 className="mb-2 text-3xl font-bold">Account settings</h1>
      <p className="mb-8 text-stone-500">Manage your profile, photo, and security</p>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="card p-6 sm:p-8">
          <h2 className="mb-6 text-lg font-semibold">Profile photo</h2>
          <ProfilePhotoUpload />
        </section>

        <section className="card p-6 sm:p-8">
          <h2 className="mb-6 text-lg font-semibold">Personal information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <PhoneInput
              countryCode={countryCode}
              onCountryCodeChange={setCountryCode}
              phone={phone}
              onPhoneChange={setPhone}
              error={phoneError}
            />
            <button
              type="submit"
              className="btn btn-primary w-full transition hover:shadow-md disabled:opacity-60"
              disabled={profileLoading}
            >
              {profileLoading ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </section>

        <section className="card p-6 sm:p-8 lg:col-span-2">
          <h2 className="mb-2 text-lg font-semibold">Change password</h2>
          <p className="mb-6 text-sm text-stone-500">Use a strong password you don&apos;t use elsewhere.</p>
          <div className="max-w-md">
            <ChangePassword
              onSuccess={(msg) => showToast(msg, 'success')}
              onError={(msg) => showToast(msg, 'error')}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
