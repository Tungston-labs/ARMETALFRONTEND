import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';

export const SidebarContainer = styled.div`
  width: 310px;
  min-width: 60px;
  background: linear-gradient(181deg, rgba(23, 37, 84, 1) 20%, rgba(51, 82, 186, 1) 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  top: 0;
  left: 0;
  z-index: 100;
  overflow-y: auto; /* allow scrolling */
  scrollbar-width: none; /* Firefox: hide scrollbar */
  -ms-overflow-style: none;  /* IE 10+ */

  &::-webkit-scrollbar {
    width: 0px; /* hide scrollbar in Chrome, Safari */
    background: transparent; /* optional: just to be safe */
  }

  &.collapsed {
    width: 60px;
  }

  @media (max-width: 1024px) {
    width: 120px;
    &.collapsed {
      width: 60px;
    }
  }


  @media print {
    display: none !important;
  }

  &.collapsed {
    width: 60px;
  }
`;



export const TopSection = styled.div`
  padding: 20px;
  text-align: center;
`;

export const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin: 30px 0; */
  width: 100%;

  img {
    width: 180px;
    max-height: 110px;
    object-fit: contain;
    transition: width 0.3s ease;
  }

 img.default-logo {
    width: 300px;
    max-height: 110px;
  } 

  @media (max-width: 1024px) {
    img {
      width: 120px;

   img.default-logo {
      width: 120px;
    } 
  }
  }
  @media (min-width: 768px) and (max-width:1024px){
    display: none;
  }

  &.hidden {
    display: none;
  }

 @media (min-width: 1025px) {
    img{
    min-height: 150px;  
    width: 150px;
    }

     img.default-logo {
      width: 120px;
    } 
   }

 @media (min-width: 1440px) {
    img{
    min-height: 150px;   
    width: 150px;
    }

     img.default-logo {
      width: 120px;
    } 
   }
  @media (min-width: 1920px) {
    img{
    min-height: 150px;
    width: 200px;
    }
     img.default-logo {
      width: 120px;
    } 
   }
 
  
`;


export const Nav = styled.ul`
  list-style: none;
  margin: 0;
  padding: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  
   @media (min-width: 2560px) {
    gap: 1.5rem;
  }
   @media (min-width: 3840px) {
    gap:2.5rem;
  }
`;

export const BottomSection = styled.div`
  position: absolute;
  bottom: 5px;
  left:0px;
  // width: 100%;
  // padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LogoutButton = styled.button`
  font-size: 28px;
  color: red;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const ChangePasswordLink = styled(Link)`
  font-size: 14px;
  color: white;
  text-decoration: none;
  cursor: pointer;
  margin-left:30px;
  &:hover {
    color:blue;
    
  }
`;

export const ToggleButton = styled.button`
  display: none;
  background: none;
  color: white;
  border: none;
  font-size: 20px;
  margin-bottom: 10px;
  cursor: pointer;

  @media (max-width: 1024px) {
    display: block;
  }
`;

export const CustomLink = styled(Link)`
  width: 99%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 16px;
  border-radius: 4px;
  font-size: 1rem;
  color: white;
  font-weight: 600;
  text-decoration: none;
  font-family: 'Satoshi', sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  gap: 12px;

  svg,
  img {
    min-width: 20px;
    height: 20px;
    transition: filter 0.3s ease, transform 0.3s ease;
  }

  span {
    flex-grow: 1;
    white-space: nowrap;
    transition: opacity 0.3s ease, color 0.3s ease;
  }

  &:hover {
    background: white;
    color: #172554;

    svg {
      color: #172554;
      transform: scale(1.1);
    }

    img {
      filter: brightness(0) saturate(100%) invert(9%) sepia(40%)
        saturate(4410%) hue-rotate(217deg)
        brightness(95%) contrast(105%);
    }
  }

  &.active {
    background: white;
    color: #172554;

    svg {
      color: #172554;
    }

    img {
      filter: brightness(0) saturate(100%) invert(9%) sepia(40%)
        saturate(4410%) hue-rotate(217deg)
        brightness(95%) contrast(105%);
    }

    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 10%;
      width: 80%;
      height: 3px;
      background: white;
      border-radius: 2px;
    }
  }

  &.collapsed {
    justify-content: center;
    gap: 0;

    span {
      display: none;
    }
  }


    @media (min-width: 1024px) and (max-width: 1300px) {
       justify-content: center;
     gap: 10px;

    span{
     font-size: 0.8rem;
    }
    }

  @media (min-width: 768px) and (max-width: 1024px) {
    justify-content: center;
    gap: 0;

    span {
      display: none;
    }
  }

  /* Mobile */
  @media (max-width: 767px) {
    justify-content: flex-start;
    gap: 10px;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    gap: 1.5rem;

    svg,
    img {
      height: 35px;
      min-width: 35px;
    }
  }

  /* 5K+ screens */
  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    border-radius: 2rem;
    gap: 2rem;

    svg,
    img {
      height: 45px;
      min-width: 45px;
    }
  }
`;

export const LinkIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
  transition: filter 0.3s ease;

  /* default: white color */
  filter: brightness(0) invert(1);
`;

export const BottomText = styled.div`
  width: 100%;
  text-align: center;
  padding: 12px 0;
  font-size: 14px;
  color: #ffffffaa;
  font-weight: 500;
  margin-top: auto;
  line-height: 1.4;

  span {
    color: #ffffff;
    font-weight: 700;
  }

  &.collapsed {
    font-size: 12px;
    padding: 10px 0;

    span {
      display: none;
    }

    &::after {
      content: "R";
      font-weight: 700;
      color: #ffffff;
      font-size: 14px;
      margin-left: 4px;
    }
  }

  /* Mobile */
  @media (max-width: 767px) {
   font-size: 0.7rem;
    padding: 10px 0;

    span {
      font-size: 0.7rem;
    }
  }
 
  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.7rem;
    padding: 12px 0;

      span {
      font-size: 0.7rem;
    }
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 0.8rem;

    span {
      font-size: 0.7rem;
    }
  }

  /* Large screens / 4K */
  @media (min-width: 2560px) {
    font-size: 1rem;
    padding: 18px 0;

    &.collapsed::after {
      font-size: 1.4rem;
    }
  }

  
`;

export const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0px;
`;

export const SubMenuLink = styled(NavLink)`
  padding: 10px 0;
  color: #fff;
  text-decoration: none;
  font-size: 14px;

  &.active {
    color: #fff;
    font-weight: 700;
  }

  
`;