import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 20px;
  min-height: 100vh;
`;

export const Title = styled.h1`
  text-align: center;
  color: #172554;
  margin-bottom: 3rem;
  
`;

export const DepartmentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  // gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(1, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const DepartmentCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  margin-top: 1rem;
  max-width: 100%; 

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }
@media (max-width: 768px) {
  padding: 0.8rem;
  }

  @media (min-width: 2560px) {
    padding: 2rem;
  }

  @media (min-width: 3840px) {
    padding: 2rem;
  }
`;


export const DepartmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;           
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  background-color: #fff;
`;

export const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const DepartmentIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #172554;   
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;

  @media (min-width: 1920px) {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  @media (min-width: 2560px) {
     width: 60px;
    height: 60px;
    font-size: 2rem;
  }

  @media (min-width: 3840px) {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
`;


export const DepartmentName = styled.h2`
  color: #172554;
  font-size: 1.2rem;

@media (max-width: 768px) {
    font-size: 0.8rem;
  }

  /* Responsive scaling */
  @media (min-width: 1920px) {
    font-size: 1.2rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.8rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;


export const EmployeeCount = styled.span`
  color: #172554;
  font-weight: 500;
  font-size: 0.9rem; /* base font size */
@media (max-width: 768px) {
    font-size: 0.8rem;
  }
  /* Responsive adjustments */
  @media (min-width: 1920px) {
    font-size: 1.1rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.3rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.6rem;
  }
`;


export const DropdownWrapper = styled.div`
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 10px 10px;
  margin-top: 0.75rem;
  animation: dropdownOpen 0.3s ease forwards;

  @keyframes dropdownOpen {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const EmployeeList = styled.ul`
  list-style: none;
  padding: 0.5rem 1rem;
  margin: 0;
  // max-height: 200px;
  overflow-y: auto;
`;
export const EmployeeHeader = styled.div`
  font-weight: bold;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr ; 
  gap: 10px;
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #ccc;
  background:#304EB0;
  color:white;
`;

export const EmployeeItem = styled.li`
  padding: 0.5rem 0.5rem;
  border-bottom: 1px solid #eee;
  font-size: 1rem;
  color: #333;
  transition: background 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

/**
 * $columns controls the column count for both DropdownHeader and EmployeeRow.
 * Always pass the SAME $columns value to both, based on however many
 * EmployeeCell entries you actually render, so header and body line up
 * whether a page shows 5 columns or 7.
 */
export const DropdownHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 7}, 1fr);
  background: #F78926;
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #d1d5db;
  border-radius: 8px 8px 0 0;
  text-align: center;
  justify-content: center;

  /* Responsive adjustments */
  @media (min-width: 1920px) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 7}, minmax(120px, 1fr));
    font-size: 1rem;
    padding: 1rem 1.5rem;
  }

  @media (min-width: 2560px) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 7}, minmax(150px, 1fr));
    font-size: 1.3rem;
    padding: 1.2rem 2rem;
  }

  @media (min-width: 3840px) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 7}, minmax(200px, 1fr));
    font-size: 1.6rem;
    padding: 1.5rem 2.5rem;
  }
`;

export const EmployeeRow = styled.li`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns || 7}, 1fr);

  padding: 0.6rem 1rem;
  border-bottom: 1px solid #eee;
  font-size: 0.95rem;
  color: #333;
  text-align: center;
  justify-content: center;
  transition: background 0.2s ease;
/* background: #f4f8ff; */
  &:hover {
    background: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
  @media (min-width: 768px) {
  
    padding: 0.8rem 1.2rem;
    font-size: 0.9rem;
  }
  @media (min-width: 1920px) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 7}, minmax(120px, 1fr));
    padding: 0.8rem 1.2rem;
    /* font-size: 1.1rem; */
  }

  @media (min-width: 2560px) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 7}, minmax(150px, 1fr));
    padding: 1rem 1.5rem;
    font-size: 1.3rem;
  }

  @media (min-width: 3840px) {
    grid-template-columns: repeat(${({ $columns }) => $columns || 7}, minmax(200px, 1fr));
    padding: 1.2rem 2rem;
    font-size: 1.5rem;
  }
`;


export const EmployeeCell = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const NoRecordMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
  padding: 1rem;
  font-style: italic;
`;


export const PageButton = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: ${(props) => (props.disabled ? "#f3f4f6" : "#304EB0")};
  color: ${(props) => (props.disabled ? "#9ca3af" : "#ffffffff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  font-weight: 500;
  font-size: 14px;

  &:hover {
    background: ${(props) => (props.disabled ? "#f3f4f6" : "#4c66bdff")};
  }
`;

export const PageInfo = styled.span`
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
`
export const StatusSelect = styled.select`
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  border: none;

  &.approve {
    background-color: #5abe7fff;
    color: white;
    border-color: #16A34A ;
  }

  &.on-hold {
    background-color: #fac25bff;
    color: white;
  }

  &.in-verification {
    background-color: #77abffff;
    color: white;
  }
  &.reject {
    background-color: #f17979;
    color: white;
  }
  option {
    background: white !important;
    color: black !important;
  }
`;
export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
`;

export const PaginationButton = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background-color: ${({ disabled }) => (disabled ? "#f3f4f6" : "#304EB0")};
  color: ${({ disabled }) => (disabled ? "#9ca3af" : "#ffffffff")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;

    &:hover {
    background: ${(props) => (props.disabled ? "#f3f4f6" : "#4c66bdff")};
  }
`;

export const PaginationInfo = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: #444;
`;