/**
 * Builds MongoDB skip/limit and returns paginated response shape.
 */
export const getPagination = (query, defaultLimit = 10) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const paginatedResponse = (data, totalItems, page, limit) => ({
  paginatedData: data,
  currentPage: page,
  totalPages: Math.ceil(totalItems / limit) || 1,
  totalItems,
});

export const getSortOption = (sortQuery, defaultSort = '-createdAt') => {
  const allowed = ['name', '-name', 'price', '-price', 'createdAt', '-createdAt', 'rating', '-rating'];
  return allowed.includes(sortQuery) ? sortQuery : defaultSort;
};
