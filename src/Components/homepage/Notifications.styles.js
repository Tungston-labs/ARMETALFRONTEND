import styled from "styled-components";

export const NotificationWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  max-width: 280px;
  padding: 10px;
  box-sizing: border-box;

  /* 👉 Enable scroll */
  max-height: 250px;     /* Adjust if you want more/less */
  overflow-y: auto;

  /* 👉 Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cfcfcf;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 8px;
    max-height: 220px;   /* smaller screens */
  }

  @media (min-width: 1920px) {
    max-width: 350px;
    padding: 16px;
    max-height: 300px;
  }

  @media (min-width: 2560px) {
    max-height: 350px;
  }

  @media (min-width: 3840px) {
    max-height: 450px;
  }
`;


export const NotificationTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #111111;
  margin-bottom: 10px;
font-family: "Satoshi", sans-serif;
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 8px;
  }

  @media (min-width: 1920px) {
    font-size: 20px;
    margin-bottom: 12px;
  }
     @media (min-width: 2560px) {
    font-size: 2rem;
    margin-bottom: 12px;
  }
     @media (min-width: 3840px) {
     font-size: 2rem;
    margin-bottom: 15px;
  }
`;

export const NotificationItem = styled.div`
font-family: "Satoshi", sans-serif;
  background: #ffffff;
  border-left: 4px solid
    ${(props) =>
      props.type === "error"
        ? "#f6413b"
        : props.type === "success"
        ? "#10b981"
        : "#facc15"};
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  font-size: 14px;
  color: #0d0d0e;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 13px;
  }

  @media (min-width: 1920px) {
    padding: 14px 16px;
    font-size: 16px;
  }
    @media (min-width: 2560px) {
    padding: 14px 16px;
    font-size: 1.3rem;
     margin-bottom: 20px;
  }
    @media (min-width: 3840px) {
    padding: 14px 16px;
    font-size: 22px;
      margin-bottom: 15px;
  }
`;

export const NotificationText = styled.div`
  flex: 1;
  margin-right: 8px;
font-family: "Satoshi", sans-serif;

  @media (max-width: 768px) {
    margin-right: 6px;
  }

  @media (min-width: 1920px) {
    margin-right: 12px;
  }
`;

export const NotificationTime = styled.div`
  font-size: 12px;
  color: #000000;
font-family: "Satoshi", sans-serif;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (min-width: 1920px) {
    font-size: 14px;
  }
      @media (min-width: 2560px) {
    font-size: 18px;
  }
      @media (min-width: 3840px) {
    font-size: 18px;
  }
`;

export const NoNotification = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 14px;
  padding: 15px 0;
font-family: "Satoshi", sans-serif;

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 12px 0;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
    padding: 20px 0;
  }
    @media (min-width: 2560px) {
    font-size: 16px;
    padding: 20px 0;
  }
    @media (min-width: 3840px) {
    font-size: 22px;
    padding: 20px 0;
  }
`;
