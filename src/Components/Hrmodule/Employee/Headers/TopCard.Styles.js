import styled from "styled-components";

export const CardContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  min-height: 10vh;   /* you requested this */

  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-4px);
  }

  @media (max-width: 1024px) {
    padding: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 22vh;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
`;

export const LeftIcon = styled.div`
  font-size: 2.8rem;
  color: #2f4ded;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 600;
`;

export const Count = styled.h3`
  font-size: 1.6rem;
  font-weight: 700;
`;

export const Divider = styled.div`
  height: 3px;
  width: 100%;
  background: #2f4ded;
  margin: 0.8rem 0;
`;

export const EmployeeList = styled.div`
  margin-top: 0.5rem;
`;

export const EmployeeRow = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 1fr 1fr;
  align-items: center;
  gap: 0.5rem;
  margin: 4px 0;

  @media (max-width: 768px) {
    grid-template-columns: 35px 1fr 1fr;
  }
`;

export const Avatar = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
`;

export const EmpName = styled.div`
  font-size: 0.9rem;
`;

export const EmpId = styled.div`
  font-size: 0.9rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const EmpDept = styled.div`
  font-size: 0.9rem;
  text-align: right;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ArrowIcon = styled.div`
  font-size: 1.5rem;
  color: #2f4ded;
  align-self: flex-end;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;
