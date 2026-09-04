import styled from "styled-components";

import { LuArrowLeft } from "react-icons/lu";

export const BackArrow = styled(LuArrowLeft)`
  cursor: pointer;
  color: #3352ba;
  width: clamp(20px, 2vw, 50px);
  height: clamp(20px, 2vw, 50px);

  /* 2K / QHD */
  @media (min-width: 2560px) {
    width: 60px;
    height: 60px;
  }

  /* 4K */
  @media (min-width: 3840px) {
    width: 80px;
    height: 80px;
  }

  /* 8K */
  @media (min-width: 7680px) {
    width: 120px;
    height: 120px;
  }
`;
export const Container = styled.div`
  background: white;

  /* ✅ Responsive padding */
  padding: clamp(1rem, 2vw, 2rem);

  /* ✅ On very large screens (like 4K) give more space */
  @media (min-width: 1920px) and (max-width: 2559px) {
    padding: 3rem;
  }

  @media (min-width: 2560px) {
    padding: 4rem;
  }

  /* ✅ On small screens reduce padding */
  @media (max-width: 767px) {
    padding: 1rem;
  }
`;

export const HeaderSection = styled.div`
  margin-bottom: 2rem;
`;

export const IconTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  svg {
    font-size: 1.4rem;
  }
`;
export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  // img {
  //   height: 51px;
  // }

  // Prevent every div from becoming a column (remove this block ↓)
  // div {
  //   display: flex;
  //   flex-direction: column;
  // }
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

export const ButtonGroups = styled.div`
  margin-top: 2rem;
  // display: flex;
  // gap: 8px;
`;

export const CancelButton = styled.button`
  padding: 10px 10px;
  color: #ffffffff;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  border: 1px solid #ff2304;
  background: #fd907b;
  font-size: 1rem;
  &:hover {
    background: #e22c0bff;
  }
`;
export const FormSection = styled.div`
  display: flex;
  /* flex-wrap: wrap; */
  gap: 1.5rem;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;
export const InputGroup = styled.div`
  width: calc(30% - 1rem);
  display: flex;
  flex-direction: column;
`;
export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;
// Wrapper row: inputs on the left, edit button on the right
export const TopRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

// Groups inputs together on the left
export const InputsWrapper = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  width: 80%;
`;

// Right side button container
export const RightActions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  width: 20%; /* RIGHT SIDE 20% width */
`;

export const AddButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 80px;
  font-family: satoshi;
  background: linear-gradient(
    181deg,
    rgba(23, 37, 84, 1) 50%,
    rgba(51, 82, 186, 1) 100%
  );
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  @media (min-width: 768px) {
    font-size: 15px;
    padding: 0.6rem 1.2rem;
  }

  @media (min-width: 1440px) {
    font-size: 16px;
    padding: 0.7rem 1.4rem;
  }
  @media (min-width: 1940px0px) {
    font-size: 16px;
    padding: 0.7rem 1.4rem;
  }

  @media (min-width: 2560px) {
    font-size: 18px;
    padding: 0.8rem 1.6rem;
  }
  @media (min-width: 3840px) {
    font-size: 1.8rem;
    padding: 0.8rem 1.6rem;
  }
`;

export const DeleteButton = styled(AddButton)`
  background: linear-gradient(
    181deg,
    rgba(186, 51, 51, 1) 50%,
    rgba(255, 87, 87, 1) 100%
  );

  &:hover {
    opacity: 0.9;
    transform: scale(1.03);
  }
`;

export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  width: 220px;
`;
export const Label = styled.label`
  color: gray;
  margin-bottom: 0.5rem;

  font-size: clamp(0.85rem, 1vw, 1.3rem);

  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1.2rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.8rem;
  }
`;

