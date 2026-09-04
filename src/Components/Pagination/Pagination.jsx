import React from "react";
import {
  PaginationWrapper,
  PageButton,
  Ellipsis,
  TotalRecords,
} from "./Pagination.styles";

const Pagination = ({ currentPage, totalPages, totalRecords, onPageChange }) => {
  if (totalPages <= 1 && totalRecords === undefined) return null;

  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <PaginationWrapper>
      {totalRecords !== undefined && (
        <TotalRecords>TOTAL RECORDS: {totalRecords}</TotalRecords>
      )}
      {totalPages > 1 && (
        <>
      <PageButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        «
      </PageButton>

      {getPages().map((page, index) =>
        page === "..." ? (
          <Ellipsis key={index}>...</Ellipsis>
        ) : (
          <PageButton
            key={page}
            $active={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageButton>
        )
      )}

      <PageButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        »
      </PageButton>
        </>
      )}
    </PaginationWrapper>
  );
};

export default Pagination;