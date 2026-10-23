import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 10px;
`;

export const ModalContainer = styled.div`
  background: #fff;
  width: 100%;
  max-width: 2000px; 
  padding: clamp(1rem, 2vw, 2rem);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  font-family: "Satoshi", sans-serif;
  display: flex;
  flex-direction: column;
  border-radius: 8px;

  @media (min-width: 3840px) {
    max-width: 2800px;
    padding: 2rem 2rem;
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    max-width: 1900px;
    padding: 2.5rem 3rem;
  }

  @media (min-width: 1940px) and (max-width: 2559px) {
    max-width: 1600px;
    padding: 2rem 2.5rem;
  }

  @media (min-width: 1440px) and (max-width: 1939px) {
    max-width: 1100px;
  }

  @media (min-width: 1024px) and (max-width: 1439px) {
    max-width: 800px;
  }

  @media (max-width: 1023px) {
    width: 95%;
    padding: 1rem 1.5rem;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 0.8rem 1rem;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #304eb0;
  font-family: "Satoshi";
  font-weight: 700;
  font-size: clamp(1.2rem, 1.5vw, 2.2rem);
  line-height: 1;

  @media (min-width: 3840px) {
    max-width: 2000px;
    font-size: clamp(1.8rem, 2vw, 2.8rem);
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    max-width: 1400px;
    font-size: clamp(1.5rem, 1.5vw, 2.5rem);
  }

  @media (min-width: 1940px) and (max-width: 2559px) {
    max-width: 1200px;
    font-size: clamp(1.4rem, 1.5vw, 2.2rem);
  }

  @media (min-width: 1440px) and (max-width: 1939px) {
    max-width: 1000px;
    font-size: clamp(1.3rem, 1.2vw, 2rem);
  }

  @media (max-width: 1024px) {
    justify-content: center;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: clamp(1rem, 4vw, 1.4rem);
  }
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;

  .input-wrapper {
    position: relative;
    flex: 1;
  }

  input {
    width: 100%;
    border: 1px solid #5f53a5;
    border-radius: 6px;
    outline: none;

   
    font-size: 1.1rem;
    padding: 8px 16px 8px 30px;

    @media (min-width: 1940px) and (max-width: 2559px) {
      font-size: 1.2rem;
      padding: 9px 18px 9px 32px;
    }

    @media (min-width: 2560px) and (max-width: 3839px) {
      font-size: 1.3rem;
      padding: 10px 20px 10px 34px;
    }

    @media (min-width: 3840px) {
      font-size: 2rem;
      padding: 12px 24px 12px 36px;
    }

    @media (max-width: 1024px) {
      font-size: 1rem;
      padding: 6px 12px 6px 28px;
    }

    @media (max-width: 480px) {
      font-size: 0.85rem;
      padding: 6px 10px 6px 26px;
    }
  }

  .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #5f53a5;

    /* Default font size */
    font-size: 1.1rem;

    @media (min-width: 1940px) and (max-width: 2559px) {
      font-size: 1.2rem;
    }

    @media (min-width: 2560px) and (max-width: 3839px) {
      font-size: 1.3rem;
    }

    @media (min-width: 3840px) {
      font-size: 1.5rem;
    }

    @media (max-width: 1024px) {
      font-size: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }

  button {
    border: none;
    background: none;
    color: #3352BA;
    cursor: pointer;

    /* Default font size */
    font-size: 1rem;

    @media (min-width: 1940px) and (max-width: 2559px) {
      font-size: 1.1rem;
    }

    @media (min-width: 2560px) and (max-width: 3839px) {
      font-size: 1.2rem;
    }

    @media (min-width: 3840px) {
      font-size: 1.4rem;
    }

    @media (max-width: 1024px) {
      font-size: 0.95rem;
    }

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }
`;

export const TableWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  margin-top: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 10px;
  }

  @media (min-width: 2560px) {
    max-height: 600px;
  }

  @media (min-width: 3840px) {
    max-height: 800px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  margin-top: 1rem;
  text-align: left;
  font-family: "Satoshi";
  overflow-x: auto;

  th {
    background-color: #304eb0;
    color: white;
    font-family: Raleway;
    font-weight: 600;
  }

  tbody tr {
    box-shadow: 0px 0px 2.7px rgba(0, 0, 0, 0.28);
    background-color: white;
  }

  tbody tr:nth-child(even) td {
    background-color: #e6ecff;
  }

  tbody tr:hover td {
    background-color: #f5f5f5;
  }

 

 
`;

export const Checkbox = styled.input`
  cursor: pointer;

  /* Default size for desktop (1440px+) */
  width: 18px;
  height: 18px;

  @media (min-width: 1940px) and (max-width: 2559px) {
    width: 22px;
    height: 22px;
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    width: 24px;
    height: 24px;
  }

  @media (min-width: 3840px) {
    width: 3rem;
    height: 3rem;
  }

  @media (max-width: 1024px) {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
  }
`;


export const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem; /* default gap */
  margin-top: 1rem;

  @media (min-width: 1940px) and (max-width: 2559px) {
    gap: 1.2rem;
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    gap: 1.5rem;
  }

  @media (min-width: 3840px) {
    gap: 2rem;
  }

  @media (max-width: 768px) {
    /* flex-direction: column; */
    align-items: stretch;
    gap: 0.8rem;
  }
`;

export const Button = styled.button`
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.8rem;

  &.cancel {
    background: #ff4d4f;
    color: white;
  }

  &.add {
    background: #3352BA;
    color: white;
  }

  @media (min-width: 1940px) and (max-width: 2559px) {
    padding: 10px 24px;
    font-size: 1.1rem;
  }

  @media (min-width: 2560px) and (max-width: 3839px) {
    padding: 12px 28px;
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    padding: 14px 32px;
    font-size: 2rem;
  }

  @media (max-width: 1024px) {
    padding: 8px 16px;
    font-size: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.85rem;
    width: 100%;
    text-align: center;
  }
`;
export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;

  @media (min-width: 1440px) {
    min-width: 800px;
  }

  @media (min-width: 2560px) {
    min-width: 1000px;
  }
`;

export const Thead = styled.thead`
   background-color: #304eb0;
   color:white;
`;

export const Th = styled.th`
  padding: 10px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #ddd;

  font-size: 12px;

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
  }

  @media (min-width: 3840px) {
    font-size: 18px;
    padding: 16px;
  }
`;

export const Tr = styled.tr`
  &:hover {
    background-color: #fafafa;
  }
`;

export const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;

  font-size: 12px;

  @media (min-width: 768px) {
    font-size: 13px;
    padding: 12px;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
  }

  @media (min-width: 3840px) {
    font-size: 18px;
    padding: 16px;
  }
`;

export const CenterText = styled.p`
  text-align: center;
  padding: 1rem;
  font-size: 14px;
`;

export const EmptyRowText = styled.td`
  text-align: center;
  padding: 1.5rem;
  font-size: 14px;
`;

