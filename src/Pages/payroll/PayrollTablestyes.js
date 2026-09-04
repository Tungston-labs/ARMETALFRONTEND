import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa6";

export const Container = styled.div`
  font-family: "Segoe UI", sans-serif;
  padding: 20px;
`;

const Status = styled.span`
  color: ${({ $color }) => $color};
  background: transparent;
  padding: 0;
  border-radius: 0;
  font-weight: 500;
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  height: 30px;

  align-items: center;
  // gap: 0.75rem;
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
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(8px, 1vw, 20px);
  margin-bottom: clamp(10px, 1vw, 20px);
`;

export const HeaderImage = styled.img`
  height: 60px;
  @media (max-width: 768px) {
    margin-top: 10px;
    height: 50px;
  }
`;


export const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  gap: clamp(8px, 1vw, 20px);
  width: 100%;
  /* margin: 10px; */
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
 
  @media (max-width: 767px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const LeftBlock = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(8px, 1vw, 16px);
`;
export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 2px 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 600;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 0.8rem;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.2rem;
  }

  @media (min-width: 1440px) {
    font-size: 1.5rem;
  }

  @media (min-width: 2560px) {
    font-size: 2em;
  }

  @media (min-width: 3840px) {
    font-size: 4rem;
  }
`;

export const Subtitle = styled.p`
  // font-size: 1rem;
  color: #3250b5;
  margin: 0;
  font-family: Raleway;
  font-weight: 300;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }

  @media (min-width: 1440px) {
    font-size: 1rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  max-width: 450px;
  margin-top: 15px;
  padding: 12px;
  height: 44px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  font-family: "Satoshi", sans-serif;
  font-size: 1rem;

  @media (max-width: 1024px) {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
    height: 40px;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 8px;
    height: 36px;
  }

  @media (min-width: 2560px) {
    font-size: 1.4rem;
    padding: 16px;
    height: 60px;
  }
`;

export const BulkActionBar = styled.div`
  background: #304EB0;
  color: #fff;
  padding: 10px;
  margin: 20px 0 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  input[type="checkbox"] {
    margin-right: 8px;
    transform: scale(1);
  }

  strong {
    font-size: 1rem;
  }

  select {
    background: #fff;
    color: #000;
    min-width: 120px;
    padding: 6px 10px;
    font-size: 1rem;
    border-radius: 4px;
  }

  /* 📱 Small screens (mobile) */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;

    strong {
      font-size: 0.85rem;
    }

    select {
      width: 100%;
      font-size: 0.85rem;
      padding: 5px 8px;
    }

    input[type="checkbox"] {
      transform: scale(0.9);
      margin-right: 6px;
    }
  }

  /* 💻 Medium screens (tablets/laptops) */
  @media (min-width: 769px) and (max-width: 1440px) {
    strong {
      font-size: 1rem;
    }

    select {
      font-size: 1rem;
      padding: 6px 10px;
    }

    input[type="checkbox"] {
      transform: scale(1);
    }
  }

  /* 🖥️ Large screens (Full HD up to 2K) */
  @media (min-width: 1441px) and (max-width: 2560px) {
    strong {
      font-size: 1.1rem;
    }

    select {
      font-size: 1.1rem;
      padding: 8px 12px;
    }

    input[type="checkbox"] {
      transform: scale(1.1);
    }
  }

  @media (min-width: 2561px) {
    strong {
      font-size: 1.3rem;
    }

    select {
      font-size: 1.3rem;
      padding: 10px 14px;
    }

    input[type="checkbox"] {
      transform: scale(1.2);
    }

    gap: 14px;
    padding: 14px;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  max-height: 65vh;       
  overflow-y: auto;       
  overflow-x: hidden;   

  border: 1px solid #eee;
  border-radius: 10px;
  border:none;
  /* Optional: nice scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
`;


export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 1rem;
  text-align: left;
  font-family: "Satoshi";

  /* Scroll on small screens */
  // display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  tbody tr {
    box-shadow: 0px 0px 2.7px 0px rgba(0, 0, 0, 0.28);
  }

  /* Background color for even rows */
  tbody tr:nth-child(even) td {
    background-color: #e6ecff;
  }

  tbody tr td:first-child {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }

  tbody tr td:last-child {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  tbody tr:hover td {
    background-color: #f5f5f5;
  }
`;

export const Th = styled.th`
  background-color: #304eb0;
  font-weight: 600;
  text-align: left;
  color: white;
  font-family: "Raleway";
  padding: 8px;
  cursor: pointer;
  @media (min-width: 3840px) {
    font-size: 1.5rem;
  }
  @media (min-width: 2560px) and (max-width: 3839px) {
    font-size: 1.5rem;
  }
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.1rem;
  }
  @media (max-width: 1023px) {
    font-size: 1rem;
  }
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.7rem;
  }
