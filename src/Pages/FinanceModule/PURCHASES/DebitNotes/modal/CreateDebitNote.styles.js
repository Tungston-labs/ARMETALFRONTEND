import styled from "styled-components";

/* Breakpoints */
const bp = {
  xl: "@media (max-width: 1280px)",
  lg: "@media (max-width: 1024px)",
  md: "@media (max-width: 768px)",
  sm: "@media (max-width: 480px)",
};

export const CreateBillContainer = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 20px;
  box-sizing: border-box;

  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 6px;

  font-family: "Poppins", sans-serif;

  ${bp.md} {
    padding: 14px;
  }

  ${bp.sm} {
    padding: 10px;
    border-radius: 4px;
  }
`;

export const BillHeader = styled.div`
  border-bottom: 1px solid #eeeeee;

  margin: 0 0 22px;
  padding: 0 0 12px;

  h1 {
    margin: 0 0 7px;

    color: #2c469f;

    font-family: "Poppins", sans-serif;
    font-size: 17px;
    font-weight: 600;
  }

  ${bp.sm} {
    margin-bottom: 16px;

    h1 {
      font-size: 15px;
    }
  }
`;

export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 8px;

  font-family: "Poppins", sans-serif;
  font-size: 12px;

  color: #222222;

  strong {
    color: #2c469f;
    font-weight: 500;
  }
`;

/* =========================
   LOADING / ERROR
========================= */

export const LoadingMessage = styled.div`
  padding: 30px;
  text-align: center;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #4b5563;
`;

export const ErrorMessage = styled.div`
  margin: 12px 0;

  color: #d32f2f;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
`;

/* =========================
   FORM
========================= */

export const FormGrid = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  column-gap: 24px;
  row-gap: 14px;

  ${bp.xl} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 20px;
  }

  ${bp.lg} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 16px;
  }

  ${bp.sm} {
    grid-template-columns: minmax(0, 1fr);
    row-gap: 12px;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  display: block;

  margin-bottom: 7px;

  color: #171717;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;

  ${bp.sm} {
    font-size: 13px;
    margin-bottom: 5px;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;

  box-sizing: border-box;

  border: 1px solid #e2e5ea;
  border-radius: 5px;

  padding: 0 12px;

  background: #ffffff;

  color: #333333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;

  outline: none;

  transition: border-color 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3049a3;
  }

  /* 16px stops iOS from zooming in when an input is focused */
  ${bp.sm} {
    font-size: 16px;
  }
`;

/* =========================
   SELECT
========================= */

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;

  box-sizing: border-box;

  border: 1px solid #e2e5ea;
  border-radius: 5px;

  padding: 0 40px 0 12px;

  background: #ffffff;

  color: #4b5563;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;

  appearance: none;
  outline: none;

  cursor: pointer;

  &:focus {
    border-color: #3049a3;
  }

  ${bp.sm} {
    font-size: 16px;
  }
`;

export const SelectIcon = styled.span`
  position: absolute;

  top: 50%;
  right: 13px;

  display: flex;

  transform: translateY(-50%);

  pointer-events: none;

  color: #4b5563;

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* =========================
   ITEMS TABLE
========================= */

export const ItemsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  gap: 10px;
`;

export const ItemsTitle = styled.h3`
  margin: 30px 0 12px;

  color: #111111;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;

  ${bp.sm} {
    margin-top: 22px;
    font-size: 14px;
  }
`;

/* Scrolls sideways on small screens; header and rows keep a minimum width */
export const ItemsTable = styled.div`
  width: 100%;
  max-width: 100%;

  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  border: 1px solid #e5e7eb;
  border-radius: 5px;

  scrollbar-width: thin;
`;

const columns = `
  6fr
  11fr
  19fr
  7fr
  9fr
  10fr
  8fr
  10fr
  11fr
  7fr
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: ${columns};

  align-items: center;

  min-width: 1050px;
  height: 42px;

  padding: 0 9px;
  box-sizing: border-box;

  background: #2c469f;
  color: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;

  span {
    padding: 0 8px;
  }

  span:first-child,
  span:last-child {
    text-align: center;
  }

  ${bp.md} {
    min-width: 960px;
  }
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${columns};

  align-items: center;

  min-width: 1050px;
  min-height: 48px;

  padding: 5px 9px;
  box-sizing: border-box;

  border-bottom: 1px solid #eeeeee;

  color: #555555;

  font-family: "Poppins", sans-serif;
  font-size: 11px;

  &:last-child {
    border-bottom: none;
  }

  ${bp.md} {
    min-width: 960px;
  }
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
  font-family: "Poppins", sans-serif;
  min-width: 0;

  padding: 0 8px;

  &:first-child,
  &:last-child {
    justify-content: center;
  }
`;

export const SmallInput = styled.input`
  width: 100%;
  max-width: 100%;
  height: 32px;

  box-sizing: border-box;

  padding: 0 8px;

  border: 1px solid #e3e5e8;
  border-radius: 3px;

  background: #ffffff;

  color: #4b5563;

  font-family: "Poppins", sans-serif;
  font-size: 11px;

  outline: none;

  &:focus {
    border-color: #3049a3;
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const RemoveButton = styled.button`
  width: 28px;
  height: 28px;

  margin: 0 auto;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #ff3b30;
  border-radius: 50%;

  background: #ffffff;
  color: #ff3b30;

  cursor: pointer;

  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: #fff1f0;
  }
