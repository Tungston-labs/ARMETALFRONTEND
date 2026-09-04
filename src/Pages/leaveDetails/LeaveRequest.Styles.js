// LeaveRequest.styles.js
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const Container = styled.div`
  padding: 20px;

`;

export const Header = styled.div`
  //  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  .title {
    display: flex;
    align-items: center;
    gap: 1rem;

    h2 {
      margin: 0;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      color: #555;
    }

    img {
      height: 40px;
    }
  }

  .right {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
`;
export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;

export const Tabs = styled.div`
  display: flex;
  // gap: clamp(0.2rem, 0.3vw, 2rem);
  font-family: Raleway;
  font-weight: 700;
  font-size: clamp(0.7rem, 0.9vw, 2.5rem);
  line-height: 100%;
  text-align: center;
  margin: 2rem;
  flex-wrap: wrap;
  justify-content: space-around;
  @media (max-width: 1024px) {
    gap: clamp(0.4rem, 1vw, 1.5rem);
    font-size: clamp(0.6rem, 0.8vw, 1.6rem);
  }

  @media (max-width: 768px) {
    justify-content: center;
    gap: clamp(0.3rem, 1vw, 1rem);
    font-size: clamp(0.5rem, 0.7vw, 1.2rem);
  }
`;

export const Tab = styled.div`
  padding: clamp(6px, 0.4vw, 16px) clamp(12px, 0.8vw, 32px);
  cursor: pointer;
  font-family: Raleway;
  font-weight: 500;
  font-size: clamp(0.8rem, 0.9vw, 2rem);
  line-height: 100%;
  text-align: center;
  border-bottom: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "white" : "#555")};
  background: ${({ active }) => (active ? "#304EB0" : "transparent")};
  border-radius: 6px;

  @media (max-width: 1024px) {
    padding: clamp(5px, 0.4vw, 14px) clamp(10px, 0.8vw, 26px);
    font-size: clamp(0.7rem, 0.8vw, 1.6rem);
  }

  @media (max-width: 1440px) {
    padding: clamp(5px, 0.6vw, 20px) clamp(10px, 0.8vw, 26px);
    font-size: clamp(0.7rem, 1vw, 2rem);
  }
  @media (max-width: 768px) {
    padding: clamp(4px, 0.3vw, 10px) clamp(6px, 0.6vw, 18px);
    font-size: clamp(0.6rem, 0.7vw, 1.2rem);
  }

  @media (min-width: 2560px) {
    font-size: clamp(1rem, 1.2vw, 2rem);
  }

  @media (min-width: 3840px) {
    font-size: clamp(1.2rem, 1.5vw, 2.5rem);
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  display: inline-block;
  /* width: 100%; */
  /* max-width: 350px;  */
`;

export const SearchInput = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #172554;
  border-radius: 6px;
  width: 100%;
  font-family: "Satoshi";
  height: 30px;
  font-size: 0.7rem;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #021e82;
  }

  /* Laptop screens (≥1024px) */
  @media (min-width: 1024px) and (max-width: 1439px) {
    padding: 0.8rem 0.9rem;
    height: 30px;
    font-size: 0.8rem;
   
  }

  /* Large desktops (≥1440px) */
  @media (min-width: 1440px) and (max-width: 1919px) {
    padding: 0.9rem 1rem;
    height: 40px;
    font-size: 1rem;
  }

  /* Ultra-wide (≥2560px) */
  @media (min-width: 1920px) and (max-width: 2559px) {
    padding: 0.9rem 1rem;
    height: 50px;
    font-size: 1.5rem;
  }
@media (min-width: 2560px) and (max-width: 3839px) {
    padding: 0.9rem 1rem;
    height: 50px;
    font-size: 1.5rem;
  }
  /* 4K and above (≥3840px) */
  @media (min-width: 3840px) {
    padding: 1.5rem 4rem;
    height: 90px;
    font-size: 2rem;
    width: auto;
  }
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: clamp(10px, 1vw, 25px);
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: clamp(1rem, 1.5vw, 1.5rem);

  @media (min-width: 1440px) {
    font-size: clamp(1.2rem, 1vw, 1.6rem);
  }

  @media (min-width: 2560px) {
    font-size: clamp(1.4rem, 0.8vw, 1.8rem);
  }

  @media (min-width: 3840px) {
    font-size: clamp(1.6rem, 0.6vw, 2rem);
  }

  pointer-events: none;
`;

export const AddButton = styled.button`
  background-color: #1e40af;
  color: #fff;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #1c3aa9;
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

  td {
    text-align: left;
    padding: clamp(4px, 0.5vw, 12px); /* responsive padding */
    white-space: nowrap;
    background-color: white;
    border: none;
    font-size: clamp(0.8rem, 1vw, 1.5rem); /* responsive font */
  }

  th {
    text-align: left;
    background-color: #304eb0;
    color: white;
    font-family: Raleway;
    padding: clamp(6px, 0.5vw, 16px); /* responsive padding */
    font-size: clamp(0.9rem, 1vw, 1.8rem); /* responsive font */
  }

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

  @media (min-width: 2560px) {
    td,
    th {
      font-size: clamp(1.2rem, 1.5vw, 1.8rem); /* large screens like 2K/4K */
      padding: clamp(8px, 1vw, 24px);
    }
  }

  @media (min-width: 3840px) {
    td,
    th {
      font-size: clamp(1.5rem, 2vw, 2rem); /* ultra-large screens like 8K */
      padding: clamp(10px, 2vw, 32px);
    }
  }
