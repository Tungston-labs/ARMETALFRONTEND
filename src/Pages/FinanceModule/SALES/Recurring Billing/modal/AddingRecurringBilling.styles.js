import styled from "styled-components";

/* =========================================
   OVERLAY
========================================= */

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  z-index: 9999;
`;

/* =========================================
   MODAL
========================================= */

export const Modal = styled.div`
    width: min(1450px, 100%);
    max-height: calc(100vh - 50px);

    display: flex;
    flex-direction: column;

    overflow: hidden;

    background: #ffffff;

    border-radius: 8px;

    box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.18),
        0 5px 15px rgba(0, 0, 0, 0.08);

    box-sizing: border-box;

    @media (max-width: 768px) {
        max-height: calc(100vh - 20px);
    }
`;

/* =========================================
   HEADER
========================================= */

export const ModalHeader = styled.div`
    min-height: 76px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 18px 25px;

    border-bottom: 1px solid #e8e8e8;

    box-sizing: border-box;

    background: #ffffff;
`;

export const ModalTitleWrapper = styled.div`
    min-width: 0;
`;

export const ModalTitle = styled.h2`
    margin: 0;

    color: #202020;

    font-size: 21px;
    font-weight: 600;
    line-height: 1.3;
`;

export const ModalSubtitle = styled.p`
    margin: 5px 0 0;

    color:rgb(0, 0, 0);

    font-size: 13px;
    line-height: 1.4;
`;

export const CloseButton = styled.button`
    width: 36px;
    height: 36px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border: none;
    border-radius: 6px;

    background: transparent;

    color: #444444;

    font-size: 21px;

    cursor: pointer;

    transition: all 0.2s ease;

    &:hover {
        background: #f3f3f3;
        color: #111111;
    }
`;

/* =========================================
   BODY
========================================= */

export const ModalBody = styled.div`
    flex: 1;

    overflow-y: auto;
    overflow-x: hidden;

    background: #ffffff;

    scrollbar-width: thin;
    scrollbar-color: #cfcfcf transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background: #cfcfcf;
        border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #a9a9a9;
    }

    form {
        width: 100%;
    }
`;

/* =========================================
   SECTION
========================================= */

export const Section = styled.section`
    padding: 24px 25px 28px;

    border-bottom: 1px solid #eeeeee;

    &:last-child {
        border-bottom: none;
    }

    @media (max-width: 768px) {
        padding: 20px 16px 24px;
    }
`;

export const SectionTitle = styled.h3`
    margin: 0 0 5px;

    color: #222222;

    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
`;

export const SectionDescription = styled.p`
    margin: 0 0 22px;

    color: #333333;

    font-size: 13px;
    font-weight: 400;
    line-height: 1.5;
`;

/* =========================================
   FORM GRID
========================================= */

export const FormGrid = styled.div`
    display: grid;

    grid-template-columns: repeat(5, minmax(0, 1fr));

    gap: 17px 24px;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 800px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));

        gap: 16px;
    }

    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

/* =========================================
   FORM GROUP
========================================= */

export const FormGroup = styled.div`
    width: 100%;
    min-width: 0;
`;

export const Label = styled.label`
    display: block;

    margin-bottom: 8px;

    color: #202020;

    font-size: 14px;
    font-weight: 500;
    line-height: 1.3;
`;

/* =========================================
   INPUT
========================================= */

export const Input = styled.input`
    width: 100%;
    height: 40px;

    padding: 0 12px;

    box-sizing: border-box;

    border: 1px solid #dedede;
    border-radius: 5px;

    outline: none;

    background: #ffffff;

    color: #333333;

    font-family: inherit;
    font-size: 13px;

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    &::placeholder {
        color: #8a8a8a;
    }

    &:focus {
        border-color: #4663b3;

        box-shadow:
            0 0 0 2px rgba(70, 99, 179, 0.08);
    }

    &:read-only {
        background: #fafafa;
        color: #777777;
    }

    &[type="date"] {
        color: #777777;
    }

    &[type="number"] {
        appearance: textfield;
    }

    &[type="number"]::-webkit-inner-spin-button,
    &[type="number"]::-webkit-outer-spin-button {
        margin: 0;
        appearance: none;
    }
`;

/* =========================================
   SELECT
========================================= */

export const SelectWrapper = styled.div`
    position: relative;

    width: 100%;
`;