`;

/* =========================
   NOTES (left) + SUMMARY (right)
========================= */

export const BottomSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;

  gap: 24px;
  margin-top: 28px;

  ${bp.sm} {
    margin-top: 20px;
  }
`;

export const NotesGroup = styled(FormGroup)`
  flex: 1 1 320px;
  min-width: 0;
`;

export const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 120px;

  box-sizing: border-box;

  border: 1px solid #e2e5ea;
  border-radius: 5px;

  padding: 10px 12px;

  background: #ffffff;

  color: #333333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;

  resize: vertical;
  outline: none;

  transition: border-color 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3049a3;
  }

  ${bp.sm} {
    font-size: 16px;
  }
`;

export const SummaryWrapper = styled.div`
  width: 100%;
  max-width: 50%;

  margin-left: auto;
  margin-top: 28px;
  padding-top: 2px;

  ${bp.lg} {
    max-width: 60%;
  }

  ${bp.md} {
    max-width: 100%;
  }

  ${bp.sm} {
    margin-top: 20px;
  }
`;

export const BottomSummary = styled(SummaryWrapper)`
  flex: 1 1 320px;
  max-width: 480px;

  margin: 0 0 0 auto;
  padding-top: 0;

  ${bp.md} {
    max-width: 100%;
    margin-left: 0;
  }
`;

export const SummaryRow = styled.div`
  min-height: 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  font-family: "Poppins", sans-serif;
  font-size: 12px;

  color: #111111;

  span {
    color: #4b5563;
  }

  strong {
    font-weight: 600;
    color: #111111;
    white-space: nowrap;
  }

  .discount {
    color: #20a34a;
  }

  ${bp.sm} {
    gap: 10px;
    font-size: 13px;
  }
`;

export const TotalAmount = styled.div`
  width: 100%;
  min-height: 42px;

  margin-top: 10px;
  padding: 0 16px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  border-radius: 5px;

  background: #ff8500;
  color: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;

  strong {
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }

  ${bp.sm} {
    padding: 0 12px;
  }
`;

/* =========================
   BUTTONS
========================= */

export const ButtonWrapper = styled.div`
  width: 100%;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;

  gap: 12px;

  margin-top: 30px;

  ${bp.sm} {
    margin-top: 22px;

    button {
      flex: 1 1 calc(50% - 6px);
      width: auto;
    }
  }
`;

export const AddButton = styled.button`
  height: 36px;

  padding: 0 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  border: none;
  border-radius: 4px;

  background: #f48211;
  color: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
  white-space: nowrap;

  transition: background 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    background: #d9720c;
  }
`;

export const CancelButton = styled.button`
  min-width: 100px;
  height: 38px;

  padding: 0 16px;

  border: 1px solid #3049a3;
  border-radius: 4px;

  background: #ffffff;
  color: #111111;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  cursor: pointer;

  &:hover {
    background: #f5f7ff;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const PreviewButton = styled.button`
  min-width: 100px;
  height: 38px;

  padding: 0 16px;

  border: 1px solid #3049a3;
  border-radius: 4px;

  background: #3049a3;
  color: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  cursor: pointer;

  &:hover:not(:disabled) {
    background: #263b88;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;