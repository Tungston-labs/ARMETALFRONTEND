// LeaveRequest.styles.js
import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const Container = styled.div`
  padding: 20px;

`;



export const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ApproveButton = styled.button`
  padding: 6px 14px;
  min-width: 74px;
  border: 1px solid #55c36a;
  background: #eaf9ed;
  color: #1f2937;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #55c36a;
    color: #fff;
  }

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
  }
`;

export const RejectButton = styled.button`
  padding: 6px 14px;
  min-width: 74px;
  border: 1px solid #ff6b6b;
  background: #fff5f5;
  color: #1f2937;
  border-radius: 3px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff6b6b;
    color: #fff;
  }

  &:disabled {
    opacity: .6;
    cursor: not-allowed;
  }
`;



