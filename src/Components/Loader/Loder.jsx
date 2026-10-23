import React from "react";
import styled, { keyframes } from "styled-components";

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: rgba(255,255,255,0.8);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  margin: 0 6px;
  background-color: #555;
  border-radius: 50%;
  display: inline-block;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  
  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
  &:nth-child(3) {
    animation-delay: 0;
  }
`;

const SyncLoader = () => (
  <LoaderWrapper>
    <Dot />
    <Dot />
    <Dot />
   <Dot />

  </LoaderWrapper>
);

export default SyncLoader;