`;

export const Td = styled.td`
  background: #fff;
  color: #000;
  font-family: "Satoshi", sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  text-align: left;
  white-space: nowrap;
  background-color: white;
  border: none;
  transition: all 0.2s ease;
  padding: 0px 8px;
  cursor: pointer;
  div {
    display: flex;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  /* 📱 Small screens (mobile) */
  @media (max-width: 768px) {
    font-size: 0.75rem;

    text-align: center;
    white-space: normal; /* allow wrapping */
  }

  /* 💻 Medium screens (tablet, small desktop) */
  @media (min-width: 769px) and (max-width: 1440px) {
    font-size: 0.85rem;
  }

  /* 🖥️ Large screens (full HD) */
  @media (min-width: 1441px) and (max-width: 1920px) {
        font-size: 0.9rem;
  }
  @media (min-width: 1921px) and (max-width: 2560px) {
    font-size: 0.9rem;
  }

  @media (min-width: 2561px) and (max-width: 3839px) {
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    padding: 3px;
    font-size: 1.5rem;
  }
`;

export const Tr = styled.tr`
  box-shadow: 0 0 0 1px #00000047;
`;

export const Select = styled.select`
  margin: 4px;
  width: 100%;
  min-width: 100px;
  padding: 6px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: "Satoshi", sans-serif;
  font-weight: 300;
  font-style: "italic";
  font-size: 1rem;
  appearance: none;

  /* Only the selected value background */
  background-color: ${(props) => props.$bg || "white"};
  color: ${(props) => props.$color || "black"};

  /* Default dropdown arrow */
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;

  option {
    background: white !important;
    color: black !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 0.85rem;
    padding: 5px 14px 5px 8px;
    background-size: 12px;
  }
  
`;

export const Selection = styled.select`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: "Satoshi", sans-serif;
  font-weight: 300;
  font-style: "italic";
  font-size: 1rem;
  appearance: none;
   width: 15%;
  background-color: ${(props) => props.$bg || "white"};
  color: ${(props) => props.$color || "black"};
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  option {
    background: white !important; 
    color: black !important; 
  }

  @media (max-width: 769px) {
    width: 50%;
    font-size: 0.85rem;
    padding: 8px;
    background-size: 12px;
  }
    @media (min-width:770px) {
      width: 30%;
  }
     @media (min-width:1300px) {
      width: 15%;
  }
`;

export const EmployeeImage = styled.img`
  width: auto;
  height: 50px;

  @media (min-width: 768px) {
    height: 50px;
  }

  @media (min-width: 1024px) {
    height: 50px;
  }

  @media (min-width: 1440px) {
    height: 50px;
  }
`;

export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;

  span {
    padding: 0.2rem 0.5rem;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;
    @media (min-width: 3500px) {
      padding: 0.8rem 1.5;
      font-size: 2.5rem;
    }
    @media (min-width: 2000px) {
      padding: 0.6rem 0.8rem;
      font-size: 1.8rem;
    }
  }
  @media (min-width: 2560px) {
    span {
      font-size: 2rem;
      padding: 0.5rem 1.5rem;
    }
    gap: 0.5rem;
  }
  @media (min-width: 3840px) {
    span {
      font-size: 2.5rem;
    }
    gap: 1rem;
  }
  .active {
    background: #1e3a8a;
    color: white;
    border-color: #1e3a8a;
  }
`;
export const Icon = styled.img`
  width: 52px;
  height: 52px;
`;
export const AddButton = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  border: #304eb0;
  background: ${(props) => (props.disabled ? "#ccc" : "#304eb0")};
  color: ${(props) => (props.disabled ? "#666" : "#fff")};
  font-size: 0.85rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.disabled ? "#ccc" : "#243f99")};
  }
`;