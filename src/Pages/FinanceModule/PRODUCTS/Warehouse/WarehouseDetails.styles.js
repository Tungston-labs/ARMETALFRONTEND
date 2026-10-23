import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;

  box-sizing: border-box;

  padding: 0 20px 30px;

  background: #f5f8ff;

  font-family: "Poppins", sans-serif;
`;

export const Header = styled.div`
  min-height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;

  gap: 4px;
`;

export const Title = styled.h1`
  margin: 0;

  font-size: 19px;
  font-weight: 500;

  line-height: 1.4;

  color: #3454b9;
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;

  font-size: 11px;

  color: #111111;
`;

export const BreadcrumbItem = styled.span`
  color: ${({ $active }) =>
    $active ? "#3454b9" : "#111111"};
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;
`;

export const EditButton = styled.button`
  height: 32px;

  padding: 0 13px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  border: 1px solid #e1e1e1;
  border-radius: 4px;

  background: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 500;

  color: #111111;

  cursor: pointer;
`;

export const DeleteButton = styled.button`
  height: 32px;

  padding: 0 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  border: none;
  border-radius: 4px;

  background: #3454b9;

  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 500;

  color: #ffffff;

  cursor: pointer;
`;

export const DetailsGrid = styled.div`
  display: grid;

  grid-template-columns: 0.72fr 1.28fr;

  gap: 10px;

  margin-top: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;