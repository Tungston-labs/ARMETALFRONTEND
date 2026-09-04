import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;


export const ModalContainer = styled.div`
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;

  max-width: 600px;
  min-width: 280px;
  width: 90%;
  box-sizing: border-box;

  animation: slideDown 0.3s ease;

  /* Tablet */
  @media (min-width: 768px) {
    padding: 2rem;
    border-radius: 10px;
  }

  /* Laptop */
  @media (min-width: 1024px) {
    padding: 2.5rem;
  }

  /* Desktop */
  @media (min-width: 1440px) {
    padding: 3rem;
    max-width: 700px;
  }

  /* Large desktop */
  @media (min-width: 1920px) {
    max-width: 800px;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    max-width: 900px;
  }

  /* 8K screens */
  @media (min-width: 3840px) {
    max-width: 1200px;
  }

  @keyframes slideDown {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;


export const ModalTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;

  /* Tablet */
  @media (min-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.75rem;
  }
   @media (min-width: 1024px) {
    font-size: 1rem;
    margin-bottom: 0.9rem;
  }
 @media (min-width: 1440px) {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
 
  `;
 


export const ModalText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #333;

  /* Tablet */
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }

  /* Laptop */
  @media (min-width: 1024px) {
    font-size: 1rem;
  }

  /* Desktop */
  @media (min-width: 1440px) {
    font-size: 1rem;
  }

  /* Large desktop */
  @media (min-width: 1920px) {
    font-size: 1.2rem;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    font-size: 28px;
  }

  /* 8K screens */
  @media (min-width: 3840px) {
    font-size: 36px;
  }
`;

export const ModalButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  gap: 0.5rem;
  margin-top: 0.8rem;

  /* Tablet */
  @media (min-width: 768px) {
    gap: 0.75rem;
    margin-top: 1rem;
  }

  /* Laptop */
  @media (min-width: 1024px) {
    gap: 0.9rem;
    margin-top: 1.2rem;
  }

  /* Desktop */
  @media (min-width: 1440px) {
    gap: 1rem;
    margin-top: 1.5rem;
  }
`;


export const ModalButton = styled.button`
  background-color: ${(props) => props.bg || "gray"};
  color: white;
  border: none;
  cursor: pointer;

  font-size: 14px;
  padding: 10px;
  border-radius: 6px;

  min-width: 100px;
  max-width: 300px;

  &:last-child {
    margin-right: 0;
  }

  /* Tablet */
  @media (min-width: 768px) {
    font-size: 0.8rem;
    border-radius: 8px;
  }

  /* Laptop */
  @media (min-width: 1024px) {
    font-size: 1rem;
  }

  /* Desktop */
  @media (min-width: 1440px) {
    font-size: 1rem;
    border-radius: 10px;
  }

  /* Large Desktop */
  @media (min-width: 1920px) {
    font-size: 1.2rem;
    padding: 1.25rem 2rem;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    max-width: 350px;
    font-size: 28px;
    padding: 1.5rem 2.5rem;
    border-radius: 12px;
  }

  /* 8K screens */
  @media (min-width: 3840px) {
    max-width: 400px;
    font-size: 36px;
    padding: 2rem 3rem;
    border-radius: 14px;
  }
`;
