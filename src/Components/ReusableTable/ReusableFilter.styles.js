import styled from "styled-components";

export const FilterWrapper = styled.div`
  width: 100%;
  background: white;
  border-radius: 10px;
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
margin-bottom: 15px;
  @media (max-width:992px){
    flex-direction:column;
    align-items:stretch;
  }
`;

export const LeftSection = styled.div`
  display:flex;
  gap:16px;
  flex-wrap:wrap;
  flex:1;

  @media(max-width:768px){
    flex-direction:column;
  }
`;

export const RightSection = styled.div`
  display:flex;
  justify-content:flex-end;
gap:10px;
  @media(max-width:992px){
    justify-content:stretch;
  }
`;

export const SearchWrapper = styled.div`
  position:relative;
  width:280px;

  @media(max-width:768px){
    width:100%;
  }
`;

export const SearchInput = styled.input`
  width:100%;
  height:46px;
  border:1px solid #e5e7eb;
  border-radius:5px;
  padding:0 40px 0 15px;
  font-size:14px;
  outline:none;

  &:focus{
    border-color:#F78926;
  }
`;

export const SearchIcon = styled.div`
  position:absolute;
  right:14px;
  top:50%;
  transform:translateY(-50%);
  color:#666;
`;

export const Select = styled.select`
  width:180px;
  height:46px;
  border:1px solid #e5e7eb;
  border-radius:5px;
  padding:0 15px;
  font-size:14px;
  outline:none;
  background:white;

  &:focus{
    border-color:#F78926;
  }

  @media(max-width:768px){
    width:100%;
  }
`;

export const DateInput = styled.input`
  width:180px;
  height:46px;
  border:1px solid #e5e7eb;
  border-radius:5px;
  padding:0 15px;
  font-size:14px;
  outline:none;
  background:white;

  &:focus{
    border-color:#F78926;
  }

  @media(max-width:768px){
    width:100%;
  }
`;

export const MoreOptionsWrapper = styled.div`
  position: relative;
  display: inline-block;
`;



export const MoreOptionsMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: #ffffff;
  border: 0.5px solid #eeeeee;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 8px;
  min-width: 140px;
  z-index: 20;
`;

export const MenuItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: #f7f8fa;
  }
`;
export const MoreOptionsButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 46px;
  padding: 0 10px;
  border: 1px solid ${({ $active }) => ($active ? "#16a34a" : "#2563eb")};
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#ecfdf5" : "#ffffff")};
  cursor: pointer;
  color: #1a1a1a;
  font-size: 14px;

  svg {
    font-size: 14px;
  }

  &:hover {
    background: ${({ $active }) => ($active ? "#dcf5e6" : "#f7f8fa")};
  }
`;

export const MenuHeader = styled.div`
  padding: 6px 8px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 0.5px solid #eeeeee;
  margin-bottom: 4px;
`;

export const MenuStatusItem = styled.button`
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px;
  font-size: 14px;
  color: #1a1a1a;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #f7f8fa;
  }
`;