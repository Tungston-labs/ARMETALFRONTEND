import styled, { keyframes } from "styled-components";

const slideIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const NotificationCard = styled.div`
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 1100;
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 300px;
    max-width: min(420px, calc(100vw - 32px));
    padding: 12px 14px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
    animation: ${slideIn} 0.2s ease-out;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

export const IconBox = styled.div`
    flex: none;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    color: #ffffff;
    background: ${({ $type }) => ($type === "error" ? "#db0f12" : "#2fb344")};
`;

export const Content = styled.div`
    flex: 1;
    min-width: 0;
`;

export const Title = styled.div`
    font-size: 13px;
    font-weight: 600;
    color: #111827;
`;

export const Message = styled.div`
    margin-top: 1px;
    font-size: 12.5px;
    line-height: 1.4;
    color: #374151;
`;

export const CloseButton = styled.button`
    flex: none;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 50%;
    background: #eceef2;
    color: #4b5563;
    cursor: pointer;

    &:hover {
        background: #dfe2e8;
    }
`;