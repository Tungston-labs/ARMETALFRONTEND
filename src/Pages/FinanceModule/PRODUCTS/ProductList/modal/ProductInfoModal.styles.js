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
    width: 420px;
    max-width: 90vw;
    max-height: 85vh;
    overflow-y: auto;

    background: #fff;
    border-radius: 10px;
    padding: 20px;
`;

export const ModalHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 16px;
`;

export const ModalTitle = styled.h3`
    font-size: 16px;
    font-weight: 600;
    color: #2d2d2d;
    margin: 0;
`;

export const CloseButton = styled.button`
    width: 30px;
    height: 30px;

    border: none;
    background: #f3f4f6;
    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    &:hover {
        background: #e5e7eb;
    }
`;

export const ModalBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const InfoRow = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 12px;

    padding-bottom: 8px;
    border-bottom: 1px solid #ececec;
`;

export const InfoLabel = styled.span`
    font-size: 13px;
    color: #7b7b7b;
    font-weight: 500;
`;

export const InfoValue = styled.span`
    font-size: 13px;
    color: #2d2d2d;
    font-weight: 600;
    text-align: right;
`;