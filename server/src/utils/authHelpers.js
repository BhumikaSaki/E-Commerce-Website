export const normalizeEmail = (email) => email?.trim().toLowerCase() || '';

/** Extract last 10 digits for Indian mobile numbers */
export const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length < 10) return null;
  return digits.slice(-10);
};

export const formatPhoneDisplay = (user) => {
  if (!user?.phone) return '—';
  const code = user.countryCode || '+91';
  return `${code} ${user.phone}`;
};
