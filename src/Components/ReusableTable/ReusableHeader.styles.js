import styled from "styled-components";

const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
};

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 25px;

  @media (max-width: ${breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const LeftSection = styled.div`
  flex: 1;
  min-width: 250px;
`;

export const RightSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.tablet}) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PageTitle = styled.h2`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 24px;
  font-weight: 500;
  color: #3250bc;
  line-height: 1.3;
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 3px;
  font-family: "Poppins", sans-serif;
`;

export const BreadcrumbItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? "400" : "400")};
  color: ${({ $active }) => ($active ? "#888" : "#888")};

  line-height: 20px;
  white-space: nowrap;
`;

export const HomeIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  color: #888;
  font-size: 16px;
`;

export const Separator = styled.span`
  display: flex;
  align-items: center;

  color: #333;
  font-size: 22px;
  font-weight: 400;
  line-height: 16px;
`;

// export const ActionButton = styled.button`
//   height: 40px;
//   padding: 0 20px;
//   border: none;
//   border-radius: 5px;
//   background: #3352ba;
//   color: white;
//   font-size: 14px;
//   font-weight: 500;
//   cursor: pointer;
//   white-space: nowrap;
//   transition: 0.3s;

//   &:hover {
//     background: #1638b8;
//   }

//   @media (max-width: 480px) {
//     width: 100%;
//   }
// `;

export const BackButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #3352ba;
  font-size: 20px;
  transition: 0.3s;

  &:hover {
    background: #3352ba;
    color: #fff;
  }
`;
export const ActionButton = styled.button`
  height: 40px;
  padding: 0 20px;
  border: none;
  border-radius: 5px;
  background: #3352ba;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: 0.3s;

  &:hover {
    background: #1638b8;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const HeaderButton = styled.button`
  height: 40px;

  padding: 0 14px;

  border: none;

  border-radius: 5px;

  color: white;

  font-size: 13px;

  font-weight: 500;

  cursor: pointer;

  white-space: nowrap;

  transition: 0.3s;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  background: ${({ $variant }) => {
    switch ($variant) {
      case "danger":
        return "#DB0F12";

      case "success":
        return "#15B03E";

      case "blue":
        return "#3352BA";

      default:
        return "#3352ba";
    }
  }};

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;