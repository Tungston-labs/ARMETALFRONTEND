import styled, { css } from "styled-components";

const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  laptop: "1024px",
  desktop: "1440px",
  ultra: "1920px",
};

export const SidebarContainer = styled.aside`
width:280px ;
  /* width: ${({ $collapsed }) => ($collapsed ? "90px" : "280px")}; */
  height: 100vh;
  background:#3250B5;
  color: #fff;
  display: flex;
  flex-direction: column;
  transition: 0.35s ease;
  position: sticky;
  top: 0;
  overflow: hidden;
  z-index: 999;

  @media (max-width: ${breakpoints.tablet}) {
    position: fixed;
    left: ${({ $open }) => ($open ? "0" : "-100%")};
    width: 280px;
    transition: 0.35s;
    box-shadow: 5px 0 30px rgba(0, 0, 0, 0.2);
  }
`;

export const LogoSection = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  flex-shrink: 0;
`;

export const Logo = styled.img`
  /* width: 50px; */
  height: 50px;
  object-fit: contain;
`;


export const Menu = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 18px;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: #3250B5;
    border-radius: 20px;
  }
`;

export const MenuItem = styled.div`
  margin-bottom: 18px;
`;

export const MenuButton = styled.button`
  width:100%;
  height:35px;
  border:none;
  border-radius:8px;
  background:${({ $active }) =>
    $active ? "#ffffff" : "#4863BF"};
  color:${({ $active }) =>
    $active ? "#222" : "#fff"};
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 15px;
  cursor:pointer;
  transition:.3s;
  font-family: "Poppins", sans-serif;
  &:hover{
      background:${({ $active }) =>
        $active
          ? "#fff"
          : "#5670c9"};
  }
`;

export const LeftContent = styled.div`
  display:flex;
  align-items:center;
  gap:12px;
`;

export const Icon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 18px;
  min-width: 22px;
`;

export const Label = styled.span`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
/* 
  display: ${({ $collapsed }) =>
    $collapsed ? "none" : "block"}; */
`;

export const Arrow = styled.div`
  transition: .3s;

  ${({ $open }) =>
    $open &&
    css`
      transform: rotate(180deg);
    `}
`;

export const SubMenu = styled.div`
  position: relative;
  margin-left: 26px;
  padding-left: 20px;
    font-family: "Poppins", sans-serif;
  max-height: ${({ $open }) => ($open ? "500px" : "0")};
  overflow: hidden;
  transition: max-height .35s ease;
  &::before{
      content:"";
      position:absolute;
      left:0;
      top:0;
      bottom:8px;
      border-left:2px dashed rgba(255,255,255,.35);
  }
`;

export const SubMenuItem = styled.button`
  width:100%;
  position:relative;
  border:none;
  background:${({ $active }) =>
    $active ? "#ffffff" : "transparent"};
  color:${({ $active }) =>
    $active ? "#222" : "#ffffff"};
  border-radius:6px;
  height:30px;
  padding-left:10px;
  font-size:12px;
  text-align:left;
    font-family: "Poppins", sans-serif;
  cursor:pointer;
  transition:.25s;
  font-weight:500;
margin-top: 8px;
  &:hover{
      background:${({ $active }) =>
        $active
          ? "#fff"
          : "rgba(255,255,255,.12)"};
  }

  &::before{
      content:"";
      position:absolute;

      left:-20px;
      top:19px;

      width:14px;

      border-top:2px dashed rgba(255,255,255,.35);

      border-top-left-radius:8px;
  }
`;

export const Footer = styled.div`
  width: 100%;
  padding: 18px 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  color: #ffffff;
  font-family: "Poppins", sans-serif;

  box-sizing: border-box;

  span {
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.85);
    white-space: nowrap;
  }

  strong {
    font-size: 14px;
    font-weight: 700;
    color: #ffffff;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
`;

export const MobileOverlay = styled.div`
  display: none;

  @media(max-width:${breakpoints.tablet}){

    display:${({ $open })=>$open ? "block":"none"};

    position:fixed;
    inset:0;

    background:rgba(0,0,0,.45);

    z-index:998;
  }
`;

export const MobileButton = styled.button`
  display:none;

  @media(max-width:${breakpoints.tablet}){

      display:flex;

      position:fixed;

      top:10px;
      left:10px;

      width:40px;
      height:40px;

      border:none;

      border-radius:10px;

      background:#fff;

      color:#3c57b7;

      align-items:center;
      justify-content:center;

      font-size:20px;

      cursor:pointer;

      z-index:1000;
  }
`;