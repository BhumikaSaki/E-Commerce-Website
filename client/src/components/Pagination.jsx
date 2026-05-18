function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="btn btn-outline btn-sm disabled:opacity-40"
      >
        Previous
      </button>

      {start > 1 && (
        <>
          <button type="button" onClick={() => onPageChange(1)} className="btn btn-outline btn-sm">
            1
          </button>
          {start > 2 && <span className="px-1 text-stone-400">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          className={`btn btn-sm min-w-[2.5rem] ${p === currentPage ? 'btn-primary' : 'btn-outline'}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-stone-400">…</span>}
          <button type="button" onClick={() => onPageChange(totalPages)} className="btn btn-outline btn-sm">
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="btn btn-outline btn-sm disabled:opacity-40"
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
