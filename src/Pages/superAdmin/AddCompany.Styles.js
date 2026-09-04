import styled from 'styled-components';

/* ---------------------------------------------
   Tokens (shared with SuperAdmin.Styles.js)
--------------------------------------------- */
const color = {
  bg: "#F7F8FB",
  surface: "#FFFFFF",
  border: "#E6E8EF",
  text: "#1B1F2A",
  textMuted: "#6B7280",
  primary: "#3352BA",
  primaryDark: "#242F73",
  primarySoft: "#EEF1FB",
  danger: "#D8452F",
  dangerSoft: "#FBEAE7",
};
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 30px;

  background: rgba(15, 23, 42, 0.45);

  z-index: 9999;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;

  background: ${color.surface};

  border-radius: 14px;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);

  overflow: hidden;

  animation: modalOpen 0.2s ease-out;

  @keyframes modalOpen {
    from {
      opacity: 0;
      transform: translateY(15px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    max-height: 95vh;
  }
`;
export const Container = styled.div`
  font-family: "Raleway", "Segoe UI", sans-serif;
  background-color: ${color.surface};
  padding: 20px;
`;

export const HRManager = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid ${color.border};
  border-radius: 10px;
  background-color: ${color.surface};
  font-size: 0.95rem;
  color: ${color.text};

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const SearchInput = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${color.border};
  font-size: 13.5px;

  &:focus {
    outline: none;
    border-color: ${color.primary};
    box-shadow: 0 0 0 3px ${color.primarySoft};
  }
`;

export const Header = styled.div`
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

export const Title = styled.h2`
  font-size: 22px;
  margin: 0;
  font-family: "Satoshi", sans-serif;
  font-weight: 700;
  color: ${color.text};
`;

export const Subtitle = styled.p`
  font-size: 12px;
  color: ${color.textMuted};
  margin: 0;
`;

/* ---------------------------------------------
   Form shell
--------------------------------------------- */
export const FormWrapper = styled.div`
  background: ${color.surface};
  border-radius: 12px;

  max-height: 90vh;
  overflow-y: auto;

  padding: 24px;

  box-sizing: border-box;

  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 768px) {
    padding: 18px;
    max-height: 95vh;
  }
`;

export const BackHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 700;
  font-family: "Satoshi", sans-serif;
  color: ${color.text};
  margin: 0 0 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${color.border};

  svg {
    font-size: 20px;
    color: ${color.textMuted};
    border-radius: 6px;
    transition: background 0.12s ease, color 0.12s ease;

    &:hover {
      background: ${color.primarySoft};
      color: ${color.primary};
    }
  }
`;

export const SectionTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${color.textMuted};
  margin: 0 0 16px;
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid ${color.border};
  margin: 24px 0;
`;

/* ---------------------------------------------
   Fields
--------------------------------------------- */
export const FormSection = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 8px;

  > div {
    width: 50%;
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  margin-bottom: 6px;
  font-size: 12.5px;
  color: ${color.textMuted};
  font-weight: 600;
  font-family: "Satoshi", sans-serif;
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid ${color.border};
  border-radius: 8px;
  font-size: 13.5px;
  color: ${color.text};
  background: ${color.surface};
  box-sizing: border-box;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: #9CA3AF;
  }

  &:focus {
    outline: none;
    border-color: ${color.primary};
    box-shadow: 0 0 0 3px ${color.primarySoft};
  }
`;

export const Select = styled.select`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${color.border};
  font-size: 13.5px;
  color: ${color.text};
  background: ${color.surface};

  &:focus {
    outline: none;
    border-color: ${color.primary};
    box-shadow: 0 0 0 3px ${color.primarySoft};
  }
`;

export const ErrorText = styled.p`
  margin: 6px 0 0;
  font-size: 12px;
  color: ${color.danger};
`;

/* ---------------------------------------------
   Privileges
--------------------------------------------- */
export const CheckboxGroup = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 24px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: ${color.text};
  padding: 8px 14px;
  border: 1px solid ${color.border};
  border-radius: 20px;
  background: ${color.surface};
  cursor: pointer;
  transition: border-color 0.12s ease, background 0.12s ease;

  &:has(input:checked) {
    border-color: ${color.primary};
    background: ${color.primarySoft};
    color: ${color.primaryDark};
  }

  input {
    accent-color: ${color.primary};
    margin: 0;
  }
`;

/* ---------------------------------------------
   Logo upload
--------------------------------------------- */
export const LogoUploadBox = styled.div`
  border: 1.5px dashed ${color.border};
  background-color: ${color.bg};
  padding: 14px;
  text-align: center;
  border-radius: 10px;
  margin-bottom: 12px;
  color: ${color.textMuted};
  font-size: 12.5px;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s ease, background 0.15s ease;

  svg {
    color: ${color.primary};
  }

  p {
    margin-top: 6px;
    line-height: 1.4;
  }

  &:hover {
    border-color: ${color.primary};
    background-color: ${color.primarySoft};
  }
`;

export const LogoPreview = styled.div`
  position: relative;
  display: inline-flex;
  width: fit-content;
  margin-bottom: 16px;

  img,
  object {
    width: 52px;
    height: 52px;
    object-fit: contain;
    border-radius: 8px;
    border: 1px solid ${color.border};
    background: ${color.surface};
    padding: 4px;
    display: block;
  }

  button {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background: ${color.danger};
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    padding: 0;

    &:hover {
      opacity: 0.9;
    }

    svg {
      font-size: 11px;
    }
  }
`;

/* ---------------------------------------------
   Salary table
--------------------------------------------- */
export const SalaryWrapper = styled.div`
  margin-top: 8px;
`;

export const SalaryTitle = styled.h4`
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${color.textMuted};
`;

export const SalaryTableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid ${color.border};
  border-radius: 10px;
`;

export const SalaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${color.surface};
`;

export const TableHead = styled.thead`
  background: ${color.bg};
`;

export const Th = styled.th`
  padding: 12px;
  font-size: 11.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  text-align: left;
  color: ${color.textMuted};
  border-bottom: 1px solid ${color.border};
`;

export const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid ${color.border};

  tr:last-child & {
    border-bottom: none;
  }
`;

export const TotalText = styled.span`
  font-weight: 700;
  color: ${({ isError }) => (isError ? color.danger : color.text)};
`;

/* ---------------------------------------------
   Toggle (freeze/unfreeze style switch, if used here)
--------------------------------------------- */
export const ToggleWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ToggleLabel = styled.label`
  font-size: 13.5px;
  font-weight: 600;
  color: ${color.text};
`;

export const ToggleInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: ${color.primary};
`;

/* ---------------------------------------------
   Actions
--------------------------------------------- */
export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  flex-wrap: wrap;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${color.border};
`;

export const Button = styled.button`
  padding: 10px 22px;
  border: 1px solid
    ${(props) => (props.cancel ? color.border : color.primary)};
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  color: ${(props) => (props.cancel ? color.textMuted : "white")};
  background-color: ${(props) =>
    props.cancel ? color.surface : color.primary};
  transition: background 0.12s ease, border-color 0.12s ease, opacity 0.12s ease;

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.cancel ? color.bg : color.primaryDark};
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    height: 44px;
  }

  div {
    display: flex;
    flex-direction: column;
  }
`;