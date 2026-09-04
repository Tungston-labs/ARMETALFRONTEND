import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const Modal = styled.div`
  width: 700px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,.2);
`;

export const Header = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid #eee;
`;

export const Title = styled.h3`
  margin: 0;
`;

export const CloseButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 24px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
`;

export const Label = styled.div`
  width: 80px;
  padding-left: 20px;
`;

export const Input = styled.input`
  flex: 1;
  height: 55px;
  border: none;
  outline: none;
  padding: 0 20px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 300px;
  border: none;
  outline: none;
  resize: none;
  padding: 20px;
`;

export const Footer = styled.div`
  padding: 20px;
  display: flex;
  justify-content: flex-end;
`;

export const SendButton = styled.button`
  padding: 12px 35px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  cursor: pointer;
`;