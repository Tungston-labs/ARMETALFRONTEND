import styled from "styled-components";


/* =========================================================
   MAIN WRAPPER
========================================================= */

export const HeaderWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
`;


/* =========================================================
   TOP SECTION
   COMPANY + CONTACT
========================================================= */

export const TopSection = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;

  display: grid;
  grid-template-columns: minmax(0, 34fr) minmax(0, 66fr);

  gap: 14px;

  margin-bottom: 15px;

  box-sizing: border-box;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 38fr) minmax(0, 62fr);
  }

  @media (max-width: 960px) {
    grid-template-columns: 1fr;

    gap: 12px;
  }

  @media (max-width: 576px) {
    gap: 10px;

    margin-bottom: 16px;
  }
`;


/* =========================================================
   COMPANY CARD
========================================================= */

export const CompanyCard = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;
  background: #ffffff;
  border: 1px solid #0000001A;
  border-radius: 6px;
  min-height: 112px;

  padding: 18px 20px;

  display: flex;
  align-items: center;
  gap: 14px;

  box-sizing: border-box;

  overflow: hidden;

  @media (max-width: 1100px) {
    padding: 16px;
  }

  @media (max-width: 576px) {
    min-height: 90px;
    gap: 12px;
    padding: 14px;
  }
`;

export const WarehouseAvatar = styled.div`
  width: 54px;
  height: 54px;
  min-width: 54px;
  border-radius: 10px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #312e81 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  @media (max-width: 576px) {
    width: 44px;
    height: 44px;
    min-width: 44px;
  }
`;


/* =========================================================
   COMPANY DETAILS
========================================================= */

export const CompanyDetails = styled.div`
  width: 100%;
  min-width: 0;

  flex: 1;

  overflow: hidden;
`;


/* =========================================================
   COMPANY NAME
========================================================= */

export const CompanyName = styled.h2`
  margin: 0 0 4px;

  color: #202020;

  font-family: "Poppins", sans-serif;

  font-weight: 500;

  font-style: normal;

  font-size: clamp(15px, 1.3vw, 18px);

  line-height: 1.3;

  letter-spacing: 0;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
`;


/* =========================================================
   COMPANY TEXT
========================================================= */

export const CompanyText = styled.p`
  margin: 2px 0;

  color: #555555;

  font-family: "Poppins", sans-serif;

  font-weight: 400;

  font-style: normal;

  font-size: 13px;

  line-height: 1.45;

  letter-spacing: 0;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  @media (max-width: 576px) {
    font-size: 12px;
  }
`;


/* =========================================================
   CONTACT CARD
========================================================= */

export const ContactCard = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 4px;

  min-height: 100px;

  padding: 18px 24px;

  display: grid;

  grid-template-columns: repeat(4, minmax(0, 1fr));

  column-gap: 20px;

  row-gap: 16px;

  align-items: center;

  box-sizing: border-box;

  overflow: hidden;

  @media (max-width: 1200px) {
    padding: 18px 20px;

    column-gap: 14px;
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    row-gap: 18px;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));

    padding: 18px 20px;
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    row-gap: 16px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;

    padding: 16px;

    row-gap: 14px;
  }
`;


/* =========================================================
   CONTACT ITEM
========================================================= */

export const ContactItem = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 7px;

  overflow: hidden;

  @media (max-width: 576px) {
    gap: 5px;
  }
`;


/* =========================================================
   CONTACT TITLE
========================================================= */

export const ContactTitle = styled.div`
  display: flex;

  align-items: center;

  gap: 7px;

  min-width: 0;

  color: #444444;

  font-family: "Poppins", sans-serif;

  font-weight: 300;

  font-size: 13px;

  line-height: 18px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 1100px) {
    font-size: 12px;
  }

  @media (max-width: 576px) {
    font-size: 11px;
  }
`;


/* =========================================================
   CONTACT VALUE
========================================================= */

export const ContactValue = styled.strong`
  display: block;

  width: calc(100% - 23px);

  min-width: 0;

  margin-left: 23px;

  color: #171717;

  font-family: "Poppins", sans-serif;

  font-weight: 500;

  font-size: 13px;

  line-height: 18px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  @media (max-width: 1100px) {
    font-size: 12px;
  }

  @media (max-width: 576px) {
    font-size: 11px;

    margin-left: 22px;

    width: calc(100% - 22px);
  }
