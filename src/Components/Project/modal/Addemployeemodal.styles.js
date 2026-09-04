import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.48);

  overflow-y: auto;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 480px;

  max-height: calc(100vh - 40px);

  background: #ffffff;
  border-radius: 5px;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);

  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  padding: 18px 24px;
  background: #3352BA;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-family: "Poppins";
  font-weight: 600;
  font-size: 18px;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 18px 24px 12px;
`;

export const Select = styled.select`
  height: 38px;
  min-width: 130px;

  padding: 0 10px;

  border: 1px solid #e2e2e2;
  border-radius: 7px;

  outline: none;
  background: #ffffff;
  color: #333333;

  font-family: inherit;
  font-size: 13px;

  cursor: pointer;

  &:focus {
    border-color: #3858c8;
  }
`;

export const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 38px;

  padding: 0 36px 0 12px;

  box-sizing: border-box;

  border: 1px solid #e2e2e2;
  border-radius: 7px;

  outline: none;
  background: #ffffff;
  color: #222222;

  font-family: inherit;
  font-size: 13px;

  &::placeholder {
    color: #a4a4a4;
  }

  &:focus {
    border-color: #3858c8;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #a4a4a4;
  pointer-events: none;
`;

export const ListWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 4px 4px 4px 24px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #3b4ccb;
    border-radius: 4px;
  }
`;

export const EmployeeRow = styled.label`
  display: flex;
  align-items: center;

  padding: 12px 20px 12px 0;

  border-bottom: 1px solid #f0f0f0;

  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }
`;

export const RowIndex = styled.span`
  width: 28px;
  flex-shrink: 0;

  color: #9a9a9a;
  font-size: 14px;
`;

export const RowName = styled.span`
  flex: 1;

  color: #222222;
  font-size: 14px;
`;

export const Checkbox = styled.input`
  width: 18px;
  height: 18px;

  accent-color: #3b4ccb;
  cursor: pointer;
`;

export const EmptyState = styled.p`
  padding: 24px;
  margin: 0;
  text-align: center;
  color: #9a9a9a;
  font-size: 13px;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 16px 24px;
  background: #f8f9fc;
  border-top: 1px solid #eeeeee;
`;

export const CancelButton = styled.button`
  height: 38px;
  padding: 0 24px;

  border: none;
  border-radius: 6px;

  background: #3b4ccb;
  color: #ffffff;

  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2e3ea8;
  }
`;

export const AddButton = styled.button`
  height: 38px;
  padding: 0 24px;

  border: none;
  border-radius: 6px;

  background: #ff8b20;
  color: #ffffff;

  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e9760d;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;