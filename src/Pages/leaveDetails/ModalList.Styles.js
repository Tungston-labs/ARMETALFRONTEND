import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ zIndex }) => zIndex || 1000};
  pointer-events: auto;
`;

export const ModalContainer = styled.div`
  background: white;
  width: 80%;
  max-width: 1200px;
  padding: clamp(16px, 2vw, 40px);
  border-radius: 10px;
  /* max-height: 90%; */
  overflow-y: auto;
  z-index: ${({ zIndex }) => zIndex || 1001};
  pointer-events: auto;

  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem;
  }

  @media (min-width: 3840px) {
    max-width: 2200px; /* for 4K */
  }

  @media (min-width: 7680px) {
    max-width: 4000px; /* for 8K */
  }
`;

export const ModalHeader = styled.div`
  font-weight: bold;
  margin-bottom: 1.5rem;

  /* Default size for mobile */
  font-size: 1rem;

  /* Tablet */
  @media (min-width: 576px) {
    font-size: 1.25rem;
  }

  /* Small laptop */
  @media (min-width: 768px) {
    font-size: 0.8rem;
  }

  /* Desktop */
  @media (min-width: 1024px) {
    font-size: 0.8rem;
  }

  /* Large screens (1440p) */
  @media (min-width: 1440px) {
    font-size: 1rem;
  }

@media (min-width: 2560px) {
    font-size: 1.5rem;
  }
  /* 4K */
  @media (min-width: 3840px) {
    font-size: 1.5rem;
  }

  /* 8K */
  @media (min-width: 7680px) {
    font-size: 3.5rem;
  }
`;


export const FieldRow = styled.div`
  display: flex;
  gap: clamp(10px, 2vw, 30px);
  margin-bottom: 20px;
  flex-wrap: wrap; /* makes it responsive */
`;

export const InputField = styled.input.attrs({ readOnly: true })`
  flex: 1;
  padding: clamp(8px, 1vw, 14px);
  font-size: clamp(0.8rem, 1vw, 1rem);
  border: 1px solid lightgray;
  border-radius: 5px;

  @media (min-width: 3840px) {
    font-size: 1.3rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.8rem;
  }
`;


export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: clamp(0.8rem, 1vw, 1rem);

  @media (min-width: 3840px) {
    font-size: 1.4rem;
  }

  @media (min-width: 7680px) {
    font-size: 2rem;
  }
`;

export const TableHeader = styled.thead`
  background-color: #2f43b8;
  color: white;

`;

export const TableRow = styled.tr`
  background-color: ${({ $highlighted }) =>
    $highlighted ? "#f1f4ff" : "white"};
`;

export const TableData = styled.td`
  padding: clamp(8px, 1vw, 16px);
  vertical-align: middle;
`;

export const ProfileImg = styled.img`
  width: clamp(25px, 2vw, 40px);
  height: clamp(25px, 2vw, 40px);
  border-radius: 50%;
  margin-right: 10px;
  vertical-align: middle;
  object-fit: cover;
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: clamp(10px, 2vw, 25px);
  margin-top: 20px;
  flex-wrap: wrap;
`;

export const ApproveButton = styled.button`
  background-color: #2f43b8;
  color: white;
  padding: clamp(6px, 1vw, 12px) clamp(14px, 2vw, 24px);
  border-radius: 6px;
  border: none;
  cursor: pointer;
  min-width: 100px;
  font-size: clamp(0.8rem, 1vw, 1.2rem);
  transition: background-color 0.3s ease, transform 0.2s ease;

  @media (min-width: 3840px) {
    font-size: 1.6rem;
    padding: 16px 32px;
  }

  @media (min-width: 7680px) {
    font-size: 2.2rem;
    padding: 22px 40px;
  }

  &:hover {
    background-color: #1e2a90;
    transform: scale(1.05);
  }
`;

export const DeclineButton = styled.button`
  background-color: #ff6f61;
  color: white;
  padding: 10px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  min-width: 100px;
  font-size:12px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #ff4a3a;
    transform: scale(1.05);
  }

  /* 📱 Small devices */
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 6px 12px;
  }

  /* 📱 Tablets */
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 8px 16px;
  }

  /* 💻 Large desktop / Full HD */
  @media (min-width: 1920px) {
    font-size: 1.8rem;
    padding: 12px 20px;
  }

  /* 🖥️ 4K Screens */
  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 14px 28px;
  }

  /* 🖥️ 8K Screens */
  @media (min-width: 7680px) {
    font-size: 2rem;
    padding: 20px 36px;
  }
`;

