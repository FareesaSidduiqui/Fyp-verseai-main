import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;

  const handleFirstPage = () => onPageChange(1);
  const handlePrevPage = () => onPageChange(currentPage - 1);
  const handleNextPage = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(totalPages);

  const generatePageNumbers = () => {
    let pages = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav className="mx-auto flex max-w-xs justify-between space-x-5 pb-12 mb-10">
      <button
        onClick={handleFirstPage}
        disabled={isFirstPage}
        className={`flex items-center space-x-1 font-medium ${
          isFirstPage ? "text-gray-500 cursor-not-allowed" : "hover:text-cyan-400"
        }`}
        aria-label="First Page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M13.28 3.97a.75.75 0 010 1.06L6.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0zm6 0a.75.75 0 010 1.06L12.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        onClick={handlePrevPage}
        disabled={isFirstPage}
        className={`flex items-center space-x-1 font-medium ${
          isFirstPage ? "text-gray-500 cursor-not-allowed" : "hover:text-cyan-400"
        }`}
        aria-label="Previous Page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
        </svg>
      </button>

      <ul className="flex items-center">
        {generatePageNumbers().map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              className={`px-2 text-lg font-medium ${
                page === currentPage
                  ? "rounded-md text-2xl bg-gradient-to-t from-purple-500 to-cyan-400 bg-clip-text text-transparent"
                  : "text-gray-400 hover:text-cyan-400"
              } sm:px-3`}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={handleNextPage}
        disabled={isLastPage}
        className={`flex items-center space-x-1 font-medium ${
          isLastPage ? "text-gray-500 cursor-not-allowed" : "hover:text-cyan-400"
        }`}
        aria-label="Next Page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        onClick={handleLastPage}
        disabled={isLastPage}
        className={`flex items-center space-x-1 font-medium ${
          isLastPage ? "text-gray-500 cursor-not-allowed" : "hover:text-cyan-400"
        }`}
        aria-label="Last Page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M4.72 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 010-1.06zm6 0a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 010-1.06z" clipRule="evenodd" />
        </svg>
      </button>
    </nav>
  );
};

export default Pagination;