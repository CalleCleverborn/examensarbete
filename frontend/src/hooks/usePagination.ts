import { useWindowSize } from "./useWindowSize";

export interface UsePaginationProps {
  totalPages: number;
  currentPage: number;
}

export function usePagination({ totalPages, currentPage }: UsePaginationProps) {
  const { width } = useWindowSize(); 
  const isMobile = width <= 768; 

  function getDisplayedPages(): Array<number | string> {
    if (!isMobile || totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: Array<number | string> = [1];

    if (currentPage > 3) {
      pages.push("...");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let p = startPage; p <= endPage; p++) {
      pages.push(p);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  }

  const displayedPages = getDisplayedPages();

  return {
    displayedPages,
    isMobile,
  };
}
