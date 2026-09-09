import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  prevLabel,
  nextLabel,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter((page) => {
    if (totalPages <= 7) return true;
    if (page === 1 || page === totalPages) return true;
    return Math.abs(page - currentPage) <= 1;
  });

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-12 mb-4"
      aria-label="Pagination"
    >
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1.5 text-xs uppercase tracking-widest font-bold text-museum-muted border border-museum-800 rounded hover:text-museum-gold hover:border-museum-gold/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {prevLabel}
      </button>

      {visiblePages.map((page, index) => {
        const prevPage = visiblePages[index - 1];
        const showEllipsis = prevPage !== undefined && page - prevPage > 1;

        return (
          <React.Fragment key={page}>
            {showEllipsis && (
              <span className="px-2 text-museum-muted font-serif">…</span>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePageChange(page);
              }}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`min-w-[2.5rem] px-2 py-2 text-sm font-serif rounded border transition-colors touch-manipulation select-none ${
                page === currentPage
                  ? 'bg-museum-gold text-museum-950 border-museum-gold font-bold'
                  : 'text-museum-ivory border-museum-800 hover:border-museum-gold/50 hover:text-museum-gold'
              }`}
            >
              {page}
            </button>
          </React.Fragment>
        );
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1.5 text-xs uppercase tracking-widest font-bold text-museum-muted border border-museum-800 rounded hover:text-museum-gold hover:border-museum-gold/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {nextLabel}
      </button>
    </nav>
  );
};

export default Pagination;
