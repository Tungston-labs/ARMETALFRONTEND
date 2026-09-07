import styled from "styled-components";

export const StepsWrapper = styled.div`
  .ant-steps-item-icon {
    position: relative; /* allow ::before to be placed behind */
    z-index: 1;
    width: 30px;
    height: 30px;

    .ant-steps-icon {
      font-size: 16px; /* icon number inside circle */
    }
  }

  .ant-steps-item-title {
    font-size: 14px !important;

    /* Medium screens */
    @media (min-width: 1020px) {
      font-size: 16px !important;
    }
    @media (min-width: 1440px) {
      font-size: 18px !important;
    }
    @media (min-width: 1920px) {
      font-size: 20px !important;
    }
    @media (min-width: 2560px) {
      font-size: 24px !important;
    }
    @media (min-width: 3840px) {
      font-size: 28px !important;
    }
    @media (min-width: 7680px) {
      font-size: 36px !important;
    }
  }

  .ant-steps-item-icon::before {
    content: "";
    position: absolute;
    top: -6px;
    left: -6px;
    width: calc(100% + 12px);
    height: calc(100% + 12px);
    border: 2px solid #6c7b8b; /* ring color */
    border-radius: 50%;
    z-index: -1;

    @media (min-width: 1020px) {
      top: -7px;
      left: -7px;
      width: calc(100% + 14px);
      height: calc(100% + 14px);
    }
    @media (min-width: 1440px) {
      top: -8px;
      left: -8px;
      width: calc(100% + 16px);
      height: calc(100% + 16px);
    }
    @media (min-width: 1920px) {
      top: -10px;
      left: -10px;
      width: calc(100% + 20px);
      height: calc(100% + 20px);
    }
    @media (min-width: 2560px) {
      top: -12px;
      left: -12px;
      width: calc(100% + 24px);
      height: calc(100% + 24px);
    }
    @media (min-width: 3840px) {
      top: -14px;
      left: -14px;
      width: calc(100% + 28px);
      height: calc(100% + 28px);
    }
    @media (min-width: 7680px) {
      top: -20px;
      left: -20px;
      width: calc(100% + 40px);
      height: calc(100% + 40px);
    }
  }

  .ant-steps-item-content {
    /* optional: spacing adjustments for vertical steps */
    @media (max-width: 480px) {
      margin-top: 8px;
    }
  }
`;
