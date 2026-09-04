import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 4000;
`;

export const Modal = styled.div`
  background: white;
  width: 420px;
  padding: 30px;
  border-radius: 14px;
`;

export const Title = styled.h2`
  margin-bottom: 25px;
  color: #172554;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
`;

// export const Input = styled.input`
//   padding: 12px;
//   border: 1px solid #d1d5db;
//   border-radius: 8px;
//   font-size: 14px;

//   &:focus {
//     outline: none;
//     border-color: #304eb0;
//   }
// `;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

export const CancelButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #e5e7eb;
  cursor: pointer;
`;

export const SaveButton = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #304eb0;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.7;
  }
`;
// export const InputWrapper = styled.div`
//   position: relative;
// `;

// export const EyeIcon = styled.div`
//   position: absolute;
//   top: 50%;
//   right: 14px;
//   transform: translateY(-50%);
//   cursor: pointer;
//   color: #6b7280;
//   display: flex;
//   align-items: center;
//   font-size: 18px;

//   &:hover {
//     color: #304eb0;
//   }
// `;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 45px 12px 12px; /* space for the icon */
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #304eb0;
  }
`;

export const EyeIcon = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  &:hover {
    color: #304eb0;
  }
`;