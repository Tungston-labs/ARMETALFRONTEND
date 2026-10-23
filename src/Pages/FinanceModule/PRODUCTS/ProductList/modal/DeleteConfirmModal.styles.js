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
    width: 380px;
    max-width: 90vw;

    background: #fff;
    border-radius: 10px;
    padding: 24px;
`;

export const Title = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #2d2d2d;
    margin: 0 0 10px;
`;

export const Message = styled.p`
    font-size: 13px;
    color: #7b7b7b;
    margin: 0 0 20px;
    line-height: 1.5;
`;

export const ButtonRow = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

export const CancelButton = styled.button`
    padding: 8px 16px;

    border-radius: 6px;
    border: 1px solid #ececec;
    background: #fff;
    color: #2d2d2d;

    font-size: 13px;
    font-weight: 500;

    cursor: pointer;

    &:hover {
        background: #f5f5f5;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const ConfirmButton = styled.button`
    min-width: 80px;
    padding: 8px 16px;

    border-radius: 6px;
    border: none;
    background: #ef4444;
    color: #fff;

    font-size: 13px;
    font-weight: 500;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    &:hover {
        background: #dc2626;
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;