export const Input = styled.input`
  background: white;
  // border: 1px solid #052db4;
  border-radius: 4px;
  border: none;
  /* width: 50%; */

  padding: clamp(0.4rem, 0.8vw, 0.75rem) clamp(0.6rem, 1vw, 1rem);
  font-size: clamp(0.85rem, 1vw, 1.1rem);

  @media (min-width: 1440px) and (max-width: 1919px) {
    font-size: 1rem;
    padding: 0.6rem 1.25rem;
  }
  @media (min-width: 1920px) and (max-width: 2559px) {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1rem 1.5rem;
  }
`;

export const TableWrapper = styled.div`
  //   overflow-x: auto;
  background-color: white;
  margin-top: -1rem;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 1rem;
  text-align: left;
  font-family: "Satoshi";
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  td {
    text-align: left;
    padding: 8px 10px;
    white-space: nowrap;
    background-color: white;
    border: none;
    font-size: 1rem;
  }

  /* Small screens (mobile) */
  @media (max-width: 600px) {
    td {
      font-size: 0.75rem;
      padding: 5px 8px;
    }
  }

  /* Tablets and small laptops */
  @media (min-width: 601px) and (max-width: 1024px) {
    td {
      font-size: 0.8rem;
      padding: 3px 9px;
    }
  }

  /* Large screens (desktop) */
  @media (min-width: 1025px) and (max-width: 1439px) {
    td {
      font-size: 0.9rem;
      padding: 5px 10px;
    }
  }
  @media (min-width: 1440px) and (max-width: 1599px) {
    td {
      font-size: 0.9rem;
      padding: 5px 10px;
    }
  }
  @media (min-width: 1560px) and (max-width: 1919px) {
    td {
      font-size: 0.9rem;
      padding: 5px 10px;
    }
  }

  @media (min-width: 1920px) and (max-width: 2559px) {
    td {
      font-size: 1.1rem;
      padding: 5px 12px;
    }
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    td {
      font-size: 1.5rem;
      padding: 10px 10px;
    }
  }
  @media (min-width: 3840px) {
    td {
      font-size: 2rem;
      padding: 10px 15px;
    }
  }

  th {
    text-align: left;
    background-color: #304eb0;
    color: white;
    font-family: Raleway, sans-serif;
    padding: 6px 6px;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    th {
      padding: 4px 5px;
      font-size: 0.85rem;
    }
  }
  @media (min-width: 1025) and (max-width: 1440px) {
    th {
      padding: 6px 6px;
      font-size: 0.85rem;
    }
  }

  @media (min-width: 1441px) and (max-width: 1559px) {
    th {
      padding: 6px 8px;
      font-size: 0.85rem;
    }
  }

  @media (min-width: 1560px) and (max-width: 1919px) {
    th {
      padding: 10px 8px;
      font-size: 1rem;
    }
  }

  @media (min-width: 1920px) and (max-width: 2559px) {
    th {
      padding: 9px 8px;
      font-size: 1.2rem;
    }
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    th {
      padding: 9px 8px;
      font-size: 1.5rem;
    }
  }

  @media (min-width: 3840px) {
    th {
      padding: 12px 16px;
      font-size: 1.8rem;
    }
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
`;
export const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 0.5rem;
  vertical-align: middle;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ danger }) => (danger ? "#f44336" : "#333")};
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
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

  padding: 0.3rem;
  // border: 1px solid #ccc;
  // border-radius: 8px;
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
// export const StyledIcon = styled(HiOutlinePencilSquare)`
//   width: 20px;
//   height: 20px;
//   margin-right: 0.5rem;
//   color: white;
//   vertical-align: middle;
// `;
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
    height: clamp(80px, 1vw, 100px);
  }

  @media (min-width: 3840px) {
    height: clamp(100px, 3vw, 200px);
  }
`;
export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;
export const DetailsBar = styled.div`
  padding: 0.75rem;
  background: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 8px;
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background: ${({ $active }) => ($active ? "#3352BA" : "transparent")};
  color: ${({ $active }) => ($active ? "#fff" : "#111827")};
  cursor: pointer;
`;