`;


/* =========================================================
   COMPANY INFORMATION CARD
========================================================= */

export const InfoCard = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 4px;

  min-height: 100px;

  padding: 20px 28px;

  display: grid;

  /*
    Large screen:
    7 information fields in one row.
  */
  grid-template-columns: repeat(7, minmax(0, 1fr));

  column-gap: 20px;

  row-gap: 20px;

  align-items: center;

  box-sizing: border-box;

  margin-bottom: 15px;

  overflow: hidden;

  @media (max-width: 1250px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));

    column-gap: 18px;

    padding: 20px 22px;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    column-gap: 16px;

    padding: 18px 20px;
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    column-gap: 16px;

    row-gap: 18px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;

    padding: 16px;

    margin-bottom: 16px;

    row-gap: 14px;
  }
`;


/* =========================================================
   INFORMATION ITEM
========================================================= */

export const InfoItem = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;

  flex-direction: column;

  gap: 7px;

  overflow: hidden;

  @media (max-width: 576px) {
    gap: 5px;
  }
`;


/* =========================================================
   INFORMATION LABEL
========================================================= */

export const InfoLabel = styled.div`
  display: flex;

  align-items: center;

  gap: 7px;

  min-width: 0;

  color: #444444;

  font-family: "Poppins", sans-serif;

  font-weight: 300;

  font-size: 13px;

  line-height: 18px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  svg {
    flex-shrink: 0;
  }

  @media (max-width: 1100px) {
    font-size: 12px;
  }

  @media (max-width: 576px) {
    font-size: 11px;
  }
`;


/* =========================================================
   INFORMATION VALUE
========================================================= */

export const InfoValue = styled.strong`
  display: block;

  width: calc(100% - 22px);

  min-width: 0;

  margin-left: 22px;

  color: #202020;

  font-family: "Poppins", sans-serif;

  font-weight: 500;

  font-size: 13px;

  line-height: 18px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  @media (max-width: 1100px) {
    font-size: 12px;
  }

  @media (max-width: 576px) {
    font-size: 11px;

    margin-left: 21px;

    width: calc(100% - 21px);
  }
`;


/* =========================================================
   DOCUMENTS CARD
========================================================= */

export const DocumentsCard = styled.div`
  width: 100%;
  max-width: 100%;
  min-width: 0;

  background: #ffffff;

  border: 1px solid #e5e7eb;

  border-radius: 4px;

  min-height: 100px;

  padding: 20px 30px;

  box-sizing: border-box;

  overflow: hidden;

  @media (max-width: 1000px) {
    padding: 18px 22px;
  }

  @media (max-width: 700px) {
    padding: 18px;
  }

  @media (max-width: 576px) {
    padding: 16px;
  }
`;


/* =========================================================
   DOCUMENTS TITLE
========================================================= */

export const DocumentsTitle = styled.div`
  margin-bottom: 14px;

  color: #222222;

  font-family: "Poppins", sans-serif;

  font-weight: 400;

  font-style: normal;

  font-size: 16px;

  line-height: 20px;

  letter-spacing: 0;

  @media (max-width: 576px) {
    font-size: 13px;

    line-height: 18px;

    margin-bottom: 10px;
  }
`;


/* =========================================================
   DOCUMENTS CONTENT
========================================================= */

export const DocumentsContent = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;

  align-items: flex-start;

  gap: 20px;

  box-sizing: border-box;

  @media (max-width: 800px) {
    flex-direction: column;

    gap: 14px;
  }
`;


/* =========================================================
   DOCUMENTS LIST
========================================================= */

export const DocumentsList = styled.div`
  width: 100%;
  min-width: 0;

  flex: 1;

  display: flex;

  align-items: flex-start;

  flex-wrap: wrap;

  gap: 12px;

  box-sizing: border-box;

  /*
    Important:
    Documents wrap instead of scrolling.
  */
  overflow: visible;
`;


