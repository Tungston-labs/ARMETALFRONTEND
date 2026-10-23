import styled from 'styled-components';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
export const Container = styled.div`
  padding: 20px;

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

  img {
    height: 51px;
  }
`;

export const Title = styled.h2`
  margin: 0;
  font-family:satoshi;
  color: #3250B5;
font-size: 1.5rem;
font-style: normal;
font-weight: 700;
line-height: normal;
`;
export const Subtitle = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  margin-left: 2px;
  font-family:raleway;
  color: #3250B5;
font-family: Raleway;
// font-size: 16px;
font-style: normal;
font-weight: 300;
line-height: normal;
`;

export const FormSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem 2rem; /* vertical and horizontal spacing */
  margin-bottom: 2rem;
`;

export const ActionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 1rem;
`;
export const InputGroup = styled.div`
  width: calc(50% - 1rem);
  display: flex;
  flex-direction: column;
`;
export const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top:-5%;
  width:90px;
  font-family:satoshi;
background: linear-gradient(181deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  font-size:15px;
  cursor: pointer;
`;
export const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  width: 220px;
`;

export const FilterInput = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  width: 150px;
  color:white;
background: linear-gradient(181deg,rgba(23, 37, 84, 1) 50%, rgba(51, 82, 186, 1) 100%);

`;
export const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color:gray;
`;

export const Input = styled.input`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
    background: white;
    border-radius: 4px;
border: 1px solid #052DB4;

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
    width: 2px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px; 
  margin-top: 1rem;
`;


export const Th = styled.th`
  background-color: #304EB0;
  color: white;
  padding: 12px;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 2;
    font-size: 0.9rem;
`;


export const Td = styled.td`
  text-align: left;
  padding: 0.5rem;
  white-space: nowrap;
  background-color: white;
  border: none;
  font-size: 0.9rem;
`;


export const Tr = styled.tr`
  box-shadow: 0px 0px 2.7px rgba(0, 0, 0, 0.28);


  &:hover ${Td} {
    background-color: #f5f5f5;
  }
  &:nth-child(even) ${Td} {
    background-color: #E6ECFF;
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
  color: ${({ danger }) => (danger ? '#f44336' : '#333')};
  font-size: 1.1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
// export const TopBar = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;
// `;

export const HRManager = styled.div`
  display: flex;
  height:30px;
 
  align-items: center;

  padding: 0.3rem ;
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

export const FilterButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #3352BA;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 0.95rem;
  font-family: Satoshi;
  cursor: pointer;
  height: 40px;

  &:hover {
    background-color: #243d8f;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  /* gap: 10px; */
  position: relative; 
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

    @media (min-width: 3500px) {
      padding: 0.8rem 1.5;
      font-size: 1.5rem;
    }
    @media (min-width: 2000px) {
      padding: 0.6rem 0.8rem;
      font-size: 1.5rem;
    }
  }
  @media (min-width: 2560px) {
    span{
      font-size: 1.5rem;
    padding: 0.5rem 1.5rem;
    }
    gap: 0.5rem;
  }
  @media (min-width: 3840px) {
    span{
      font-size: 1.5rem;
    }
    gap: 1rem;
  }

  .active {
    background: #1e3a8a;
    color: white;
    border-color: #1e3a8a;
  }
`;

export const SummaryWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin: 12px 0;
  flex-wrap: wrap;
`;

export const SummaryCard = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
  border: 1px solid #e6eefb;
  border-radius: 10px;
  padding: 12px 16px;
  min-width: 170px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 1px 3px rgba(2,6,23,0.06);
`;

export const SummaryLabel = styled.div`
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 600;
`;

export const SummaryValue = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
`;
