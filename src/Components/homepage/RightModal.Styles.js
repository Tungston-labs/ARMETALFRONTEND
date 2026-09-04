import styled from "styled-components";

export const Panel = styled.div`
  position: fixed;
  top: 0;
  right: -400px;
  width: 320px;
  height: 100vh;
  background: #f4f8ffff;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
  transition: right 0.3s ease;
  padding: 20px;
  z-index: 2000;
  border-top-left-radius: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &.open {
    right: 0;
  }
  
  body.swal2-shown & {
    z-index: 900;
  }
 @media (min-width: 1000px) {
    width: 250px;
  } 


   @media (min-width: 1440px) {
    width: 300px;
  }
  @media (min-width: 1920px) {
    width: 350px;
  }
  @media (min-width: 2560px) {
    width: 450px;
  }
  @media (min-width: 3840px) {
    width: 380px;
  }


  @media (max-width: 992px) {
    width: 300px;
  }

  /* Mobile screens */
  @media (max-width: 600px) {
    width: 100%;
    right: -100%;
    border-radius: 0;

    &.open {
      right: 0;
    }
  }
`;

export const CloseIcon = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 28px;
  cursor: pointer;
  color: #444;
  font-weight: bold;
  line-height: 1;

  &:hover {
    color: #000;
  }

  /* Larger close icon on mobile for easier touch */
  @media (max-width: 600px) {
    font-size: 32px;
    top: 16px;
    right: 16px;
  }
`;

export const Columns = styled.div`
  margin: 20px 0;

  /* Add spacing adjustments for mobile */
  @media (max-width: 600px) {
    margin: 15px 0;
  }

  @media (min-width: 2540px) {
    margin-bottom: 4rem;
  }
`;
export const BottomActions = styled.div`
  position: sticky;
  bottom: 0px;
  right: 0;
  background: #f4f8ffff;
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #ddd;
  z-index: 3000;

  @media (max-width: 600px) {
    width: 100%;
    padding: 15px 20px;
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #e8edf8;
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #d5def6;
  }

  @media (max-width: 600px) {
    padding: 14px;
  }
`;

export const LogoutButton = styled(ActionButton)`
  background: #ffebee;
  color: #b71c1c;

  &:hover {
    background: #ffcdd2;
  }
`;

export const TopActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

export const EditProfileButton = styled.button`
  background: #3352ba;
  color: #e0f2fe;
  border: none;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #556dd6ff;
  }

  @media (max-width: 600px) {
    padding: 8px 14px;
    font-size: 14px;
  }
`;
