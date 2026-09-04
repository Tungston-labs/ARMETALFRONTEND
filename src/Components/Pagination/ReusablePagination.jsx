import React from "react";
import {
  PaginationWrapper,
  //   PageButton,
  PageNumber,
  Ellipsis,
  ArrowButton,
  TotalRecords,
} from "./ReusablePagination.styles";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const ReusablePagination = ({ currentPage, totalPages, totalRecords, onPageChange }) => {
  // Nothing to paginate — don't render anything until there's more than one page
  if ((!totalPages || totalPages <= 1) && totalRecords === undefined) return null;

  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 4) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <PaginationWrapper>
      {totalRecords !== undefined && (
        <TotalRecords>TOTAL RECORDS: {totalRecords}</TotalRecords>
      )}
      {totalPages > 1 && (
        <>
      <ArrowButton
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <FaAngleLeft />
      </ArrowButton>

      {getPages().map((page, index) =>
        page === "..." ? (
          <Ellipsis key={index}>...</Ellipsis>
        ) : (
          <PageNumber
            key={page}
            $active={currentPage === page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageNumber>
        )
      )}

      <ArrowButton
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <FaAngleRight />
      </ArrowButton>
        </>
      )}
    </PaginationWrapper>
  );
};

export default ReusablePagination;