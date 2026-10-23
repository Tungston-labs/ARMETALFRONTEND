import styled from "styled-components";

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1000;

    display: flex;
    align-items: flex-start;
    justify-content: center;

    padding: 8px 6px;

    background: rgba(0, 0, 0, 0.5);

    overflow-y: auto;
`;

export const ModalContainer = styled.div`
    width: 100%;
    max-width: 1205px;
    min-height: 450px;

    margin-top: 0;

    padding: 74px 22px 76px;

    background: #ffffff;
    border-radius: 2px;

    box-sizing: border-box;

    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);

    @media (max-width: 700px) {
        padding: 35px 20px;
    }

    @media (max-width: 480px) {
        padding: 30px 15px;
    }
`;

export const ModalHeader = styled.div`
    margin-bottom: 46px;
`;

export const Title = styled.h2`
    margin: 0 0 2px;

    color: #2f4eb5;

    font-size: 20px;
    font-weight: 600;
    line-height: 1.3;
`;

export const Subtitle = styled.p`
    margin: 0;

    color: #777777;

    font-size: 12px;
    font-weight: 400;
    line-height: 1.5;
`;

export const FormGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 22px;
    row-gap: 17px;

    width: 100%;

    @media (max-width: 1000px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 700px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;

    min-width: 0;
`;

export const Label = styled.label`
    margin-bottom: 8px;

    color: #111111;

    font-size: 13px;
    font-weight: 400;
    line-height: 1.2;

    span {
        color: #111111;
    }
`;

const fieldStyles = `
    width: 100%;
    height: 35px;

    padding: 0 10px;

    box-sizing: border-box;

    border: 1px solid #e3e3e3;
    border-radius: 4px;

    background: #ffffff;

    color: #555555;

    font-family: inherit;
    font-size: 11px;
    font-weight: 400;

    outline: none;

    transition: border-color 0.2s ease;

    &::placeholder {
        color: #999999;
    }

    &:focus {
        border-color: #3154bd;
    }
`;

export const Input = styled.input`
    ${fieldStyles}

    &[type="date"] {
        color: #999999;
        cursor: pointer;
    }

    &[type="date"]::-webkit-calendar-picker-indicator {
        width: 12px;
        height: 12px;

        cursor: pointer;
    }
`;

export const Select = styled.select`
    ${fieldStyles}

    appearance: auto;

    color: #777777;

    cursor: pointer;
`;

export const Textarea = styled.textarea`
    ${fieldStyles}

    height: 70px;

    padding-top: 9px;

    resize: none;
`;

export const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;

    margin-top: 40px;

    @media (max-width: 480px) {
        flex-wrap: wrap;
    }
`;

export const CancelButton = styled.button`
    height: 35px;
    min-width: 75px;

    padding: 0 15px;

    border: 1px solid #222222;
    border-radius: 4px;

    background: #ffffff;
    color: #111111;

    font-size: 12px;
    font-weight: 500;

    cursor: pointer;

    transition: all 0.2s ease;

    &:hover {
        background: #f5f5f5;
    }
`;

export const SaveButton = styled.button`
    height: 35px;
    min-width: 149px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    padding: 0 16px;

    border: none;
    border-radius: 4px;

    background: #3453b5;
    color: #ffffff;

    font-size: 12px;
    font-weight: 500;

    cursor: pointer;

    transition: background 0.2s ease;

    span {
        font-size: 11px;
    }

    &:hover {
        background: #29469f;
    }
`;