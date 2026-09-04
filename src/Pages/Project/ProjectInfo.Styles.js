import styled from "styled-components";

export const PageWrapper = styled.div`
  font-family: "Satoshi", sans-serif;
  background-color: #ffffff;
  padding: 20px;
  color: #1e1e1e;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #ffffff;
  margin-bottom: 1.5rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #3352ba;
  font-size: 1.6rem;
  cursor: pointer;
  margin-top: 10px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(-3px);
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 1.6rem;
  color: #3f64d7;
  margin: 0;
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1.5rem;

  @media (min-width: 3840px) {
    margin-top: 4rem;
    gap: 2.5rem;
  }

  @media (max-width: 2560px) {
    margin-top: 3rem;
    gap: 2rem;
  }

  @media (max-width: 1940px) {
    margin-top: 3rem;
    gap: 2rem;
  }

  @media (max-width: 1440px) {
    margin-top: 2.2rem;
    gap: 1.8rem;
  }

  @media (max-width: 1024px) {
    margin-top: 1.8rem;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    margin-top: 1.3rem;
    gap: 1.2rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
    gap: 1rem;
  }
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.2rem;

  div {
    flex: 1 1 48%;
    min-width: 220px;
    display: flex;
    flex-direction: column;
  }

  label {
    display: block;
    font-size: 17px;
    color: black;
    margin-bottom: 0.4rem;
    font-family: "Satoshi", sans-serif;
    font-weight: 400;
    line-height: 100%;
  }

  @media (min-width: 3840px) {
    label {
      font-size: 2rem;
    }
    div {
      flex: 1 1 49%;
    }
  }

  @media (max-width: 2560px) {
    gap: 1.2rem;
    label {
      font-size: 20px;
    }
  }

  @media (max-width: 1940px) {
    div {
      flex: 1 1 47%;
    }
    label {
      font-size: 1rem;
    }
  }

  @media (max-width: 1440px) {
    div {
      flex: 1 1 47%;
    }
    label {
      font-size: 1rem;
    }
  }

  @media (max-width: 1024px) {
    div {
      flex: 1 1 100%;
      min-width: 100%;
    }
    label {
      font-size: 16px;
    }
  }

  @media (max-width: 768px) {
    div {
      min-width: 100%;
    }
    label {
      font-size: 15px;
    }
  }

  @media (max-width: 480px) {
    gap: 0.8rem;
    margin-bottom: 1rem;
    label {
      font-size: 14px;
    }
  }
`;

export const InputField = styled.input`
  width: 90%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  font-family: "Satoshi", sans-serif;
  font-weight: 400;
  color: #333;
  background-color: #fff;
  transition: all 0.2s ease;

  &:focus {
    border-color: #3f64d7;
    outline: none;
    box-shadow: 0 0 0 2px rgba(63, 100, 215, 0.2);
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    border-radius: 10px;
  }

  @media (max-width: 2560px) {
    font-size: 20px;
  }

  @media (max-width: 1940px) {
    font-size: 0.9rem;
  }

  @media (max-width: 1440px) {
    font-size: 0.9rem;
  }

  @media (max-width: 1024px) {
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 0.55rem;
  }
`;

export const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
`;

export const LeftSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

export const RightSide = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;
  min-width: 120px;
  margin-top: 2rem;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (min-width: 2560px) {
    gap: 2rem;
    margin-top: 3rem;
  }

  @media (max-width: 2559px) and (min-width: 1440px) {
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    justify-content: center;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    min-width: 100%;
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    gap: 0.7rem;
    margin-top: 1.5rem;
  }
`;

export const ActionButton = styled.button`
  background-color: ${(props) =>
    props.color === "edit"
      ? "#3f64d7"
      : props.color === "delete"
      ? "#d9534f"
      : "#ccc"};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  font-size: 16px;
  font-family: "Satoshi", sans-serif;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background-color: ${(props) =>
      props.color === "edit"
        ? "#2f4db5"
        : props.color === "delete"
        ? "#b52b27"
        : "#999"};
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    border-radius: 10px;
  }

  @media (max-width: 2560px) {
    font-size: 1.2rem;
    border-radius: 10px;
  }

  @media (max-width: 1940px) and (min-width: 1440px) {
    font-size: 15px;
  }

  @media (max-width: 1024px) {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 80%;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 14px;
  }
`;

