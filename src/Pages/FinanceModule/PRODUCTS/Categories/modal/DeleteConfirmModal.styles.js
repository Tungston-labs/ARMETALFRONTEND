import styled from "styled-components";

export const Overlay = styled.div`
    position: fixed;
    inset: 0;

    background: rgba(0, 0, 0, 0.45);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1000;
`;

export const ModalBox = styled.div`
    width: 100%;
    max-width: 380px;

    background: #fff;
    border-radius: 10px;
    padding: 24px;

    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

export const Title = styled.h3`
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
`;

export const Message = styled.p`
    margin: 0 0 20px;
    font-size: 14px;
    color: #4b5563;
    line-height: 1.5;
`;

export const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

export const CancelButton = styled.button`
    padding: 8px 16px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: #fff;
    color: #374151;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background: #f9fafb;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const ConfirmButton = styled.button`
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: #dc2626;
    color: #fff;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 70px;

    &:hover {
        background: #b91c1c;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;