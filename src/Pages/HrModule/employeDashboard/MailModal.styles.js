import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

export const ModalBox = styled.div`
  width: 520px;
  background: #fff;
  border-radius: 10px;
  padding: 0;
  box-shadow: 0px 4px 20px rgba(0,0,0,0.15);

  /* Tablet */
  @media (max-width: 768px) {
    width: 90%;
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    width: 95%;
    border-radius: 8px;
  }

  /* Ultra-large screens */
  @media (min-width: 2540px) {
    width: 700px;
  }
`;

export const ModalHeader = styled.div`
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 12px 14px;
  }

  @media (min-width: 2540px) {
    font-size: 20px;
    padding: 20px 24px;
  }
`;

export const CloseBtn = styled.button`
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;

  @media (max-width: 480px) {
    font-size: 16px;
  }

  @media (min-width: 2540px) {
    font-size: 24px;
  }
`;

export const Row = styled.div`
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 480px) {
    padding: 10px 14px;
    gap: 8px;
  }

  @media (min-width: 2540px) {
    padding: 20px 26px;
    gap: 18px;
  }
`;

export const Label = styled.div`
  width: 60px;
  font-size: 14px;
  color: #555;

  @media (max-width: 480px) {
    width: 50px;
    font-size: 13px;
  }

  @media (min-width: 2540px) {
    width: 80px;
    font-size: 18px;
  }
`;

export const Input = styled.input`
  flex: 1;
  padding: 6px;
  border: none;
  outline: none;
  font-size: 14px;

  @media (max-width: 480px) {
    padding: 5px;
    font-size: 13px;
  }

  @media (min-width: 2540px) {
    padding: 10px;
    font-size: 18px;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 220px;
  border: none;
  padding: 18px;
  outline: none;
  resize: none;
  font-size: 14px;

  @media (max-width: 768px) {
    height: 180px;
  }

  @media (max-width: 480px) {
    height: 150px;
    padding: 12px;
    font-size: 13px;
  }

  @media (min-width: 2540px) {
    height: 300px;
    padding: 24px;
    font-size: 18px;
  }
`;

export const SendBtn = styled.button`
  background: #2563eb;
  color: white;
  padding: 10px 20px;
  margin: 15px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  float: right;
  font-weight: 600;

  &:hover {
    background: #1e40af;
  }

  @media (max-width: 480px) {
    padding: 8px 16px;
    margin: 12px;
    font-size: 13px;
  }

  @media (min-width: 2540px) {
    padding: 14px 28px;
    font-size: 18px;
    margin: 20px;
  }
`;
