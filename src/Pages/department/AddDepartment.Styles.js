import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 480px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
`;

export const Header = styled.div`
  background: #3352ba;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #c7d2fe;
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

export const Body = styled.div`
  padding: 20px;
`;

export const EmployeeCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e2e5f0;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 18px;
  background: #f8f9fc;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3352ba;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
`;

export const EmpInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const EmpName = styled.p`
  margin: 0;
  font-size: 13px;
  color: #111827;
  font-weight: 500;
`;

export const EmpSub = styled.span`
  font-size: 11px;
  color: #6b7280;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

export const Field = styled.div`
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label`
  font-size: 12px;
  color: #374151;
  font-weight: 500;
  margin-bottom: 5px;
  display: block;
`;

export const Input = styled.input`
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  color: #111827;
  font-size: 13px;
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder {
    color: #b0b7c3;
  }

  &:focus {
    border-color: #3352ba;
    box-shadow: 0 0 0 3px rgba(51, 82, 186, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  color: #111827;
  resize: vertical;
  outline: none;
  min-height: 72px;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: #3352ba;
    box-shadow: 0 0 0 3px rgba(51, 82, 186, 0.1);
  }
`;

export const Footer = styled.div`
  padding: 14px 20px;
  border-top: 1px solid #f0f2f7;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const CancelBtn = styled.button`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: transparent;
  color: #374151;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

export const SaveBtn = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  background: #3352ba;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  min-width: 80px;
  transition: background 0.15s;

  &:hover {
    background: #2f47a0;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;