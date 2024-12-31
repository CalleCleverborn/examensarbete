import React from "react";
import { PageMeta } from "../hooks/useVoiceModels";
import { usePagination } from "../hooks/usePagination";
import "./_Pagination.scss";

interface PaginationProps {
  pageMeta: PageMeta;
  page: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pageMeta,
  page,
  onPageChange,
}) => {
  if (!pageMeta || pageMeta.lastPage <= 1) return null;

  const { displayedPages } = usePagination({
    totalPages: pageMeta.lastPage,
    currentPage: page,
  });

  return (
    <div className="page-numbers">
      {displayedPages.map((num, idx) => {
        if (num === "...") {
          return (
            <span key={`dots-${idx}`} className="page-dots">
              ...
            </span>
          );
        }

        const pageNumber = num as number;
        return (
          <span
            key={pageNumber}
            className={`page-number ${pageNumber === page ? "active" : ""}`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </span>
        );
      })}
    </div>
  );
};

export default Pagination;
