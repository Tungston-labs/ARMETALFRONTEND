import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const ModalBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
`;

export const SuccessImage = styled.img`
  width: 30%;
  height: 30%;
  margin-bottom: 1rem;
`;

export const Title = styled.h2`
  font-size: 24px;
  color: black;
  font-weight:700;
  margin: 0.1rem 0;
`;

export const Message = styled.p`
  font-size: 25px;
  color: #333;
  margin-bottom: 1.5rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
 
  
`;

export const ModalButton = styled.button`
  padding: 10px 28px;
  width: 50%;
  height: 40px;

  border-radius: 7px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 700;
  font-family: satoshi;
display: flex;
  align-items: center;
  justify-content: center;

  border: 2px solid ${({ variant }) => (variant === 'dark' ? '#172554' : '#172554')};
  background: ${({ variant }) => (variant === 'dark' ? '#172554' : '#9EABD8')};
  color: ${({ variant }) => (variant === 'dark' ? '#fff' : '#172554')};

  &:hover {
    opacity: 0.9;
  }
`;

