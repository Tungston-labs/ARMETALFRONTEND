import styled from "styled-components";

export const PageContainer = styled.div`
  padding: 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const ExportButton = styled.button`
  height: 40px;
  padding: 0 18px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  background: #ffffff;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 6px;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.3px;

  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: 1 1 auto;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const ActionIconButton = styled.button`
  width: 28px;
  height: 28px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #ffffff;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 4px;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #3250bc;
    border-color: #3250bc;
    background: #eff6ff;
  }
`;

export const FilterTagBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  font-size: 12px;
  font-weight: 500;

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    font-weight: 700;
    line-height: 1;
  }
`;
