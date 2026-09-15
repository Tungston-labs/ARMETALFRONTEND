import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.45);
`;

export const ModalContainer = styled.div`
  width: min(1100px, 100%);
  max-height: 92vh;
  overflow: hidden;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #eeeeee;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #222222;
  font-size: 18px;
  font-weight: 600;
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  color: #555555;
  cursor: pointer;

  &:hover {
    color: #222222;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const ModalBody = styled.div`
  max-height: calc(92vh - 140px);
  overflow-y: auto;
  padding: 22px 24px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const FieldLabel = styled.label`
  color: #444444;
  font-size: 12px;
  font-weight: 500;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 38px;
  box-sizing: border-box;
  padding: 0 11px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  outline: none;
  background: #ffffff;
  color: #222222;
  font-family: inherit;
  font-size: 12px;

  &:focus {
    border-color: #304ba3;
  }

  &::placeholder {
    color: #999999;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  height: 38px;
  box-sizing: border-box;
  padding: 0 34px 0 11px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  outline: none;
  appearance: none;
  background: #ffffff;
  color: #222222;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;

  &:focus {
    border-color: #304ba3;
  }
`;

export const SelectIcon = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  display: flex;
  transform: translateY(-50%);
  pointer-events: none;
  color: #666666;
`;

export const ItemsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  margin-bottom: 12px;
`;

export const ItemsTitle = styled.h3`
  margin: 0;
  color: #222222;
  font-size: 14px;
  font-weight: 600;
`;

export const AddItemButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid #304ba3;
  border-radius: 4px;
  background: #ffffff;
  color: #304ba3;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f3f5ff;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
`;

export const ItemsTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: #304ba3;
`;

export const TableHeader = styled.th`
  padding: 11px 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 11px;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;

  &:last-child {
    border-right: none;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #eeeeee;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  padding: 8px 10px;
  color: #333333;
  font-size: 11px;
  vertical-align: middle;
`;

export const ItemInput = styled.input`
  width: 100%;
  height: 32px;
  box-sizing: border-box;
  padding: 0 8px;
  border: 1px solid #dddddd;
  border-radius: 3px;
  outline: none;
  font-size: 11px;

  &:focus {
    border-color: #304ba3;
  }
`;

export const QuantityInput = styled(ItemInput)`
  text-align: center;
`;

export const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #d32f2f;
  cursor: pointer;

  &:hover {
    background: #fff0f0;
  }
`;

export const EmptyCell = styled.div`
  min-height: 32px;
`;

export const BottomArea = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 30px;
  margin-top: 22px;
`;

export const NotesSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const NotesLabel = styled.label`
  color: #444444;
  font-size: 12px;
  font-weight: 500;
`;

export const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  box-sizing: border-box;
  padding: 10px;
  resize: vertical;
  border: 1px solid #dddddd;
  border-radius: 4px;
  outline: none;
  font-family: inherit;
  font-size: 12px;

  &:focus {
    border-color: #304ba3;
  }

  &::placeholder {
    color: #999999;
  }
`;

export const SummarySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #555555;
  font-size: 12px;
`;

export const SummaryLabel = styled.span`
  color: #555555;
`;

export const SummaryValue = styled.span`
  color: #333333;
  font-weight: 500;
`;

export const DiscountValue = styled.span`
  color: #16834b;
  font-weight: 500;
  text-align: right;
`;

export const TotalBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 5px;
  padding: 13px 14px;
  border-radius: 4px;
  background: #fff4e8;
`;

export const TotalLabel = styled.span`
  color: #333333;
  font-size: 13px;
  font-weight: 600;
`;

export const TotalValue = styled.span`
  color: #f28c28;
  font-size: 16px;
  font-weight: 700;
`;

export const FooterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid #eeeeee;
`;

export const CancelButton = styled.button`
  height: 36px;
  padding: 0 18px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  background: #ffffff;
  color: #555555;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }
`;

export const PreviewButton = styled.button`
  height: 36px;
  padding: 0 20px;
  border: none;
  border-radius: 4px;
  background: #f28c28;
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #df7b1b;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

