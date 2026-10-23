import styled from "styled-components";

/* =====================================================
   PAGE CONTAINER
===================================================== */

export const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;

  background: #ffffff;

  padding: 20px;

  box-sizing: border-box;

  @media (max-width: 1200px) {
    padding: 18px;
  }

  @media (max-width: 768px) {
    padding: 14px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

/* =====================================================
   FORM CARD
===================================================== */

export const FormCard = styled.div`
  width: 100%;
  max-width: 100%;

  background: #ffffff;

  overflow: hidden;

  box-sizing: border-box;
`;

/* =====================================================
   TOP STEPPER
===================================================== */

export const StepperWrapper = styled.div`
  position: relative;

  width: 100%;
  min-height: 101px;

  display: flex;
  align-items: center;

  background: linear-gradient(
    105deg,
    #ff861f 0%,
    #dc8055 45%,
    #71658e 100%
  );

  border-radius: 3px;

  box-sizing: border-box;

  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 90px;
  }

  @media (max-width: 600px) {
    min-height: 82px;
  }
`;

/* =====================================================
   PROFILE IMAGE
===================================================== */

export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border: 3px solid #ffffff;
  border-radius: 50%;
  background: #eeeeee;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    border-width: 2px;
  }
`;
export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;

  object-fit: cover;
`;

/* =====================================================
   STEPPER CONTENT
===================================================== */

export const StepperContent = styled.div`
  flex: 1;

  min-width: 0;

  height: 101px;

  display: flex;
  align-items: center;

  padding: 0 65px 0 32px;

  box-sizing: border-box;

  overflow-x: auto;
  overflow-y: hidden;

  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1200px) {
    height: 90px;

    padding: 0 35px 0 25px;
  }

  @media (max-width: 768px) {
    height: 82px;

    padding: 0 20px;
  }

  @media (max-width: 600px) {
    height: 75px;

    padding: 0 15px;
  }

  @media (max-width: 420px) {
    height: 68px;

    padding: 0 10px;
  }
`;

/* =====================================================
   STEP ITEM
===================================================== */

export const StepItem = styled.div`
  position: relative;

  flex: 0 0 125px;

  height: 101px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  @media (max-width: 1200px) {
    flex-basis: 110px;

    height: 90px;
  }

  @media (max-width: 768px) {
    flex-basis: 95px;

    height: 82px;
  }

  @media (max-width: 600px) {
    flex-basis: 85px;

    height: 75px;
  }

  @media (max-width: 420px) {
    flex-basis: 78px;

    height: 68px;
  }
`;

/* =====================================================
   STEP ICON
===================================================== */

export const StepIcon = styled.div`
  width: 40px;
  height: 40px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  border: 1px solid
    ${(props) =>
      props.$active
        ? "#ffffff"
        : "rgba(255, 255, 255, 0.42)"};

  background: ${(props) =>
    props.$active
      ? "#3d60d4"
      : "transparent"};

  color: #ffffff;

  box-sizing: border-box;

  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 34px;
    height: 34px;

    font-size: 14px;
  }

  @media (max-width: 600px) {
    width: 30px;
    height: 30px;

    font-size: 12px;
  }

  @media (max-width: 420px) {
    width: 27px;
    height: 27px;

    font-size: 11px;
  }
`;

/* =====================================================
   STEP TITLE
===================================================== */

export const StepTitle = styled.span`
  margin-top: 7px;

  font-size: 13px;

  line-height: 16px;

  font-weight: ${(props) =>
    props.$active ? "600" : "400"};

  color: ${(props) =>
    props.$active
      ? "#ffffff"
      : "rgba(255, 255, 255, 0.55)"};

  white-space: nowrap;

  text-align: center;

  @media (max-width: 768px) {
    font-size: 11px;

    line-height: 14px;

    margin-top: 5px;
  }

  @media (max-width: 600px) {
    font-size: 10px;

    line-height: 12px;
  }

  @media (max-width: 420px) {
    font-size: 9px;
  }
`;

/* =====================================================
   STEP LINE
===================================================== */

export const StepLine = styled.div`
  flex: 1;

  min-width: 35px;

  height: 0;

  margin: 0 12px;

  border-top: 2px dashed
    rgba(255, 255, 255, 0.78);

  box-sizing: border-box;

  @media (max-width: 768px) {
    min-width: 25px;

    margin: 0 8px;
  }

  @media (max-width: 600px) {
    min-width: 18px;

    margin: 0 5px;
  }
`;

/* =====================================================
   ACTIVE UNDERLINE
===================================================== */

