const STORAGE_KEY = 'shopby_recently_viewed';
const MAX_ITEMS = 8;

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addRecentlyViewed(product) {
  if (!product?._id) return;
  const list = getRecentlyViewed().filter((p) => p._id !== product._id);
  list.unshift({
    _id: product._id,
    name: product.name,
    image: product.image,
    price: product.price,
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
}

export function useRecentlyViewed() {
  return getRecentlyViewed();
}