/* =========================================================
   DOCUMENT ITEM
========================================================= */

export const DocumentItem = styled.div`
  /*
    Flexible width on desktop.
    Minimum prevents the card from becoming too small.
  */
  width: 150px;

  min-width: 140px;

  max-width: 180px;

  height: 40px;

  flex: 1 1 150px;

  border: 1px solid #e1e1e1;

  border-radius: 4px;

  background: #ffffff;

  padding: 4px 7px;

  box-sizing: border-box;

  display: flex;

  align-items: center;

  overflow: hidden;

  @media (max-width: 700px) {
    flex: 1 1 140px;

    min-width: 130px;

    max-width: none;
  }

  @media (max-width: 480px) {
    width: 100%;

    min-width: 0;

    flex: 1 1 100%;

    max-width: none;
  }
`;


/* =========================================================
   DOCUMENT ICON
========================================================= */

export const DocumentIcon = styled.div`
  width: 25px;

  min-width: 25px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #ef2b2d;

  flex-shrink: 0;
`;


/* =========================================================
   DOCUMENT DETAILS
========================================================= */

export const DocumentDetails = styled.div`
  display: flex;

  flex-direction: column;

  min-width: 0;

  margin-left: 5px;

  flex: 1;

  overflow: hidden;
`;


/* =========================================================
   DOCUMENT NAME
========================================================= */

export const DocumentName = styled.span`
  min-width: 0;

  color: #333333;

  font-family: "Poppins", sans-serif;

  font-weight: 400;

  font-size: 12px;

  line-height: 15px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;

  @media (max-width: 576px) {
    font-size: 11px;
  }
`;


/* =========================================================
   DOCUMENT SIZE
========================================================= */

export const DocumentSize = styled.span`
  color: #777777;

  font-family: "Poppins", sans-serif;

  font-weight: 300;

  font-size: 8px;

  line-height: 11px;

  margin-top: 2px;

  white-space: nowrap;
`;


/* =========================================================
   DOWNLOAD BUTTON
========================================================= */

export const DownloadButton = styled.button`
  width: 24px;

  height: 24px;

  min-width: 24px;

  border: none;

  background: transparent;

  padding: 2px;

  margin-left: 3px;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #333333;

  flex-shrink: 0;

  &:hover {
    color: #000000;
  }
`;


/* =========================================================
   UPLOAD DOCUMENT
========================================================= */

export const UploadButton = styled.button`
  height: 40px;

  min-width: 145px;

  padding: 0 14px;

  border: 1px solid #dedede;

  border-radius: 4px;

  background: #ffffff;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  color: #333333;

  font-family: "Poppins", sans-serif;

  font-weight: 300;

  font-size: 13px;

  line-height: 18px;

  white-space: nowrap;

  cursor: pointer;

  flex-shrink: 0;

  box-sizing: border-box;

  &:hover {
    background: #f8f8f8;
  }

  @media (max-width: 800px) {
    width: 100%;

    min-width: 0;
  }

  @media (max-width: 576px) {
    height: 38px;

    font-size: 11px;
  }
`;
export const Page = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 20px;

  background: #f5f8ff;

  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    padding: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const Header = styled.div`
  min-height: 64px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    padding-top: 50px;
    gap: 12px;
  }
`;

export const HeaderBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const BackChevronButton = styled.button`
  background: transparent;
  border: none;
  padding: 4px 2px;
  margin: 0;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  color: #111827;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: #3250bc;
    background: rgba(50, 80, 188, 0.08);
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  gap: 2px;
`;

export const Title = styled.h1`
  margin: 0;

  font-size: clamp(19px, 1.8vw, 24px);
  font-weight: 500;

  line-height: 1.3;

  color: #3250bc;
  overflow-wrap: anywhere;
`;

export const HeaderSubtitle = styled.p`
  margin: 0;

  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #374151;

  @media (max-width: 576px) {
    font-size: 12px;
  }
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
  flex-wrap: wrap;

  gap: 8px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const EditButton = styled.button`
  height: 38px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const DeleteButton = styled.button`
  height: 38px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 6px;
  background: #3857b9;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #2e49a5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
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
