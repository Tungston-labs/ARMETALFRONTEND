import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
`;

export const DepartmentItem = styled.div`
  margin-bottom: 22px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const DepartmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 10px;
`;

export const DepartmentName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #334155;
`;

export const Percentage = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #4f46e5;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 10px;

  background: #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
`;

export const Progress = styled.div`
  width: ${({ width }) => width};
  height: 100%;
  background: linear-gradient(
    90deg,
    #4f46e5,
    #818cf8
  );

  border-radius: inherit;
  transition: width 0.4s ease;
`;