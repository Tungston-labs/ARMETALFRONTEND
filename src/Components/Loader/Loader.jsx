import React from "react";
import styled, { keyframes } from "styled-components";
import logo from "../../assets/logo.svg"; // 👈 adjust path

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderOverlay = styled.div`
  position: fixed;  /* cover whole screen */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  flex-direction: column;
`;

const LogoWrapper = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  width: 50px;
  height: 50px;
  position: absolute;
  z-index: 2;
`;

const RotatingCircle = styled.div`
  width: 100px;
  height: 100px;
  border-width: 3px;
  border-style: solid;
  border-radius: 50%;
  border-left-color: #fff;
  border-top-color: #d3d3d3;
  border-right-color: transparent;
  border-bottom-color: transparent;
  position: absolute;
  animation: ${spin} 1s linear infinite;
`;

const LoaderText = styled.p`
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-top: 20px;
`;

const PunchLoader = ({ text }) => {
  return (
    <LoaderOverlay>
      <LogoWrapper>
        <LogoImage src={logo} alt="Logo" />
        <RotatingCircle />
      </LogoWrapper>
      <LoaderText>{text}</LoaderText>
    </LoaderOverlay>
  );
};

export default PunchLoader;
