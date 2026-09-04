import styled from "styled-components";

/* =========================================================
   PAGE
========================================================= */

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;

  padding: 20px;
  background: #f5f6fa;
  color: #171717;

  font-family: "Poppins", "Inter", Arial, sans-serif;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

/* =========================================================
   HEADER
========================================================= */

export const Header = styled.header`
  width: 100%;
  min-height: 52px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  padding: 0 4px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 4px 0 12px;
  }
`;

export const HeaderLeft = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const PageTitle = styled.h1`
  margin: 0;

  color: #3154c5;
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #777;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const BreadcrumbHome = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  color: #777;
`;

export const BreadcrumbArrow = styled.span`
  display: flex;
  align-items: center;

  color: #222;
  font-size: 15px;
  line-height: 1;
`;

export const BreadcrumbCurrent = styled.span`
  color: #151515;
  font-weight: 500;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    justify-content: flex-end;
  }

  @media (max-width: 400px) {
    justify-content: stretch;
  }
`;

export const CancelButton = styled.button`
  min-width: 76px;
  height: 32px;

  padding: 0 16px;

  border: 1px solid #222;
  border-radius: 4px;

  background: #fff;
  color: #222;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 500;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f4f4f4;
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 400px) {
    flex: 1;
  }
`;

export const SaveButton = styled.button`
  min-width: 82px;
  height: 32px;

  padding: 0 17px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  border: none;
  border-radius: 4px;

  background: #3855bd;
  color: #fff;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2f49a7;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 400px) {
    flex: 1;
  }
`;

/* =========================================================
   MAIN CARD
========================================================= */

export const MainCard = styled.div`
  width: 100%;
  box-sizing: border-box;

  background: #fff;
  border-radius: 4px;

  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

  overflow: hidden;
`;

/* =========================================================
   SECTION
========================================================= */

