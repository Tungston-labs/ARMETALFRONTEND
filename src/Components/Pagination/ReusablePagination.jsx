import React from "react";
import {
  PaginationWrapper,
  PageNumber,
  Ellipsis,
  ArrowButton,
  TotalRecords,
} from "./ReusablePagination.styles";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ReusablePagination = ({
  currentPage = 1,
  totalPages,
  totalRecords,
  onPageChange,
}) => {
  if ((!totalPages || totalPages <= 1) && totalRecords === undefined) {
    return null;
  }

  const goTo = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange?.(page);
  };

  // Builds e.g.  1 … 4 5 6 … 10   (never skips a page without an ellipsis)
  const getPages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // near the start / end, show a few more pages so the width stays steady
    if (currentPage <= 3) end = 4;
    if (currentPage >= totalPages - 2) start = totalPages - 3;

    // don't hide a single page behind an ellipsis, just show it
    if (start === 3) start = 2;
    if (end === totalPages - 2) end = totalPages - 1;

    const pages = [1];

    if (start > 2) pages.push("ellipsis-start");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("ellipsis-end");

    pages.push(totalPages);

    return pages;
  };

  return (
    <PaginationWrapper>
      {/* LEFT SIDE */}
      {totalRecords !== undefined && (
        <TotalRecords>
          TOTAL RECORDS: {totalRecords}
        </TotalRecords>
      )}

      {/* RIGHT SIDE */}
      {totalPages > 1 && (
        <>
          <ArrowButton
            type="button"
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => goTo(currentPage - 1)}
          >
            <FaAngleLeft />
          </ArrowButton>

          {getPages().map((page) =>
            typeof page === "string" ? (
              <Ellipsis key={page}>...</Ellipsis>
            ) : (
              <PageNumber
                key={page}
                type="button"
                $active={currentPage === page}
                aria-current={currentPage === page ? "page" : undefined}
                onClick={() => goTo(page)}
              >
                {page}
              </PageNumber>
            )
          )}

          <ArrowButton
            type="button"
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => goTo(currentPage + 1)}
          >
            <FaAngleRight />
          </ArrowButton>
        </>
      )}
    </PaginationWrapper>
  );
};

export default ReusablePagination;