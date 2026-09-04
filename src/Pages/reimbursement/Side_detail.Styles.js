import styled, { keyframes } from "styled-components";

// Slide-in animation from the right
const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
`;

export const ModalContent = styled.div`
  // background: white;
  width: 80%;
  max-width: 700px;
  height: 100%;
  overflow-y: auto;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.2);

  animation: ${slideIn} 0.3s ease-out; 
  @media (min-width: 2560px) {
    width: 40%;
    max-width: none;
    padding: 2rem;
  }
  @media (min-width: 3840px) {
    padding: 3rem;
  }
`;

/* existing styles */
export const PageWrapper = styled.div`
  background: #f5f5f5;
  min-height: 100%;
  padding: 1rem;
  border-radius: 8px;
  @media (min-width: 2560px) {
    padding: 2.5rem;
    border-radius: 1rem;
  }
  @media (min-width: 3840px) {
    padding: 3rem;
    border-radius: 2rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const Title = styled.h2`
  color: #1a2f87;
  font-size: 1.5rem;
  @media (min-width: 2560px) {
    font-size: 2rem;
    /* padding-block: 1rem; */
  }
  @media (min-width: 3840px) {
    font-size: 3.5rem;
    /* padding-block: 2rem; */
  }
`;

export const CloseButton = styled.button`
  background: #2f52e0;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;

    @media (max-width: 1024px) {
    font-size: 0.8rem;

  }
  @media (min-width: 2560px) {
    font-size: 1.5rem;
    border-radius: 1rem;
  }
  @media (min-width: 3840px) {
    font-size: 2.5rem;
    padding: 1rem 2rem;
    border-radius: 1.5rem;
  }
`;

export const DateHeading = styled.h4`
  font-weight: 600;
  margin: 1.5rem 0 0.8rem 0;


    @media (max-width: 1024px) {
    font-size: 0.8rem;

  }
  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const Card = styled.div`
  display: flex;
  align-items: center;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    @media (max-width: 1024px) {
        padding: 0.9rem;
    font-size: 0.8rem;

  }

  @media (min-width: 2560px) {
    border-radius: 1rem;
    padding: 2rem;
    margin-bottom: 1.2rem;
  }
  @media (min-width: 3840px) {
    border-radius: 2rem;
    padding: 3rem;
    margin-bottom: 2rem;
  }
`;

export const ProfileImage = styled.img`
  width: 55px;
  height: 55px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
  @media (min-width: 2560px) {
    width: 100px;
    height: 100px;
  }
  @media (min-width: 3840px) {
    width: 180px;
    height: 180px;
  }
`;

export const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  @media (min-width: 2560px) {
    gap: 0.8rem;
  }
  @media (min-width: 3840px) {
    gap: 1rem;
  }
`;

export const Label = styled.div`
  font-size: 0.7rem;
  color: gray;
  @media (min-width: 2560px) {
    font-size: 1rem;
  }
  @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;

export const Value = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  // border-bottom: 1px solid #eee;

    @media (max-width: 1024px) {
    font-size: 0.8rem;
     font-weight: 400;
  }
  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
  
`;

export const RightSection = styled.div`
  display: flex;
  // align-items: center;
  gap: 2rem;
  //  border-bottom: 1px solid #eee;
`;

export const Amount = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: #2f52e0;

    @media (max-width: 1024px) {
    font-size: 0.8rem;

  }
  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;