export const ActiveUnderline = styled.div`
  position: absolute;

  left: -7px;
  right: -7px;

  bottom: 0;

  height: 5px;

  background: #3c5dcc;

  @media (max-width: 600px) {
    height: 4px;
  }
`;

/* =====================================================
   SECTION
===================================================== */

export const Section = styled.section`
  width: 100%;

  padding: 30px 24px 13px;

  box-sizing: border-box;

  border-bottom: 1px solid #e8e8e8;

  @media (max-width: 1200px) {
    padding: 26px 20px 13px;
  }

  @media (max-width: 768px) {
    padding: 22px 16px 12px;
  }

  @media (max-width: 480px) {
    padding: 18px 12px 10px;
  }
`;

/* =====================================================
   SECTION TITLE
===================================================== */

export const SectionTitle = styled.h2`
  margin: 0 0 14px;
  color: #171717;
  font-size: 15px;
  font-weight: 500;
  line-height: 18px;
font-size: "poppins";
  @media (max-width: 600px) {
    font-size: 14px;

    margin-bottom: 12px;
  }

  @media (max-width: 420px) {
    font-size: 13px;
  }
`;

/* =====================================================
   FORM GRID
===================================================== */

export const FormGrid = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns: repeat(
    5,
    minmax(0, 1fr)
  );

  column-gap: 22px;

  row-gap: 14px;

  box-sizing: border-box;

  /* Large desktop */

  @media (min-width: 1600px) {
    column-gap: 28px;

    row-gap: 16px;
  }
 
  /* Laptop */

  @media (max-width: 1200px) {
    grid-template-columns: repeat(
      3,
      minmax(0, 1fr)
    );

    column-gap: 18px;
  }

  /* Tablet */

  @media (max-width: 1200px) {
    grid-template-columns: repeat(
      3,
      minmax(0, 1fr)
    );

    column-gap: 16px;
  }

  /* Small tablet */

  @media (max-width: 768px) {
    grid-template-columns: repeat(
      2,
      minmax(0, 1fr)
    );

    column-gap: 14px;

    row-gap: 13px;
  }

  /* Mobile */

  @media (max-width: 480px) {
    grid-template-columns: 1fr;

    column-gap: 0;

    row-gap: 12px;
  }
`;

/* =====================================================
   FORM GROUP
===================================================== */

export const FormGroup = styled.div`
  width: 100%;

  min-width: 0;

  ${(props) =>
    props.$fullWidth &&
    `
      grid-column: 1 / -1;
    `}

  ${(props) =>
    props.$wide &&
    `
      grid-column: 2 / -1;
    `}

  @media (max-width: 480px) {
    grid-column: 1 / -1;
  }
`;

/* =====================================================
   LABEL
===================================================== */

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #171717;
  font-size: 13px;
  font-weight: 400;
font-family: "poppins";
  line-height: 15px;

  @media (max-width: 600px) {
    font-size: 12px;

    margin-bottom: 6px;
  }

  @media (max-width: 420px) {
    font-size: 11px;
  }
`;

/* =====================================================
   REQUIRED
===================================================== */

export const Required = styled.span`
  color: #ef3434;

  margin-left: 2px;
`;

/* =====================================================
   ERROR TEXT
===================================================== */

export const ErrorText = styled.span`
  display: block;

  margin-top: 6px;

  color: #ef3434;

  font-size: 11px;

  line-height: 14px;

  @media (max-width: 420px) {
    font-size: 10px;
  }
`;

/* =====================================================
   CHECKBOX (e.g. 80C declaration)
===================================================== */

export const CheckboxWrapper = styled.label`
  display: flex;

  align-items: center;

  gap: 8px;

  height: 35px;

  cursor: pointer;

  min-width: 0;
`;

export const CheckboxInput = styled.input.attrs({ type: "checkbox" })`
  width: 16px;

  height: 16px;

  flex-shrink: 0;

  accent-color: #3c5dcc;

  cursor: pointer;
`;

export const CheckboxLabel = styled.span`
  color: #333333;

  font-size: 12px;

  line-height: 15px;

  @media (max-width: 420px) {
    font-size: 11px;
  }
`;

/* =====================================================
   DOCUMENT UPLOAD BLOCK
===================================================== */

export const UploadSection = styled.div`
  width: 100%;

  padding: 14px 0;

  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const LabelRow = styled.div`
  display: flex;

  align-items: center;

  flex-wrap: wrap;

  gap: 10px;

  margin-bottom: 10px;

  color: #171717;

  font-size: 13px;

  font-weight: 500;

  @media (max-width: 420px) {
    font-size: 12px;
  }
