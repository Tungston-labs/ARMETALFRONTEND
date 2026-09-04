import styled from "styled-components";
import { Link } from "react-router-dom";

export const PageBackground = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #2b2fa3 0%, #6a5fd0 45%, #E0822D 100%);
`;

export const PageWrapper = styled.div`
  display: flex;
  width: 100%;
  max-width: 1000px;
  min-height: 520px;

  border-radius: 24px;
  overflow: hidden;

  box-shadow: 0 30px 60px rgba(20, 20, 43, 0.35);

  background: #ffffff;

  /* Below 1024px */
  @media (max-width: 1023px) {
    max-width: 480px;
    min-height: auto;
    border-radius: 20px;
  }

  /* Mobile */
  @media (max-width: 480px) {
    width: 100%;
    border-radius: 16px;
  }
`;

/* ---------- LEFT SIDE ---------- */

export const LeftPanel = styled.div`
  position: relative;

  flex: 1.1;

  display: flex;
  flex-direction: column;

  padding: 36px 48px 0;

  overflow: hidden;

  @media (max-width: 1023px) {
    display: none;
  }
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 50px;
    height: auto;
    display: block;
  }

  @media (max-width: 900px) {
    img {
      width: 40px;
    }
  }

  @media (max-width: 480px) {
    img {
      width: 40px;
    }
  }
`;
export const HeroText = styled.div`
  margin-top: 56px;

  h1 {
    margin: 0;
    color: #14142b;
    font-family: "Poppins";
font-weight: 600;
font-style: SemiBold;
font-size: 24px;
line-height: 34px;
letter-spacing: 0%;

  }

  p {
    margin: 14px 0 0;
    max-width: 320px;
    line-height: 1.5;
    font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 26px;
letter-spacing: 3%;

  }

  @media (max-width: 900px) {
    h1 {
      font-size: 26px;
    }
  }
`;

export const AccentDivider = styled.span`
  display: block;
  width: 64px;
  height: 4px;
  border-radius: 4px;
  background: #ff8a3d;
  margin: 28px 0;
`;

export const IllustrationArea = styled.div`
  position: relative;
  flex: 1;
  margin-top: 16px;
  min-height: 320px;

  .dot-grid {
    position: absolute;
    left: -10px;
    top: 40px;
    width: 160px;
    height: 160px;
    background-image: radial-gradient(#dcdfef 1.5px, transparent 1.5px);
    background-size: 14px 14px;
    opacity: 0.8;
  }

  .girl-illustration {
    position: absolute;
    bottom: -12px;
    left: 60px;
    width: 340px;
    max-width: 80%;
    height: auto;
  }

`;

/* ---------- RIGHT SIDE ---------- */

export const RightPanel = styled.div`
  flex: 1;

  max-width: 480px;

  background: #3352BA;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 32px;

  @media (max-width: 1023px) {
    width: 100%;
    max-width: 100%;

    min-height: 520px;

    padding: 40px 32px;
  }

  @media (max-width: 600px) {
    min-height: 500px;

    padding: 35px 24px;
  }

  @media (max-width: 480px) {
    min-height: 480px;

    padding: 30px 20px;
  }
`;

export const FormCard = styled.form`
  width: 100%;
  max-width: 340px;
`;

export const Welcome = styled.div`
  margin-bottom: 28px;

  h2 {
    margin: 0 0 6px;
    color: #ffffff;
    font-size: 22px;
    font-weight: 700;
  }

  p {
    margin: 0;
    color: rgba(255, 255, 255, 0.65);
    font-size: 14px;
  }
`;

export const FieldGroup = styled.div`
  margin-bottom: 18px;

  label {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.75);
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 40px 0 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.06);
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }

  &:focus {
    border-color: #ff8a3d;
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ToggleVisibility = styled.button`
  position: absolute;
  right: 12px;

  background: none;
  border: none;

  cursor: pointer;

  color: rgba(255, 255, 255, 0.55);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  font-size: 19px;

  &:hover {
    color: #ffffff;
  }

  &:focus {
    outline: none;
  }
`;
export const ForgotPassword = styled(Link)`
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;

export const RememberRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0 24px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;

  input {
    width: 15px;
    height: 15px;
    accent-color: #ff8a3d;
    cursor: pointer;
  }
`;

export const LoginButton = styled.button`
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 8px;
  background: #ffffff;
  color: #2b2fa3;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  margin: -8px 0 16px;
  color: #ffb4a2;
  font-size: 13px;
`;