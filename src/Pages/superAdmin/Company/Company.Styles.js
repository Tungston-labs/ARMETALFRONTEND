// src/Components/CompanyTable.styles.js
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const Container = styled.div`
  padding:20px;
  font-family: "Segoe UI", sans-serif;
  min-height: 100vh;
  margin: 0 auto;
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .avatar {
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    .avatar {
      margin-top: 10px;
    }
  }
`;
export const Icon = styled.div`
  font-size: 1rem;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    align-items: stretch;
  }
`;
export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  h2 {
    font-family: "Satoshi";
    font-weight: 700;
    font-size: 22px;
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 16px;
    font-family: "Raleway";
  }
`;
export const HRManager = styled.div`
  display: flex;
  height: 30px;

  align-items: center;
  gap: 0.75rem;
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;
export const Title = styled.h2`
  font-size: 24px;
  margin: 0;
  margin-left: 10px;
  font-family: "Satoshi", sans-serif;
  font-weight: 700; /* 700 = Bold */
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left: 10px;
  margin-top: -1px;
  font-family: "Raleway", sans-serif;
  font-weight: 300; /* normal weight */
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(to right, #2a2a86, rgb(55, 90, 227));
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
`;

// Wrapper for input + icon
export const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 300px;
  width: 100%;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const SearchInput = styled.input`
  padding: 10px 12px 10px 40px; /* extra left padding for icon */
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  color: #888;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  border-radius: 10px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 1rem;
  font-size: 19px;
  font-family: "Satoshi", sans-serif;
  font-weight: 500;

  th,
  td {
    text-align: center;
    padding: 0.2rem;
    white-space: nowrap;
    background-color: white;
    border: none; 
  }

  th {
    background-color: #3352ba;
    color: white;
    font-family: "raleway";
    padding: 0.8rem;
        text-align: center;
  }

  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
    font-family: "satoshi";
  }

 
  tbody tr td:first-child {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  tbody tr td:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  tbody tr:hover td {
    background-color: #f5f5f5;
  }
`;

export const Th = styled.th`
  text-align: center; 
  vertical-align: middle;
  padding: 12px;
  background-color: #3352ba; 
  color: white; 
  font-size: 14px;
  font-family: "Raleway", sans-serif;
  font-weight: 600;
`;

export const Td = styled.td`
  padding: 12px;
  background: #fff;
  font-size: 14px;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
`;

export const IconButton = styled.button`
  background: inherit;
  color: ${({ danger }) => (danger ? "red" : "#1e293b")};
  border: none;
  padding: 8px;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

export const ImpersonateButton = styled.button`
  background: #475569;
  color: white;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start; 
  gap: 0.3rem;
  margin-top: 1.5rem;
  // padding: 0.6rem;

  span {
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 0.7rem;
  }

  .active {
    background: #1e3a8a;
    color: white;
    border-color: #1e3a8a;
  }
`;
