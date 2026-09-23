import styled from "styled-components";

const breakpoints = {
  mobileSmall: "360px",
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
  largeDesktop: "1920px",
};

export const HeaderContainer = styled.div`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 20px;
  margin-bottom: 25px;

  /* Prevent children from causing horizontal overflow */
  min-width: 0;

  @media (max-width: ${breakpoints.laptop}) {
    gap: 16px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    margin-bottom: 20px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    gap: 12px;
    margin-bottom: 18px;
  }
`;

export const LeftSection = styled.div`
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;

  display: flex;
  flex-direction: column;
`;

export const RightSection = styled.div`
  flex: 0 1 auto;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  flex-wrap: wrap;
  min-width: 0;
  max-width: 100%;

  /* Prevent controls from overflowing */
  & > * {
    max-width: 100%;
    box-sizing: border-box;
  }

  @media (max-width: ${breakpoints.laptop}) {
    gap: 8px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;

    justify-content: flex-start;
    align-items: stretch;

    flex-wrap: wrap;
  }

  @media (max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`;

export const TitleRow = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: ${breakpoints.mobile}) {
    gap: 8px;
  }
`;

export const PageTitle = styled.h2`
  margin: 0;

  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.3;

  color: #3250bc;

  min-width: 0;

  /* Long titles won't break the layout */
  overflow-wrap: anywhere;

  @media (max-width: ${breakpoints.laptop}) {
    font-size: 22px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 21px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 19px;
    line-height: 1.25;
  }

  @media (max-width: ${breakpoints.mobileSmall}) {
    font-size: 18px;
  }
`;

export const Breadcrumb = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 3px;

  margin-top: 4px;

  font-family: "Poppins", sans-serif;

  overflow: hidden;

  @media (max-width: ${breakpoints.mobile}) {
    margin-top: 3px;
    gap: 2px;
  }
`;

export const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;

  gap: 5px;

  min-width: 0;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  color: #888;

  /* Long breadcrumb text */
  max-width: 100%;

  overflow-wrap: anywhere;

  @media (max-width: ${breakpoints.tablet}) {
    font-size: 13px;
    line-height: 19px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    line-height: 18px;
    gap: 4px;
  }
`;

export const HomeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #888;
  font-size: 16px;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 14px;
  }
`;

export const Separator = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #777;

  font-size: 20px;
  font-weight: 400;
  line-height: 16px;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 17px;
  }
`;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;

  padding: 0;
  margin: 0;

  flex: 0 0 36px;

  border: none;
  border-radius: 50%;

  background: #f5f5f5;
  color: #3352ba;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 20px;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #3352ba;
    color: #fff;
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 32px;
    height: 32px;

    flex: 0 0 32px;

    font-size: 18px;
  }
`;

export const ActionButton = styled.button`
  min-height: 40px;

  padding: 0 20px;

  border: none;
  border-radius: 5px;

  background: #3352ba;
  color: #fff;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 500;

  cursor: pointer;

  white-space: nowrap;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;

  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: #1638b8;
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid #3352ba;
    outline-offset: 2px;
  }

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 38px;
    padding: 0 16px;
    font-size: 13px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
    min-height: 40px;
  }
`;

export const HeaderButton = styled.button`
  min-height: 40px;

  padding: 0 14px;

  border-radius: 5px;

  color: ${({ $variant }) =>
    $variant === "excel"
      ? "#333333"
      : "#FFFFFF"};

  background: ${({ $variant }) => {
    switch ($variant) {
      case "danger":
        return "#DB0F12";

      case "success":
        return "#15B03E";

      case "blue":
        return "#3352BA";

      case "excel":
        return "#FFFFFF";

      case "orange":
        return "#F78926";

      default:
        return "#3352BA";
    }
  }};

  border: ${({ $variant }) =>
    $variant === "excel"
      ? "1px solid #D1D5DB"
      : "none"};

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;

  cursor: pointer;
  white-space: nowrap;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  box-sizing: border-box;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease,
    transform 0.2s ease;

  &:hover {
    opacity: 0.9;

    ${({ $variant }) =>
      $variant === "excel" &&
      `
        background: #F9FAFB;
        border-color: #BFC3C9;
      `}
  }

  &:active {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid #3352ba;
    outline-offset: 2px;
  }

  svg {
    width: 16px;
    height: 16px;

    flex-shrink: 0;
  }

  @media (max-width: ${breakpoints.tablet}) {
    min-height: 38px;
    padding: 0 12px;
    font-size: 12px;
  }

  @media (max-width: ${breakpoints.mobile}) {
    width: 100%;
  }
`;

export const Subtitle = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 6px;

  margin: 3px 0 0;

  color: #667085;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  line-height: 20px;

  min-width: 0;

  overflow-wrap: anywhere;

  @media (max-width: ${breakpoints.mobile}) {
    font-size: 12px;
    line-height: 18px;
    gap: 5px;
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-height: 22px;

  padding: 2px 10px;

  border-radius: 5px;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  white-space: nowrap;

  box-sizing: border-box;

  ${({ $variant }) =>
    $variant === "success"
      ? `
        background: #ecfdf3;
        color: #03AC17;
        border: 1px solid #a6f4c5;
      `
      : `
        background: #f2f4f7;
        color: #667085;
        border: 1px solid #d0d5dd;
      `}

  @media (max-width: ${breakpoints.mobile}) {
    min-height: 20px;
    padding: 2px 8px;
    font-size: 11px;
  }
`;