`;

export const TableHead = styled.th`
  text-align: center;
  padding: 1rem;
  background: #d6dee9;
  color: #000;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #fff;
  }
`;

export const TableCell = styled.td`
  padding: 0.8rem;
  vertical-align: middle;
`;

export const ProfileImage = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-right: 0.6rem;
  vertical-align: middle;
`;



export const DeclineButton = styled.button`
  // background-color: #f87171;
  color: white;
  padding: 0.4rem 0.8rem;
  // border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 7px;
  border: 1px solid #ff2304;
  background: rgba(255, 35, 4, 0.5);
  &:hover {
    background-color: #dc2626; /* a darker red */
    transform: scale(1.02);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }
`;



export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  height: 30px;

  align-items: center;
  padding: 0.3rem;
  // border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  // box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const HeaderSection = styled.div`
  // display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;

export const Icon = styled.div`
  font-size: 2rem;
  color: #2a2a86;
`;

export const ActionArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
`;
export const DepartmentSelect = styled.select`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #172554;
  background: white;
  height: 45px;
  min-width: 200px;

  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg fill='black' height='14' viewBox='0 0 24 24' width='14' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")
    no-repeat right 10px center;
  background-color: white;
  background-size: 14px;

  @media (min-width: 1440px) and (max-width: 1919px) {
    font-size: 1rem;
    height: 40px;
    min-width: 250px;
    border-radius: 6px;
  }

  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.5rem;
    height: 50px;
    min-width: 250px;
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    font-size: 1.5rem;
    height: 60px;
    min-width: 300px;
  }
  @media (min-width: 3840px) {
    font-size: 2rem;
    height: 80px;
    min-width: 500px;
  }
`;


export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 5px 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 480px) {
    /* small tablet */
    font-size: 0.8rem;
  }

  @media (min-width: 768px) {
    /* tablet */
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    /* desktop */
    font-size: 1.5rem;
  }

  @media (min-width: 1440px) {
    /* large desktop / 2K */
    font-size: 2rem;
  }

  @media (min-width: 2560px) {
    /* 4K */
    font-size: 3em;
  }

  @media (min-width: 3840px) {
    /* 8K */
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
    font-size: 0.9rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const EmployeeImage = styled.img`
  height: clamp(50px, 8vw, 120px); /* scales between 50px and 120px */
  width: auto; /* maintain aspect ratio */

  @media (min-width: 768px) {
    height: clamp(20px, 6vw, 20px);
  }

  @media (min-width: 1024px) {
    height: clamp(20px, 4vw, 50px);
  }

  @media (min-width: 1440px) {
    height: clamp(50px, 1vw, 80px);
  }

  @media (min-width: 2560px) {
    height: clamp(80px, 2vw, 100px);
  }

  @media (min-width: 3840px) {
    height: clamp(100px, 3vw, 200px);
  }
`;

export const Pagination = styled.div`
display: flex;
  justify-content: flex-start; /* changed from flex-end to flex-start */
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
export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  overflow: hidden;
  z-index: 100;

  div {
    padding: 10px 15px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: #f0f0f0;
    }
  }
`;
export const StatusTabsWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin: 16px 0;
  flex-wrap: wrap;
`;

export const StatusButton = styled.button`
  padding: 8px 20px;
  border-radius: 4px;

  border: 1.5px solid
    ${({ $active, $borderColor }) =>
      $active ? $borderColor : "#ddd"};

  background: ${({ $active, $bg }) =>
    $active ? $bg : "#fff"};

  color: ${({ $active, $color }) =>
    $active ? $color : "#888"};

  font-weight: ${({ $active }) =>
    $active ? "700" : "500"};

  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  display: flex;
  align-items: center;
  gap: 6px;
`;


export const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  background: ${({ $active, $color }) =>
    $active ? $color : "#ccc"};

  display: inline-block;
`;

export const CountBadge = styled.span`
  background: ${({ $active, $color }) =>
    $active ? $color : "#eee"};

  color: ${({ $active }) =>
    $active ? "#fff" : "#666"};

  border-radius: 10px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 700;
`;

export const StatusText = styled.span`
  font-weight: 600;
  color: ${({ status }) =>
    status === "approved"
      ? "#16a34a"
      : status === "rejected"
      ? "#dc2626"
      : "#f59e0b"};
`;

export const PrintSection = styled.div`
  display:flex;
  justify-content:flex-end;
  align-items:center;
  gap:12px;
  margin-bottom:20px;
  flex-wrap:wrap;
`;

export const MonthSelect = styled.select`
  padding:8px 14px;
  border-radius:4px;
  border:1px solid #d1d5db;
  outline:none;
  min-width:150px;
  font-size:14px;
  background:white;
  cursor:pointer;

  &:focus{
    border-color:#304EB0;
  }
`;

export const ExcelButton = styled.button`
  padding:8px 14px;
  border-radius:4px;
  border:1px solid #d1d5db;
  outline:none;
  min-width:150px;
  font-size:14px;
  background:white;
  cursor:pointer;

  &:hover{
   background-color:#304EB0;
   color: white;
  }
`;

export const TopActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ApproveButton = styled.button`
  padding: 6px 14px;
  min-width: 74px;
  border: 1px solid #55c36a;
  background: #eaf9ed;
  color: #1f2937;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #55c36a;
    color: #fff;
  }

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
  }
`;

export const RejectButton = styled.button`
  padding: 6px 14px;
  min-width: 74px;
  border: 1px solid #ff6b6b;
  background: #fff5f5;
  color: #1f2937;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff6b6b;
    color: #fff;
  }

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
  }
`;



