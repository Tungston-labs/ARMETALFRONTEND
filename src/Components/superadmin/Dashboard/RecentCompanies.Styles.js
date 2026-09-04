import styled from "styled-components";

export const CompaniesSection = styled.section`
  width: 100%;
  box-sizing: border-box;
  background: #3857bd;
  border-radius: 4px;
  padding: 22px 30px 28px;
  color: #ffffff;
  margin-bottom: 15px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  color: #ffffff;
`;

export const ViewAll = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const CompaniesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
`;

export const CompanyCard = styled.div`
  min-width: 0;
  height: 116px;
  box-sizing: border-box;

  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 9px;

  padding: 18px 14px;

  display: flex;
  align-items: center;
  gap: 18px;

  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.04);
  }
`;

export const CompanyLogo = styled.img`
  width: 105px;
  max-width: 55%;
  height: 65px;
  object-fit: contain;
  flex-shrink: 0;
`;

export const CompanyInfo = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CompanyName = styled.div`
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CompanyUsername = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