export const TableWrapper = styled.div`
  width: 100%;
  max-height: 40vh;       
  overflow-y: auto;       
  overflow-x: hidden;   

  border: 1px solid #eee;
  border-radius: 10px;
  border:none;
  /* Optional: nice scrollbar */
  &::-webkit-scrollbar {
    width: 2px;

  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
`;


export const EmployeesSection = styled.div`
  margin-top: 2rem;

  .employee-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    font-size: 1.2rem;
    margin: 0;
  }
`;

export const EmployeeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;

  h2 {
    font-size: 1.8rem;
    font-family: "Satoshi", sans-serif;
    font-weight: 600;
    color: #222;
    margin: 0;
  }

  @media (min-width: 3840px) {
    h2 {
      font-size: 2.4rem;
    }
  }

  @media (max-width: 3839px) and (min-width: 2560px) {
    h2 {
      font-size: 2.2rem;
    }
  }

  @media (max-width: 2559px) and (min-width: 1940px) {
    h2 {
      font-size: 2rem;
    }
  }

  @media (max-width: 1939px) and (min-width: 1440px) {
    h2 {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 1439px) and (min-width: 1024px) {
    h2 {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 1023px) {
    align-items: center;
    h2 {
      font-size: 1.4rem;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    gap: 0.6rem;
    h2 {
      font-size: 1.2rem;
    }
  }
`;

export const AddButton = styled.button`
  background: #3352ba;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
  font-family: "Satoshi", sans-serif;
  font-weight: 500;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: #2e4cb5;
    transform: translateY(-2px);
  }

  @media (min-width: 3840px) {
    font-size: 1.4rem;
  }

  @media (max-width: 3839px) and (min-width: 2560px) {
    font-size: 1.3rem;
  }

  @media (max-width: 2559px) and (min-width: 1940px) {
    font-size: 1.3rem;
  }

  @media (max-width: 1939px) and (min-width: 1440px) {
    font-size: 1rem;
  }

  @media (max-width: 1439px) and (min-width: 1024px) {
    font-size: 0.9rem;
  }

  @media (max-width: 1023px) {
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 0.85rem;
  }
`;

export const StatusRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 1rem;
`;

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.05);
  min-width: 220px;
`;

export const StatusLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  letter-spacing: 0.3px;
`;

export const NewStatusBadge = styled.div`
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${(props) => props.$bgcolor || "#6b7280"};
  color: white;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
`;

export const NewStatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: white;
  border: 3px solid ${(props) => props.bgcolor || "#6b7280"};
`;

export const StyledTable = styled.table`
  width: 100%;
  min-width: 700px;
  border-collapse: separate;
  border-spacing: 0 10px;
  text-align: left;
  font-family: "Satoshi";
  -webkit-overflow-scrolling: touch;
`;

export const TableHead = styled.thead`
  background: #304eb0;
  color: white;
`;

export const TableBody = styled.tbody``;

export const HeadRow = styled.tr``;

export const HeadCell = styled.th`
  padding: 12px;
  font-size: 1rem;
  text-align: left;
  font-family: "Raleway";
  white-space: nowrap;

  @media (min-width: 768px) {
    padding: 10px;
    font-size: 0.7rem;
  }

  @media (min-width: 1024px) {
    padding: 10px;
    font-size: 0.8rem;
  }

  @media (min-width: 1440px) {
    padding: 10px;
    font-size: 0.9rem;
  }

  @media (min-width: 1920px) {
    padding: 10px;
    font-size: 1rem;
  }

  @media (min-width: 2560px) {
    padding: 15px;
    font-size: 1.5rem;
  }

  @media (min-width: 3820px) {
    padding: 15px;
    font-size: 1.5rem;
  }
`;

export const BodyRow = styled.tr`
  cursor: pointer;
  transition: background 0.2s ease;
  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.25);

  &:hover td {
    background: #f9f9ff;
  }

  &:nth-child(even) td {
    background: #e6ecff;
  }
`;

export const BodyCell = styled.td`
  font-size: 1rem;
  white-space: nowrap;
  background: #ffffff;

  @media (min-width: 768px) {
    padding: 5px;
    font-size: 0.7rem;
  }

  @media (min-width: 1024px) {
    padding: 8px;
    font-size: 0.9rem;
  }

  @media (min-width: 1440px) {
    padding: 8px;
    font-size: 0.9rem;
  }

  @media (min-width: 1920px) {
    padding: 8px;
    font-size: 0.9rem;
  }
`;