`;

export const SizeHint = styled.span`
  color: #969696;

  font-size: 11px;

  font-weight: 400;
`;

export const InlineUploadRow = styled.div`
  display: flex;

  flex-wrap: wrap;

  align-items: center;

  gap: 12px;
`;

export const UploadButton = styled.button`
  display: flex;

  align-items: center;

  gap: 6px;

  height: 36px;

  padding: 0 14px;

  border: 1px dashed #3c5dcc;

  border-radius: 4px;

  background: #f4f6fd;

  color: #3c5dcc;

  font-size: 12px;

  font-weight: 500;

  cursor: pointer;

  flex-shrink: 0;

  transition: background 0.15s ease;

  &:hover {
    background: #e9edfa;
  }
`;

export const ImagePreviewRow = styled.div`
  display: flex;

  flex-wrap: wrap;

  gap: 10px;
`;

export const ImageBox = styled.div`
  position: relative;

  width: 64px;

  height: 64px;

  flex-shrink: 0;

  border: 1px solid #e2e2e2;

  border-radius: 4px;

  overflow: hidden;

  background: #f7f7f7;

  img {
    width: 100%;

    height: 100%;

    object-fit: cover;

    display: block;
  }
`;

/* =====================================================
   FORM ACTIONS
===================================================== */

export const ButtonGroup = styled.div`
  display: flex;

  justify-content: flex-end;

  padding: 20px 24px;

  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 16px 12px;

    justify-content: stretch;
  }
