import styled from "styled-components";

export const AttendanceTypeDescription = styled.div`
    font-size: 12px;

    color: #6b7280;

    margin-top: 2px;
`;



export const NoteCounter = styled.div`
    text-align: right;

    margin-top: 5px;

    font-size: 11px;

    color: #9ca3af;
`;

/* =========================================================
   APPROVED BY
========================================================= */

export const ApprovedInput = styled.input`
    width: 100%;

    height: 46px;

    box-sizing: border-box;

    border: 1px solid #d1d5db;

    border-radius: 10px;

    padding: 0 14px;

    font-size: 14px;

    color: #374151;

    outline: none;

    background: #ffffff;

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        border-color: #1976d2;

        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.08);
    }
`;

/* =========================================================
   FOOTER
========================================================= */


export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;

    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(3px);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 9999;

    padding: 15px;
`;


/* =========================================================
   MODAL
========================================================= */

export const AttendanceModal = styled.div`
    width: 100%;
    max-width: 500px;

    background: #ffffff;

    border-radius: 14px;

    padding: 24px;

    box-sizing: border-box;

    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);

    @media (max-width: 600px) {
        padding: 20px;
        border-radius: 12px;
        max-height: 90vh;
        overflow-y: auto;
    }
`;


/* =========================================================
   HEADER
========================================================= */

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    margin-bottom: 24px;
`;

export const ModalHeaderContent = styled.div`
    flex: 1;
`;

export const ModalTitle = styled.h2`
    margin: 0;

    font-size: 20px;
    font-weight: 700;

    line-height: 1.3;

    color: #1f2937;
`;

export const ModalSubtitle = styled.p`
    margin: 3px 0 0;

    font-size: 13px;

    color: #6b7280;

    line-height: 1.4;
`;

export const CloseButton = styled.button`
    width: 32px;
    height: 32px;

    border: none;

    border-radius: 50%;

    background: #f3f4f6;

    color: #6b7280;

    font-size: 21px;

    line-height: 1;

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: all 0.2s ease;

    &:hover {
        background: #e5e7eb;
        color: #374151;
    }
`;


/* =========================================================
   FORM GROUP
========================================================= */

export const FormGroup = styled.div`
    margin-bottom: 18px;
`;

export const FormLabel = styled.label`
    display: block;

    margin-bottom: 10px;

    font-size: 13px;

    font-weight: 500;

    color: #374151;
`;

export const OptionalText = styled.span`
    color: #9ca3af;

    font-weight: 400;

    margin-left: 4px;
`;


/* =========================================================
   ATTENDANCE TYPE
========================================================= */

export const AttendanceTypeOptions = styled.div`
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 14px;
`;

export const AttendanceTypeOption = styled.label`
    position: relative;

    cursor: pointer;

    display: block;
`;

export const AttendanceRadio = styled.input`
    position: absolute;

    opacity: 0;

    pointer-events: none;
`;


/* =========================================================
   ATTENDANCE CARD
========================================================= */

export const AttendanceTypeCard = styled.div`
    height: 44px;

    box-sizing: border-box;

    border: 1px solid #d9dce1;

    background: #ffffff;

    border-radius: 8px;

    padding: 0 14px;

    display: flex;

    align-items: center;

    gap: 9px;

    transition: all 0.2s ease;

    ${({ selected, type }) =>
        selected &&
        type === "Paid" &&
        `
            border: 2px solid #16a34a;
            background: #f0fdf4;
        `}

    ${({ selected, type }) =>
        selected &&
        type === "Unpaid" &&
        `
            border: 2px solid #dc2626;
            background: #fff5f5;
        `}

    &:hover {
        border-color: #cbd5e1;
    }
`;


/* =========================================================
   RADIO CIRCLE
========================================================= */

export const RadioCircle = styled.div`
    width: 14px;
    height: 14px;

    min-width: 14px;

    border-radius: 50%;

    box-sizing: border-box;

    border: 1.5px solid #9ca3af;

    background: #ffffff;

    ${({ selected, type }) =>
        selected &&
        type === "Paid" &&
        `
            border: 4px solid #16a34a;
        `}

    ${({ selected, type }) =>
        selected &&
        type === "Unpaid" &&
        `
            border: 4px solid #dc2626;
        `}
`;


/* =========================================================
   TYPE CONTENT
========================================================= */

export const AttendanceTypeContent = styled.div`
    flex: 1;
`;

export const AttendanceTypeTitle = styled.div`
    font-size: 14px;

    font-weight: 500;

    color: #111827;
`;


/* =========================================================
   NOTE
========================================================= */

export const NoteWrapper = styled.div`
    position: relative;
`;

export const NoteInput = styled.textarea`
    width: 100%;

    min-height: 91px;

    box-sizing: border-box;

    border: 1px solid #d1d5db;

    border-radius: 7px;

    padding: 12px 13px;

    font-size: 13px;

    color: #374151;

    background: #ffffff;

    resize: vertical;

    outline: none;

    font-family: inherit;

    line-height: 1.5;

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        border-color: #1976d2;

        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.08);
    }
`;


/* =========================================================
   ATTENDANCE UPDATE BOX
========================================================= */

export const AttendanceUpdateBox = styled.div`
    width: 100%;

    box-sizing: border-box;

    padding: 12px 13px;

    margin-top: 2px;
    margin-bottom: 20px;

    border: 1px solid #dce1e8;

    border-radius: 7px;

    background: #f7f8fa;
`;

export const AttendanceUpdateTitle = styled.div`
    font-size: 13px;

    font-weight: 600;

    color: #374151;

    margin-bottom: 10px;
`;

export const UpdateItem = styled.div`
    display: block;

    margin-bottom: 2px;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const UpdateLabel = styled.span`
    font-size: 12px;

    color: #8a8f98;
`;

export const UpdateValue = styled.span`
    margin-left: 4px;

    font-size: 12px;

    color: #4b5563;

    font-weight: 500;
`;


/* =========================================================
   FOOTER
========================================================= */

export const ModalFooter = styled.div`
    display: flex;

    justify-content: flex-end;

    align-items: center;

    gap: 10px;

    padding-top: 0;

    @media (max-width: 600px) {
        flex-direction: column-reverse;
    }
`;


/* =========================================================
   BUTTONS
========================================================= */

export const ModalButton = styled.button`
    height: 40px;

    padding: 0 18px;

    border-radius: 7px;

    font-size: 13px;

    font-weight: 500;

    cursor: pointer;

    transition: all 0.2s ease;

    @media (max-width: 600px) {
        width: 100%;
    }
`;


/* =========================================================
   CANCEL BUTTON
========================================================= */

export const CancelButton = styled(ModalButton)`
    border: 1px solid #d1d5db;

    background: #ffffff;

    color: #4b5563;

    &:hover {
        background: #f9fafb;

        border-color: #9ca3af;
    }
`;


/* =========================================================
   SAVE BUTTON
========================================================= */

export const SaveButton = styled(ModalButton)`
    padding: 0 20px;

    border: none;

    background: #3155d9;

    color: #ffffff;

    font-weight: 600;

    box-shadow: 0 3px 8px rgba(49, 85, 217, 0.2);

    &:hover {
        background: #2848bd;
    }
`;