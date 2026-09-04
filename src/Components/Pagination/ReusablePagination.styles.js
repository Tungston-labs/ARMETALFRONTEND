import styled from "styled-components";

export const PaginationWrapper = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: auto;
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 16px 0;
  z-index: 10;
`;

export const TotalRecords = styled.span`
  margin-right: auto;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
`;

export const ArrowButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.3s;

  &:hover:not(:disabled) {
    background: #2563eb;
    color: #fff;
    border-color: #2563eb;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const PageNumber = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#2563eb" : "#fff")};
  color: ${({ $active }) => ($active ? "#fff" : "#333")};

  font-size: 14px;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #2563eb;
    color: #fff;
    border-color: #2563eb;
  }
`;

export const Ellipsis = styled.div`
  width: 30px;
  height: 30px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: 600;
  color: #666;
`;