`;

export const SubmitButton = styled.button`
  height: 40px;

  padding: 0 28px;

  border: none;

  border-radius: 4px;

  background: #3c5dcc;

  color: #ffffff;

  font-size: 13px;

  font-weight: 500;

  cursor: pointer;

  transition: background 0.15s ease;

  &:hover {
    background: #33509c;
  }

  &:disabled {
    background: #9fadd6;

    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

/* =====================================================
   INPUT
===================================================== */

export const Input = styled.input`
  width: 100%;

  height: 35px;

  padding:10px;

  border: 1px solid #e2e2e2;

  border-radius: 4px;

  outline: none;

  background: #ffffff;

  color: #333333;

  font-size: 12px;

  font-family: inherit;

  box-sizing: border-box;

  min-width: 0;

  &::placeholder {
    color: #969696;
  }

  &:focus {
    border-color: #3c5dcc;
  }

  @media (max-width: 600px) {
    height: 38px;

    font-size: 12px;
  }

  @media (max-width: 420px) {
    height: 36px;

    font-size: 11px;

    padding: 0 9px;
  }
`;

/* =====================================================
   SELECT WRAPPER
===================================================== */

export const SelectWrapper = styled.div`
  position: relative;

  width: 100%;

  min-width: 0;
`;

/* =====================================================
   SELECT
===================================================== */

export const Select = styled.select`
  width: 100%;

  height: 36px;

  padding: 0 32px 0 10px;

  border: 1px solid #e2e2e2;

  border-radius: 4px;

  outline: none;

  appearance: none;

  background: #ffffff;

  color: #777777;

  font-size: 12px;

  font-family: inherit;

  box-sizing: border-box;

  cursor: pointer;

  min-width: 0;

  &:focus {
    border-color: #3c5dcc;
  }

  @media (max-width: 600px) {
    height: 38px;
  }

  @media (max-width: 420px) {
    height: 36px;

    font-size: 11px;
  }
`;

/* =====================================================
   SELECT ARROW
===================================================== */

export const SelectArrow = styled.span`
  position: absolute;

  top: 50%;

  right: 11px;

  transform: translateY(-50%);

  color: #222222;

  font-size: 16px;

  pointer-events: none;

  @media (max-width: 420px) {
    right: 9px;

    font-size: 14px;
  }
`;

/* =====================================================
   PHONE WRAPPER
===================================================== */

export const PhoneWrapper = styled.div`
  width: 100%;

  display: flex;

  gap: 7px;

  min-width: 0;

  @media (max-width: 420px) {
    gap: 6px;
  }
`;

/* =====================================================
   COUNTRY SELECT
===================================================== */

export const CountrySelect = styled.select`
  width: 84px;

  height: 36px;

  flex: 0 0 84px;

  padding: 0 5px;

  border: 1px solid #e2e2e2;

  border-radius: 4px;

  outline: none;

  background: #ffffff;

  color: #777777;

  font-size: 11px;

  box-sizing: border-box;

  cursor: pointer;

  &:focus {
    border-color: #3c5dcc;
  }

  @media (max-width: 600px) {
    width: 75px;

    flex-basis: 75px;

    height: 38px;
  }

  @media (max-width: 420px) {
    width: 68px;

    flex-basis: 68px;

    height: 36px;

    font-size: 10px;
  }
`;

/* =====================================================
   PHONE INPUT
===================================================== */

export const PhoneInput = styled.input`
  width: 100%;

  min-width: 0;

  height: 36px;

  padding: 0 10px;

  border: 1px solid #e2e2e2;

  border-radius: 4px;

  outline: none;

  background: #ffffff;

  color: #333333;

  font-size: 12px;

  box-sizing: border-box;

  &::placeholder {
    color: #969696;
  }

  &:focus {
    border-color: #3c5dcc;
  }

  @media (max-width: 600px) {
    height: 38px;
  }

  @media (max-width: 420px) {
    height: 36px;

    font-size: 11px;

    padding: 0 8px;
  }
`;

/* =====================================================
   FILE UPLOAD
===================================================== */

export const UploadWrapper = styled.label`
  position: relative;

  width: 100%;

  height: 36px;

  display: flex;

  align-items: center;

  padding: 0 12px;

  border: 1px solid #e2e2e2;

  border-radius: 4px;

  background: #ffffff;

  box-sizing: border-box;

  cursor: pointer;

  min-width: 0;

  &:hover {
    border-color: #3c5dcc;
  }

  @media (max-width: 600px) {
    height: 38px;
  }

  @media (max-width: 420px) {
    height: 36px;

    padding: 0 9px;
  }
`;

/* =====================================================
   UPLOAD TEXT
===================================================== */

export const UploadText = styled.span`
  color: #969696;

  font-size: 12px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  min-width: 0;

  @media (max-width: 420px) {
    font-size: 11px;
  }
`;

/* =====================================================
   UPLOAD ICON
===================================================== */

export const UploadIcon = styled.span`
  margin-left: auto;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #222222;

  flex-shrink: 0;

  margin-left: 8px;
`;

/* =====================================================
   UPLOAD INPUT
===================================================== */

export const UploadInput = styled.input`
  display: none;
`;
/* =====================================================
   PROFILE IMAGE HOVER OVERLAY
===================================================== */

export const ProfileHoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 10px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.15s ease;
  cursor: pointer;

  ${ProfileImageWrapper}:hover & {
    opacity: 1;
  }

  @media (max-width: 600px) {
    font-size: 9px;
  }

  @media (max-width: 420px) {
    span {
      display: none;
    }
  }
`;

/* =====================================================
   PROFILE PLACEHOLDER (no image yet)
===================================================== */

export const ProfilePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a3a3a3;
  background: #eeeeee;
`;

/* =====================================================
   CAMERA BADGE
===================================================== */

export const CameraBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #3c5dcc;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  z-index: 15;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #33509c;
    transform: scale(1.05);
  }

  @media (max-width: 1200px) {
    width: 26px;
    height: 26px;
  }

  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 600px) {
    width: 20px;
    height: 20px;
  }
`;

/* =====================================================
   REMOVE BADGE
===================================================== */

export const RemoveBadge = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ef3434;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  padding: 0;
  z-index: 15;
  transition: background 0.15s ease;

  &:hover {
    background: #d62828;
  }

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 600px) {
    width: 16px;
    height: 16px;
  }
`;

/* =====================================================
   HIDDEN FILE INPUT (profile)
===================================================== */

export const HiddenProfileInput = styled.input`
  display: none;
`;

export const AvatarShell = styled.div`
  position: relative;
  flex: 0 0 106px;
  width: 106px;
  height: 106px;
  margin-left: 25px;
  z-index: 10;

  @media (max-width: 1200px) {
    flex-basis: 90px;
    width: 90px;
    height: 90px;
    margin-left: 20px;
    margin-top: 25px;
  }

  @media (max-width: 768px) {
    flex-basis: 75px;
    width: 75px;
    height: 75px;
    margin-left: 15px;
    margin-top: 18px;
  }

  @media (max-width: 600px) {
    flex-basis: 60px;
    width: 60px;
    height: 60px;
    margin-left: 12px;
    margin-top: 12px;
  }

  @media (max-width: 420px) {
    flex-basis: 52px;
    width: 52px;
    height: 52px;
    margin-left: 10px;
    margin-top: 10px;
  }
`;