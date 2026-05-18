import { useState, useRef } from 'react';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const ALLOWED = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE = 2 * 1024 * 1024;

function ProfilePhotoUpload() {
  const { user, updateAvatar } = useAuth();
  const [preview, setPreview] = useState(user?.avatar || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    setError('');
    if (!ALLOWED.includes(file.type)) {
      setError('Only JPG, PNG, JPEG, and WEBP allowed');
      return;
    }
    if (file.size > MAX_SIZE) {
      setError('Max file size is 2MB');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append('avatar', file);
    setLoading(true);

    try {
      const { data } = await api.post('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateAvatar(data.avatar, data.user);
      setPreview(data.avatar);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
      setPreview(user?.avatar || '');
    } finally {
      setLoading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-brand-100">
        <img
          src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=0f766e&color=fff`}
          alt="Profile"
          className="h-full w-full object-cover"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <button type="button" className="btn btn-primary btn-sm" disabled={loading} onClick={() => inputRef.current?.click()}>
        {loading ? 'Uploading...' : 'Change photo'}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-center text-xs text-stone-500">JPG, PNG, WEBP · max 2MB</p>
    </div>
  );
}

export default ProfilePhotoUpload;