export const Section = styled.section`
  width: 100%;
  box-sizing: border-box;

  padding: 22px 20px 16px;

  border-bottom: 1px solid #e8e8e8;

  @media (max-width: 768px) {
    padding: 20px 16px 15px;
  }

  @media (max-width: 480px) {
    padding: 18px 14px 14px;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0 0 12px;

  color: #171717;

  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;

  @media (max-width: 600px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const SectionDescription = styled.p`
  margin: 0 0 18px;

  color: #666;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;

  @media (max-width: 600px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

/* =========================================================
   FORM
========================================================= */

export const FormGrid = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  column-gap: 18px;
  row-gap: 16px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    row-gap: 14px;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
  min-width: 0;

  &.wide-field {
    grid-column: span 2;
  }

  @media (max-width: 1200px) {
    &.wide-field {
      grid-column: span 1;
    }
  }
`;

export const Label = styled.label`
  display: block;

  margin-bottom: 7px;

  color: #1d1d1d;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

/* =========================================================
   INPUT
========================================================= */

export const Input = styled.input`
  width: 100%;
  height: 36px;
  box-sizing: border-box;

  padding: 0 10px;

  border: 1px solid #e0e0e0;
  border-radius: 5px;

  outline: none;

  background: #fff;
  color: #333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #a3a3a3;
  }

  &:hover {
    border-color: #cfcfcf;
  }

  &:focus {
    border-color: #5270d1;
    box-shadow: 0 0 0 2px rgba(82, 112, 209, 0.08);
  }

  &[type="file"] {
    padding: 5px 8px;
    cursor: pointer;
  }

  &:disabled {
    background: #f7f7f7;
    cursor: not-allowed;
  }
`;

/* =========================================================
   SELECT
========================================================= */

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;

  &::after {
    content: "⌄";

    position: absolute;
    right: 11px;
    top: 50%;

    transform: translateY(-55%);

    pointer-events: none;

    color: #222;
    font-size: 14px;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 36px;

  box-sizing: border-box;

  appearance: none;

  padding: 0 32px 0 10px;

  border: 1px solid #e0e0e0;
  border-radius: 5px;

  outline: none;

  background: #fff;

  color: ${(props) => (props.value ? "#333" : "#999")};

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;

  cursor: pointer;

  transition: border-color 0.2s ease;

  &:hover {
    border-color: #cfcfcf;
  }

  &:focus {
    border-color: #5270d1;
    box-shadow: 0 0 0 2px rgba(82, 112, 209, 0.08);
  }
`;

/* =========================================================
   CONTACT
========================================================= */

export const ContactWrapper = styled.div`
  width: 100%;
  height: 36px;

  display: flex;
  align-items: stretch;
`;

export const CountryCodeSelect = styled.select`
  width: 74px;
  min-width: 74px;
  height: 36px;

  box-sizing: border-box;

  padding: 0 5px;

  border: 1px solid #e0e0e0;
  border-right: none;
  border-radius: 5px 0 0 5px;

  outline: none;

  background: #fff;
  color: #666;

  font-family: "Poppins", sans-serif;
  font-size: 12px;

  cursor: pointer;

  &:focus {
    border-color: #5270d1;
  }

  @media (max-width: 480px) {
    width: 68px;
    min-width: 68px;
  }
`;

export const PhoneInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 36px;

  box-sizing: border-box;

  padding: 0 9px;

  border: 1px solid #e0e0e0;
  border-radius: 0 5px 5px 0;

  outline: none;

  background: #fff;
  color: #333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    border-color: #5270d1;
    box-shadow: 0 0 0 2px rgba(82, 112, 209, 0.08);
  }
`;

/* =========================================================
   SERVICES
========================================================= */

export const ServicesGrid = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 12px;

  margin-bottom: 8px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const ServiceCard = styled.div`
  width: 100%;
  min-height: 58px;

  box-sizing: border-box;

  padding: 10px 18px;

  display: flex;
  align-items: center;
  gap: 18px;

  border: 1px solid
    ${(props) => (props.active ? "#6883df" : "#e1e1e1")};

  border-radius: 5px;

  background: #fff;

  transition: border-color 0.2s ease;

  &:hover {
    border-color: #6883df;
  }

  @media (max-width: 480px) {
    padding: 10px 12px;
    gap: 12px;
  }
`;

export const ServiceIcon = styled.div`
  width: 55px;
  height: 36px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 4px;

  color: #fff;

  font-size: 14px;
  font-weight: 500;

  background: ${(props) =>
    props.finance ? "#ed8528" : "#3d5bc2"};

  @media (max-width: 480px) {
    width: 48px;
    height: 34px;
  }
`;

export const ServiceContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ServiceTitle = styled.div`
  margin-bottom: 5px;

  color: #171717;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const ServiceDescription = styled.div`
  overflow: hidden;

  color: #555;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.4;

  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 600px) {
    white-space: normal;
    font-size: 11px;
  }
`;

/* =========================================================
   TOGGLE
========================================================= */

export const ToggleWrapper = styled.div`
  flex-shrink: 0;

  display: flex;
  align-items: center;

  cursor: pointer;
`;

export const Toggle = styled.div`
  position: relative;

  width: 30px;
  height: 16px;

  border-radius: 20px;

  background: ${(props) =>
    props.active ? "#3f5ec7" : "#d9d9d9"};

  transition: background 0.2s ease;
`;

export const ToggleSlider = styled.div`
  position: absolute;

  top: 2px;
  left: ${(props) => (props.active ? "16px" : "2px")};

  width: 12px;
  height: 12px;

  border-radius: 50%;

  background: #fff;

  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);

  transition: left 0.2s ease;
`;

/* =========================================================
   FEATURE BOX
========================================================= */

export const FeatureBox = styled.div`
  width: 100%;
  box-sizing: border-box;

  margin-top: 10px;

  padding: 14px 24px 17px;

  background: #f4f6fb;

  border: 1px solid #e8ebf2;
  border-radius: 4px;

  @media (max-width: 768px) {
    padding: 14px 16px;
  }

  @media (max-width: 480px) {
    padding: 13px;
  }
`;

export const FeatureHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;

  margin-bottom: 18px;

  @media (max-width: 500px) {
    align-items: flex-start;
  }
`;

export const FeatureTitle = styled.h3`
  margin: 0;

  color: #1c1c1c;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.3;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const SelectAllWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  flex-shrink: 0;
`;

export const SelectAllLabel = styled.span`
  color: #222;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;

  @media (max-width: 600px) {
    font-size: 11px;
  }
`;

/* =========================================================
   FEATURES
========================================================= */

