import styled from "styled-components";

export const HeaderWrapper = styled.div`
  width: 100%;
  margin-bottom: 15px;
`;

export const Tabs = styled.div`
  width: 100%;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: space-around;

  background: #ffffff;
  border-radius: 3px;

  box-sizing: border-box;
`;

export const Tab = styled.button`
  position: relative;

  height: 100%;
  min-width: 74px;

  padding: 0;
  border: none;
  background: transparent;

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: inherit;
  font-size: 11px;
font-size: 16px;
  font-weight: ${({ $active }) =>
    $active ? "700" : "400"};

  color: ${({ $active }) =>
    $active ? "#3250B5" : "#222222"};

  cursor: pointer;

  &::after {
    content: "";

    position: absolute;

    left: 0;
    right: 0;
    bottom: 0;

    height: 2px;

    background: #3155c9;

    opacity: ${({ $active }) =>
      $active ? 1 : 0};
  }
`;

/* =========================================
   COMPANY + CONTACT
========================================= */

export const TopSection = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: 342px minmax(0, 1fr);

  gap: 10px;

  margin-top: 24px;
`;

export const CompanyCard = styled.div`
  min-height: 102px;

  display: flex;
  align-items: center;

  padding: 16px;

  background: #ffffff;

  border: 1px solid #e1e4e9;
  border-radius: 3px;

  box-sizing: border-box;
`;

export const CompanyLogo = styled.div`
  width: 50px;
  height: 56px;

  flex-shrink: 0;

  overflow: hidden;

  border-radius: 7px;

  background: #050505;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const CompanyInfo = styled.div`
  margin-left: 18px;

  display: flex;
  flex-direction: column;

  h3 {
    margin: 0 0 1px;

    font-size: 14px;
    font-weight: 500;

    color: #111111;
  }

  p {
    margin: 0 0 3px;

    font-size: 11px;

    color: #555555;
  }

  span {
    font-size: 10px;
    line-height: 14px;

    color: #444444;
  }
`;

/* =========================================
   CONTACT
========================================= */

export const ContactCard = styled.div`
  min-height: 102px;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  align-items: center;

  padding: 12px 30px;

  background: #ffffff;

  border: 1px solid #e1e4e9;
  border-radius: 3px;

  box-sizing: border-box;
`;

export const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;

  gap: 10px;
`;

export const ContactIcon = styled.div`
  width: 16px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-top: 1px;

  color: #222222;
`;

export const ContactContent = styled.div`
  min-width: 0;
`;

export const ContactLabel = styled.div`
  margin-bottom: 6px;

  font-size: 10px;

  color: #555555;
`;

export const ContactValue = styled.div`
  font-size: 10px;

  font-weight: 500;

  color: #222222;

  white-space: nowrap;
`;

/* =========================================
   COMPANY DETAILS
========================================= */

export const DetailsCard = styled.div`
  width: 100%;
  min-height: 101px;

  display: grid;

  grid-template-columns: repeat(7, minmax(0, 1fr));

  align-items: center;

  margin-top: 24px;

  padding: 15px 28px;

  background: #ffffff;

  border: 1px solid #e1e4e9;
  border-radius: 3px;

  box-sizing: border-box;
`;

export const DetailItem = styled.div`
  min-width: 0;
`;

export const DetailLabel = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;

  margin-bottom: 9px;

  font-size: 10px;

  color: #333333;

  white-space: nowrap;

  svg {
    flex-shrink: 0;

    color: #555555;
  }
`;

export const DetailValue = styled.div`
  padding-left: 24px;

  font-size: 10px;

  font-weight: 500;

  color: #222222;

  white-space: nowrap;
`;

/* =========================================
   DOCUMENTS
========================================= */

export const DocumentsCard = styled.div`
  width: 100%;

  min-height: 102px;

  margin-top: 24px;

  padding: 18px 31px;

  background: #ffffff;

  border: 1px solid #e1e4e9;
  border-radius: 3px;

  box-sizing: border-box;
`;

export const DocumentsTitle = styled.div`
  margin-bottom: 10px;

  font-size: 11px;

  color: #222222;
`;

export const DocumentsList = styled.div`
  width: 100%;

  display: flex;
  align-items: center;

  gap: 33px;
`;

export const DocumentBox = styled.div`
  width: 128px;
  height: 40px;

  flex-shrink: 0;

  display: flex;
  align-items: center;

  padding: 5px 8px;

  background: #ffffff;

  border: 1px solid #e1e4e9;

  border-radius: 4px;

  box-sizing: border-box;
`;

export const PdfIcon = styled.div`
  width: 25px;

  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: #e51d2a;

  svg {
    width: 18px;
    height: 18px;
  }

  span {
    margin-top: -2px;

    font-size: 6px;
    font-weight: 600;
  }
`;

export const DocumentInfo = styled.div`
  min-width: 0;

  margin-left: 7px;
`;

export const DocumentName = styled.div`
  overflow: hidden;

  font-size: 9px;

  color: #222222;

  white-space: nowrap;

  text-overflow: ellipsis;
`;

export const DocumentSize = styled.div`
  margin-top: 2px;

  font-size: 8px;

  color: #777777;
`;

export const DocumentAction = styled.div`
  margin-left: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #555555;

  cursor: pointer;
`;

export const UploadButton = styled.button`
  height: 28px;

  margin-left: auto;

  flex-shrink: 0;

  display: flex;
  align-items: center;

  gap: 5px;

  padding: 0 10px;

  background: #ffffff;

  border: 1px solid #e0e3e8;

  border-radius: 4px;

  font-family: inherit;
  font-size: 9px;

  color: #333333;

  cursor: pointer;

  &:hover {
    background: #f7f8fa;
  }
`;
