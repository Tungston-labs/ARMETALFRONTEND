import styled from "styled-components";


// =========================================================
// MAIN CONTAINER
// =========================================================

export const ProfileContainer = styled.div`
  width: 100%;
  margin-bottom: 0;
  box-sizing: border-box;
`;


// =========================================================
// PROFILE CARD
// =========================================================

export const ProfileCard = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  /* border-radius: 12px; */

  background-color: #fff;

  position: relative;

  overflow: hidden; /* keeps the banner's square top clipped to the card's rounded corners */

  box-sizing: border-box;
`;


// =========================================================
// PROFILE BANNER (gradient strip the avatar overhangs)
// =========================================================

export const ProfileBanner = styled.div`
  position: relative;

  display: flex;
  align-items: center;

  height: 130px;

  padding: 0 32px;

  /* orange -> purple/blue diagonal gradient, matches stepper header */
  background: linear-gradient(
    100deg,
    #f0872f 0%,
    #d97757 28%,
    #b06a8f 55%,
    #6a5fb8 100%
  );

  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 100px;
    padding: 0 20px;
  }
`;


// =========================================================
// CARD BODY (holds the back arrow + field grid, padded normally)
// =========================================================

export const ProfileCardBody = styled.div`
  position: relative;

  padding: 20px;

  /* pull the field grid up so it starts right after the avatar overhang */
  padding-top: 60px;

  box-sizing: border-box;


  /* =======================================================
     1440+
  ======================================================== */

  @media (min-width: 1440px) {
    padding: 28px;
    padding-top: 66px;
  }


  /* =======================================================
     Tablet
  ======================================================== */

  @media (max-width: 1024px) {
    padding: 18px;
    padding-top: 52px;
  }


  /* =======================================================
     Mobile
  ======================================================== */

  @media (max-width: 768px) {
    padding: 16px;
    padding-top: 44px;
  }
`;


// =========================================================
// BACK ARROW
// =========================================================

export const BackArrowWrapper = styled.div`
  position: absolute;

  top: 20px;
  left: 20px;

  cursor: pointer;

  z-index: 5;


  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
  }
`;


// =========================================================
// PROFILE IMAGE WRAPPER
// =========================================================

export const ProfileImageWrapper = styled.div`
  position: relative;

  align-self: center;

  margin-bottom: 25px;


  @media (max-width: 768px) {
    margin-bottom: 20px;
  }


  @media (min-width: 1920px) {
    margin-bottom: 30px;
  }


  @media (min-width: 2560px) {
    margin-bottom: 35px;
  }


  @media (min-width: 3840px) {
    margin-bottom: 40px;
  }
`;


// =========================================================
// PROFILE IMAGE
// =========================================================

export const ProfileImage = styled.img`
  width: 120px;
  height: 120px;

  border-radius: 50%;

  object-fit: cover;

  cursor: ${({ editable }) =>
    editable
      ? "pointer"
      : "default"};

  border: 2px solid #1034ad;


  @media (max-width: 1024px) {
    width: 100px;
    height: 100px;
  }


  @media (max-width: 768px) {
    width: 85px;
    height: 85px;
  }


  @media (min-width: 1920px) {
    width: 150px;
    height: 150px;
    border-width: 3px;
  }


  @media (min-width: 2560px) {
    width: 180px;
    height: 180px;
    border-width: 3px;
  }


  @media (min-width: 3840px) {
    width: 220px;
    height: 220px;
    border-width: 4px;
  }
`;


// =========================================================
// USER ICON
// =========================================================

export const UserIconWrapper = styled.div`
  width: 120px;
  height: 120px;

  border-radius: 50%;

  background: #f0f0f0;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: ${({ editable }) =>
    editable
      ? "pointer"
      : "default"};


  @media (max-width: 1024px) {
    width: 100px;
    height: 100px;
  }


  @media (max-width: 768px) {
    width: 85px;
    height: 85px;
  }


  @media (min-width: 1920px) {
    width: 150px;
    height: 150px;
  }


  @media (min-width: 2560px) {
    width: 180px;
    height: 180px;
  }


  @media (min-width: 3840px) {
    width: 220px;
    height: 220px;
  }
`;


// =========================================================
// PLUS ICON
// =========================================================

export const PlusIconWrapper = styled.div`
  position: absolute;

  bottom: 0;
  right: 0;

  width: 32px;
  height: 32px;

  background: #1034ad;

  color: #fff;

  border-radius: 50%;

  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  box-sizing: border-box;


  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;


// =========================================================
// INPUT GRID
// =========================================================

export const ContentArea = styled.div`
  width: 100%;

  display: grid;

  /*
   * 5 fields in one row
   */
  grid-template-columns:
    repeat(5, minmax(0, 1fr));

  gap: 20px;

  box-sizing: border-box;


  /* =======================================================
     1440+
  ======================================================== */

  @media (min-width: 1440px) {
    gap: 24px;
  }


  /* =======================================================
     Laptop
  ======================================================== */

  @media (max-width: 1200px) {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));

    gap: 18px;
  }


  /* =======================================================
     Tablet
  ======================================================== */

  @media (max-width: 900px) {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 16px;
  }


  /* =======================================================
     Mobile
  ======================================================== */

  @media (max-width: 600px) {
    grid-template-columns: 1fr;

    gap: 14px;
  }
`;


// =========================================================
// INPUT FIELD
// =========================================================

export const InputField = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 7px;

  min-width: 0;
`;


// =========================================================
// LABEL
// =========================================================

export const InputLabel = styled.label`
  display: block;
  position: static;

  padding: 0;
  background: transparent;
  color: #555;
  text-align: left;
  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;


`;


// =========================================================
// INPUT
// =========================================================

export const InputBox = styled.input`
  width: 100%;

  /* height: 44px; */

  padding: 8px 12px;

  border: 1px solid #ccc;

  border-radius: 6px;

  outline: none;

  font-size: 0.95rem;

  font-family: inherit;

  color: #111;

  background: #fff;

  box-sizing: border-box;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;


  &:focus {
    border-color: #1034ad;

    box-shadow:
      0 0 0 2px
      rgba(16, 52, 173, 0.12);
  }


  &:read-only {
    cursor: default;
  }


  &::placeholder {
    color: #999;
  }


  @media (max-width: 768px) {
    height: 42px;

    font-size: 0.9rem;
  }


  @media (min-width: 1920px) {
    height: 48px;

    font-size: 1rem;

    padding: 12px 14px;
  }


  @media (min-width: 2560px) {
    height: 54px;

    font-size: 1.1rem;

    padding: 14px 16px;
  }


  @media (min-width: 3840px) {
    height: 60px;

    font-size: 1.2rem;

    padding: 16px 18px;

    border-radius: 8px;
  }
`;


// =========================================================
// TEXTAREA
// =========================================================

export const BioBox = styled.textarea`
  width: 100%;

  min-height: 95px;

  padding: 12px;

  border: 1px solid #ccc;

  border-radius: 6px;

  outline: none;

  resize: vertical;

  font-size: 0.95rem;

  font-family: inherit;

  color: #111;

  background: #fff;

  box-sizing: border-box;


  &:focus {
    border-color: #1034ad;

    box-shadow:
      0 0 0 2px
      rgba(16, 52, 173, 0.12);
  }
`;