export const FeatureGrid = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));

  gap: 16px 14px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }

  @media (max-width: 1000px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px 10px;
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureItem = styled.label`
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 9px;

  color: #222;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.3;

  text-transform: uppercase;

  cursor: pointer;

  @media (max-width: 600px) {
    font-size: 11px;
  }
`;

export const Checkbox = styled.input`
  appearance: none;

  width: 17px;
  height: 17px;

  flex-shrink: 0;

  margin: 0;

  border: 1px solid #bcbcbc;
  border-radius: 2px;

  background: #fff;

  cursor: pointer;

  transition: all 0.15s ease;

  &:hover {
    border-color: #3d5bc2;
  }

  &:checked {
    position: relative;

    background: #3d5bc2;
    border-color: #3d5bc2;
  }

  &:checked::after {
    content: "✓";

    position: absolute;

    left: 3px;
    top: -1px;

    color: #fff;

    font-size: 13px;
    font-weight: 600;
  }

  &:focus-visible {
    outline: 2px solid rgba(61, 91, 194, 0.25);
    outline-offset: 2px;
  }
`;

/* =========================================================
   SALARY
========================================================= */

export const SalarySection = styled.section`
  width: 100%;
  box-sizing: border-box;

  padding: 18px 20px 24px;

  @media (max-width: 768px) {
    padding: 18px 16px 20px;
  }

  @media (max-width: 480px) {
    padding: 16px 14px 20px;
  }
`;

export const SalaryGrid = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  gap: 18px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const SalaryInputWrapper = styled.div`
  width: 100%;
  min-width: 0;
`;

export const SalaryInput = styled.input`
  width: 100%;
  height: 36px;

  box-sizing: border-box;

  padding: 0 10px;

  border: 1px solid #e1e1e1;
  border-radius: 5px;

  outline: none;

  background: #fff;
  color: #333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #a8a8a8;
  }

  &:hover {
    border-color: #cfcfcf;
  }

  &:focus {
    border-color: #5270d1;
    box-shadow: 0 0 0 2px rgba(82, 112, 209, 0.08);
  }

  &:disabled {
    background: #f7f7f7;
    cursor: not-allowed;
  }
`;

export const TotalInput = styled.input`
  width: 100%;
  height: 36px;

  box-sizing: border-box;

  padding: 0 10px;

  border: 1px solid #e1e1e1;
  border-radius: 5px;

  outline: none;

  background: #fff;
  color: #ef3333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;

  &:focus {
    border-color: #5270d1;
    box-shadow: 0 0 0 2px rgba(82, 112, 209, 0.08);
  }
`;
/* =========================================================
   LOGO UPLOAD
========================================================= */

export const LogoUploadWrapper = styled.div`
  width: 100%;
`;

export const LogoUploadBox = styled.label`
  width: 100%;
  min-height: 125px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 18px;

  border: 1px dashed
    ${(props) => (props.hasError ? "#ef3333" : "#cfd5e3")};

  border-radius: 8px;

  background: #fafbfe;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: #5270d1;
    background: #f6f8fd;
    box-shadow: 0 2px 8px rgba(61, 91, 194, 0.06);
  }

  &:focus-within {
    border-color: #5270d1;
    box-shadow: 0 0 0 3px rgba(82, 112, 209, 0.08);
  }
`;

export const LogoInput = styled.input`
  display: none;
`;

export const LogoUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

export const LogoUploadIcon = styled.div`
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 8px;

  border-radius: 50%;

  background: #eef2ff;
  color: #3d5bc2;

  font-size: 21px;
  font-weight: 600;

  line-height: 1;
`;

export const LogoUploadTitle = styled.div`
  margin-bottom: 4px;

  color: #202020;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
`;

export const LogoUploadText = styled.div`
  color: #888;

  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 400;

  line-height: 1.5;
`;

export const LogoPreviewWrapper = styled.div`
  width: 100%;
  min-height: 88px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  gap: 12px;

  padding: 10px 12px;

  border: 1px solid #dfe4ef;
  border-radius: 8px;

  background: #fafbfe;
`;

export const LogoPreview = styled.img`
  width: 64px;
  height: 64px;

  flex-shrink: 0;

  object-fit: contain;

  padding: 5px;

  box-sizing: border-box;

  border: 1px solid #e1e1e1;
  border-radius: 7px;

  background: #fff;
`;

export const RemoveLogoButton = styled.button`
  margin-left: auto;

  flex-shrink: 0;

  padding: 6px 10px;

  border: 1px solid #efc5c5;
  border-radius: 5px;

  background: #fff;
  color: #d64545;

  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 500;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #fff2f2;
    border-color: #e7a5a5;
  }
`;