export const StyledSelect = styled.select`
    width: 100%;
    height: 40px;

    padding: 0 38px 0 12px;

    box-sizing: border-box;

    appearance: none;
    -webkit-appearance: none;

    border: 1px solid #dedede;
    border-radius: 5px;

    outline: none;

    background: #ffffff;

    color: #777777;

    font-family: inherit;
    font-size: 13px;

    cursor: pointer;

    &:focus {
        border-color: #4663b3;

        box-shadow:
            0 0 0 2px rgba(70, 99, 179, 0.08);
    }

    option {
        color: #333333;
    }
`;

export const SelectIcon = styled.span`
    position: absolute;

    top: 50%;
    right: 12px;

    display: flex;
    align-items: center;
    justify-content: center;

    transform: translateY(-50%);

    color: #222222;

    font-size: 16px;

    pointer-events: none;
`;

/* =========================================
   UPLOAD
========================================= */

export const UploadBox = styled.label`
    position: relative;

    width: 100%;
    height: 40px;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    padding: 0 13px;

    box-sizing: border-box;

    border: 1px solid #dedede;
    border-radius: 5px;

    background: #ffffff;

    color: #222222;

    cursor: pointer;

    transition: all 0.2s ease;

    &:hover {
        border-color: #bdbdbd;
        background: #fafafa;
    }

    svg {
        font-size: 16px;
    }

    input {
        position: absolute;

        inset: 0;

        width: 100%;
        height: 100%;

        opacity: 0;

        cursor: pointer;
    }
`;

/* =========================================
   PRICING ROW
========================================= */

export const PricingRow = styled.div`
    display: grid;

    grid-template-columns: repeat(5, minmax(0, 1fr));

    gap: 17px 24px;

    margin-bottom: 17px;

    &:last-child {
        margin-bottom: 0;
    }

    @media (max-width: 1200px) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    @media (max-width: 800px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    @media (max-width: 520px) {
        grid-template-columns: 1fr;
    }
`;

/* =========================================
   TOGGLE AREA
========================================= */

export const ToggleContainer = styled.div`
    display: grid;

    grid-template-columns: repeat(3, minmax(0, 1fr));

    gap: 35px;

    margin-top: 32px;

    padding: 0 8px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;

        gap: 20px;
    }

    @media (max-width: 768px) {
        padding: 0;
    }
`;

export const ToggleItem = styled.div`
    display: flex;
    align-items: flex-start;

    gap: 9px;
`;

export const ToggleSwitch = styled.button`
    position: relative;

    width: 39px;
    height: 22px;

    flex-shrink: 0;

    margin-top: 1px;

    padding: 0;

    border: none;
    border-radius: 20px;

    background: ${({ active }) =>
        active ? "#3f5fb9" : "#d2d2d2"};

    cursor: pointer;

    transition: background 0.2s ease;

    span {
        position: absolute;

        top: 3px;

        left: ${({ active }) =>
            active ? "20px" : "3px"};

        width: 16px;
        height: 16px;

        border-radius: 50%;

        background: #ffffff;

        box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.2);

        transition: left 0.2s ease;
    }
`;

export const ToggleContent = styled.div`
    min-width: 0;
`;

export const ToggleLabel = styled.div`
    color: #202020;

    font-size: 14px;
    font-weight: 600;

    line-height: 1.3;
`;

export const ToggleDescription = styled.div`
    margin-top: 2px;

    color: #777777;

    font-size: 12px;

    line-height: 1.4;
`;

/* =========================================
   FOOTER
========================================= */

export const ModalFooter = styled.div`
    min-height: 68px;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    gap: 10px;

    padding: 12px 25px;

    box-sizing: border-box;

    border-top: 1px solid #e8e8e8;

    background: #ffffff;

    @media (max-width: 520px) {
        padding: 12px 16px;
    }
`;

export const CancelButton = styled.button`
height: 40px;

  min-width: 86px;

  padding: 0 18px;

  background: #ffffff;

  border: 1px solid #111111;

  border-radius: 4px;

  font-family: "Poppins", sans-serif;

  font-size: 13px;
  font-weight: 500;

  color: #111111;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
`;

export const SaveButton = styled.button`
    height: 40px;

  min-width: 207px;

  padding: 0 25px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  background: #3857b9;

  border: none;

  border-radius: 4px;

  font-family: "Poppins", sans-serif;

  font-size: 13px;
  font-weight: 500;

  letter-spacing: 0.4px;

  color: #ffffff;

  cursor: pointer;

  transition: 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    background: #2e49a5;
  }
`;