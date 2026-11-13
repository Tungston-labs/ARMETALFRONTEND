import styled, { css } from "styled-components";

const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
  ultra: "1920px",
};

export const SidebarContainer = styled.aside`
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background: #2845B5;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  overflow: hidden;
  z-index: 999;
  font-family: "Poppins", sans-serif;

  @media (max-width: ${breakpoints.tablet}) {
    position: fixed;
    left: ${({ $open }) => ($open ? "0" : "-100%")};
    width: 270px;
    transition: 0.35s ease;
    box-shadow: 5px 0 30px rgba(0, 0, 0, 0.3);
  }
`;

export const LogoSection = styled.div`
  height: 80px;
  display: flex;
  align-items: center;
  justify-content:center;
  padding: 16px 20px;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

export const LogoImage = styled.img`
  max-width: 180px;
  max-height: 48px;
  object-fit: contain;
`;

export const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const BrandIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  svg, img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.1;

  .brand-name {
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.3px;
    font-family: "Poppins", sans-serif;
  }

  .brand-sub {
    font-size: 12px;
    font-weight: 500;
    color: #F58220;
    font-family: "Poppins", sans-serif;
  }
`;

export const Menu = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 14px 16px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.25);
    border-radius: 10px;
  }
`;

export const MenuItem = styled.div`
  margin-bottom: 8px;
`;

export const MenuButton = styled.button`
  width: 100%;
  height: 38px;
  border: none;
  border-radius: 8px;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#2845B5" : "#ffffff")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.4px;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#ffffff" : "rgba(255, 255, 255, 0.12)"};
  }
`;

export const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  min-width: 20px;
`;

export const Label = styled.span`
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.4px;
`;

export const Arrow = styled.div`
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;

  ${({ $open }) =>
    $open &&
    css`
      transform: rotate(180deg);
    `}
`;

export const SubMenu = styled.div`
  position: relative;
  margin-left: 20px;
  padding-left: 18px;
  font-family: "Poppins", sans-serif;
  max-height: ${({ $open }) => ($open ? "1200px" : "0")};
  overflow: hidden;
  transition: max-height 0.35s ease;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 8px;
    border-left: 2px dashed rgba(255, 255, 255, 0.4);
  }
`;

export const SubMenuItem = styled.button`
  width: 100%;
  position: relative;
  border: none;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#2845B5" : "#ffffff")};
  border-radius: 6px;
  height: 30px;
  padding-left: 10px;
  font-size: 11.5px;
  text-align: left;
  font-family: "Poppins", sans-serif;
  cursor: pointer;
  transition: 0.25s ease;
  font-weight: ${({ $active }) => ($active ? "700" : "500")};
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;

  &:hover {
    background: ${({ $active }) =>
      $active ? "#ffffff" : "rgba(255, 255, 255, 0.12)"};
  }

  &::before {
    content: "";
    position: absolute;
    left: -18px;
    top: 14px;
    width: 12px;
    border-top: 2px dashed rgba(255, 255, 255, 0.4);
  }
`;

export const SidebarFooter = styled.div`
  padding: 14px 16px 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const LogoutButton = styled.button`
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #F58220;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.25s ease;
  box-shadow: 0 2px 6px rgba(245, 130, 32, 0.25);

  &:hover {
    background: #e07316;
  }

  svg {
    font-size: 16px;
  }
`;

export const PoweredBy = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 12px;

  span {
    color: rgba(255, 255, 255, 0.85);
    font-weight: 400;
  }

  strong {
    color: #ffffff;
    font-weight: 700;
    letter-spacing: 0.4px;
  }
`;

export const MobileOverlay = styled.div`
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: ${({ $open }) => ($open ? "block" : "none")};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 998;
  }
`;

export const MobileButton = styled.button`
  display: none;

  @media (max-width: ${breakpoints.tablet}) {
    display: flex;
    position: fixed;
    top: 12px;
    left: 12px;
    width: 38px;
    height: 38px;
    border: none;
    border-radius: 8px;
    background: #ffffff;
    color: #2845B5;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;
