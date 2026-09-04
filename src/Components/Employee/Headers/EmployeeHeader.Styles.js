import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  margin: auto;
  margin-top:15px
  // padding: 20px;
`;

export const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

export const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ── New standard avatar upload design ───────────────────── */

export const AvatarShell = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
`;

export const ProfileLabel = styled.label`
  cursor: pointer;
  display: block;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
`;

export const AvatarCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  background: #f1f1f1;
  border: 3px solid #ffffff;
  box-shadow: 0 0 0 1px #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #94a3b8;
`;

export const HoverOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.55);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 0.7em;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.15s ease;

  ${AvatarCircle}:hover & {
    opacity: 1;
  }
`;

export const CameraBadge = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #3352ba;
  border: 3px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #27419a;
    transform: scale(1.05);
  }
`;

export const RemoveBadge = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s ease;

  &:hover {
    background: #dc2626;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const HelperText = styled.div`
  margin-top: 10px;
  font-size: 0.78em;
  color: #64748b;
  text-align: center;
`;

/* ── Form layout ──────────────────────────────────────────── */

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 5}, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;
export const FieldLabel = styled.label`
  margin-bottom: 6px;
  font-weight: 500;
  color: #172554;
  font-family: "Poppins";
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;

  ${(props) =>
    props.$required &&
    `
      &::after {
        content: " *";
        color: #ef4444;
      }
    `}
`;

export const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 0.95em;

  &:focus {
    border-color: #3352ba;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

export const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 0.95em;
  resize: vertical;
  &:focus {
    border-color: #3352ba;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

export const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 0.95em;
  background: white;
  &:focus {
    border-color: #3352ba;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

export const ErrorText = styled.div`
  color: red;
  font-size: 0.85em;
  margin-top: 4px;
  text-align: left;
`;
export const SectionTitle = styled.h2`
  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;

  // border-bottom: 2px solid #e2e8f0;
  // padding-bottom: 8px;
`;

