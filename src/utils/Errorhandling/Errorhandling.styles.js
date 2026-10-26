import styled, { keyframes } from "styled-components";

/* ───────── Offline banner ───────── */
const slideDown = keyframes`
  from { transform: translateY(-100%); }
  to   { transform: translateY(0); }
`;

export const Banner = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 16px;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  color: #fff;
  text-align: center;
  background: ${(p) => (p.$online ? "#16a34a" : "#dc2626")};
  animation: ${slideDown} 0.25s ease;
`;

export const RetryButton = styled.button`
  padding: 4px 12px;
  border: 1px solid #fff;
  border-radius: 4px;
  background: transparent;
  color: #fff;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

/* ───────── Full-page error screens (404 / crash) ───────── */
export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 24px;
  text-align: center;
  font-family: "Poppins", sans-serif;
  color: #172554;
`;

export const Code = styled.div`
  font-size: 96px;
  font-weight: 600;
  line-height: 1;
  color: #304eb0;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 500;
`;

export const Text = styled.p`
  margin: 0;
  max-width: 420px;
  font-size: 15px;
  color: #64748b;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
`;

export const PageButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #304eb0;
  background: ${(p) => (p.$primary ? "#304eb0" : "transparent")};
  color: ${(p) => (p.$primary ? "#fff" : "#304eb0")};

  &:hover {
    opacity: 0.9;
  }
`;