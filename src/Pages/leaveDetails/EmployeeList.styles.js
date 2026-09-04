import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const Container = styled.div`
  padding: 20px;
  font-family: "Satoshi";

`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  text-align: left;
  font-family: "Satoshi";
  overflow-x: auto;

  -webkit-overflow-scrolling: touch;
`;
export const TableHead = styled.thead`
  background: #304eb0;
  color: white;
`;

export const TableBody = styled.tbody``;

export const BodyRow = styled.tr`
  cursor: pointer;
  transition: background 0.2s ease;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);

  &:hover td {
    background: #f9f9ff;
  }

  &:nth-child(even) td {
    background: #e6ecff;
  }
`;
export const BodyCell = styled.td`
  font-size: 1rem;
  white-space: nowrap;
  background: #ffffff;


  @media (min-width: 768px) {
    padding: 5px;
    font-size: 0.7rem;
  }

  @media (min-width: 1024px) {
  padding:8px;
    font-size: 0.9rem;
  }

  @media (min-width: 1440px) {
    padding: 10px;
    font-size: 0.9rem;
  }

  @media (min-width: 1920px) {
    padding: 10px;
    font-size: 0.9rem;
  }

`;


export const EmptyRow = styled.tr`
 text-align: center;
  padding: 40px 0;
  
 
`;
export const HeadRow = styled.tr``;

export const HeadCell = styled.th`
  padding: 15px;
  font-size: 1rem;
  text-align: left;
  font-family: "Raleway";
  white-space: nowrap;


  @media (min-width: 768px) {
    padding: 10px;
    font-size: 0.7rem;
  }

  @media (min-width: 1024px) {
    padding:10px;
    font-size: 0.8rem;
  }

  @media (min-width: 1440px) {
    padding: 15px;
    font-size: 0.9rem;
  }

  @media (min-width: 1920px) {
    padding: 15px;
    font-size: 1rem;
  }

`;
export const NameCell = styled.td`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 8px;
  }

  /* Large Screens */
  @media (min-width: 1400px) {
    gap: 14px;
  }
`;

export const Avatar = styled.img`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
  }

  @media (min-width: 1400px) {
    width: 32px;
    height: 32px;
  }
  @media (min-width: 2560px) {
    width: 50px;
    height: 50px;
  }
`;

export const AvatarFallback = styled.div`
  width: 25px;
  height: 25px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
  }

  @media (min-width: 1400px) {
    width: 32px;
    height: 32px;
  }
`;



export const DeleteIconWrapper = styled.td`
  cursor: pointer;
  text-align: center;

  svg {
    transition: 0.2s;
  }

  &:hover svg {
    opacity: 0.6;
  }
`;

export const TableWrapper = styled.div`
  
`;

export const ProfileImg = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;

export const ActionIcons = styled.div`
  display: flex;
  gap: 1rem;
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


export const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
`;




export const TruncatedText = styled.div`
  /* max-width: 80px; */
  white-space: nowrap;
  /* overflow: hidden; */
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    max-width: 50px; 
    overflow: hidden;
  }
   @media (min-width: 769px) and (max-width: 1024px) {
    max-width: 80px; 
    overflow: hidden;
  }
   @media (min-width: 1025px) and (max-width: 1440px) {
    max-width: 80px; 
    overflow: hidden;
  }
`;
export const PageLoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
