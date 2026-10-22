import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  padding: 20px;
`;

/* Padding lives on Header/Body/Footer so only the Body scrolls */
export const Modal = styled.div`
  width: 100%;
  max-width: 720px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 1100px) { max-width: 95%; }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 32px 20px;
  flex-shrink: 0;

  @media (max-width: 600px) { padding: 20px 20px 16px; }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h3`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;
  color: #3250bc;
`;

export const Subtitle = styled.p`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: #666;

  @media (max-width: 480px) { font-size: 12px; }
`;

export const CloseBtn = styled.button`
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover { background: #f5f5f5; color: #111; }
`;

export const Body = styled.div`
  padding: 0 32px 8px;
  overflow-y: auto;
  flex: 1;
  min-height: 0;

  @media (max-width: 600px) { padding: 0 20px 8px; }
`;

export const EmployeeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 10px 14px;
  margin-bottom: 18px;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #3855bd;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
`;

export const EmpInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const EmpName = styled.p`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #222;
`;

export const EmpSub = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 11px;
  color: #777;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 25px;

  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const Field = styled.div`
  margin-bottom: 20px;
  min-width: 0;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.2;
  color: #222;
  text-transform: uppercase;
`;

export const Input = styled.input`
  width: 100%;
  height: 41px;
  padding: 0 12px;
  box-sizing: border-box;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  outline: none;
  background: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #333;
  transition: 0.2s ease;

  &::placeholder { color: #999; }
  &:focus { border-color: #3654b5; }
`;

export const SearchInput = styled(Input)``;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 10px 12px;
  box-sizing: border-box;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  outline: none;
  background: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #333;
  resize: vertical;
  transition: 0.2s ease;

  &::placeholder { color: #999; }
  &:focus { border-color: #3654b5; }
`;

/* Left-aligned buttons, like the Record Payment modal */
export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 13px;
  padding: 16px 32px 24px;
  flex-shrink: 0;

  @media (max-width: 600px) { padding: 16px 20px 20px; }
  @media (max-width: 480px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

export const CancelBtn = styled.button`
  height: 40px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid #111;
  border-radius: 4px;
  background: #fff;
  color: #111;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;

  &:hover { background: #f5f5f5; }
`;

export const SaveBtn = styled.button`
  min-width: 140px;
  height: 40px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  background: #3855bd;
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;

  svg { width: 14px; height: 14px; flex-shrink: 0; }

  &:hover:not(:disabled) { background: #3049a5; }
  &:disabled { background: #c8cdd6; cursor: not-allowed; }
`;

export const EmployeeList = styled.div`
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin-bottom: 14px;
`;

export const EmployeeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  background: ${({ $selected }) => ($selected ? "#f0f3ff" : "#fff")};

  &:hover { background: #f5f6ff; }
  &:last-child { border-bottom: none; }
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #3855bd;
`;

export const SelectedCount = styled.div`
  margin-bottom: 8px;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #3250bc;
`;

export const SelectedEmployees = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 20px;
`;

export const SelectedEmployee = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 15px;
  background: #eef2ff;
  color: #3250bc;
  font-family: "Poppins", sans-serif;
  font-size: 11px;
`;

export const RemoveBtn = styled.button`
  border: none;
  background: transparent;
  color: #3250bc;
  cursor: pointer;
  font-size: 11px;
  padding: 0;

  &:hover { color: #dc2626; }
`;