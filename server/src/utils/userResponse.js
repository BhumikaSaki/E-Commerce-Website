import { formatPhoneDisplay } from './authHelpers.js';

export const formatUser = (user, token = null) => {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    countryCode: user.countryCode || '+91',
    phoneDisplay: formatPhoneDisplay(user),
    isAdmin: user.isAdmin,
    avatar: user.avatar || '',
    wishlistCount: user.wishlist?.length ?? 0,
  };
  if (token) payload.token = token;
  return payload;
};
