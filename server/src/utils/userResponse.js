export const formatUser = (user, token = null) => {
  const payload = {
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    avatar: user.avatar || '',
    wishlistCount: user.wishlist?.length ?? 0,
  };
  if (token) payload.token = token;
  return payload;
};
