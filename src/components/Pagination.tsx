import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { setPage } from "../store/itemsSlice";
import '../styles/Pagination.css'
const Pagination: React.FC = () => {
  const dispatch = useDispatch();
  const { currentPage, items, itemsPerPage } = useSelector(
    (state: RootState) => state.items
  );

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(setPage(currentPage + 1));
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      dispatch(setPage(currentPage - 1));
    }
  };

  const handlePageClick = (page: number) => {
    dispatch(setPage(page));
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages.map((page, index) =>
      typeof page === "number" ? (
        <button
          key={index}
          className={`page-number ${page === currentPage ? "active" : ""}`}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </button>
      ) : (
        <button key={index} className="page-number ellipsis" disabled>
          {page}
        </button>
      )
    );
  };

  return (
    <div className="pagination">
      <button
        className="page-nav"
        onClick={handlePrevPage}
        disabled={currentPage === 1}
      >
        <span>&lt;</span> {/* Left arrow */}
      </button>
      {renderPageNumbers()}
      <button
        className="page-nav"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
      >
        <span>&gt;</span> {/* Right arrow */}
      </button>
    </div>
  );
};

export default Pagination;
