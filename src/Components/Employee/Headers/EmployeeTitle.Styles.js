import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background: #fff;
  font-family: "Inter", sans-serif;
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

export const LeftBlock = styled.div`
  display: flex;
  align-items: center;
`;

export const IconWrapper = styled.div`
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Responsive scaling */
  @media (min-width: 1920px) {
    padding: 0.8rem;
  }

  @media (min-width: 2560px) {
    padding: 1rem;
  }

  @media (min-width: 3840px) {
    padding: 1.3rem;
  }
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Title = styled.h2`
  margin: 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  font-size: 22px;
  line-height: 100%;
  letter-spacing: 0%;

  /* Responsive scaling */
  @media (min-width: 1920px) {
    font-size: 26px;
  }

  @media (min-width: 2560px) {
    font-size: 30px;
  }

  @media (min-width: 3840px) {
    font-size: 38px;
  }
`;

export const Subtitle = styled.span`
  color: #3250b5;
  font-family: "Raleway";
  font-weight: 300;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0%;

  /* Responsive scaling */
  @media (min-width: 1920px) {
    font-size: 18px;
  }

  @media (min-width: 2560px) {
    font-size: 20px;
  }

  @media (min-width: 3840px) {
    font-size: 24px;
  }
`;

export const RightBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #304eb0;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s ease;

  &:hover {
    background: #1d4ed8;
  }
  @media (max-width: 1024px) {
    font-size: 0.8rem;
  }
 
  @media (min-width: 1920px) {
    padding: 0.8rem 1.2rem;
    font-size: 1rem;
    gap: 0.5rem;
  }

  @media (min-width: 2560px) {
    margin-top: 2rem;
    padding: 1rem 1.4rem;
    font-size: 1.15rem;
    gap: 0.6rem;
  }

  @media (min-width: 3840px) {
    margin-top: 5rem;
    padding: 1.2rem 1.8rem;
    font-size: 1.35rem;
    gap: 0.75rem;
  }
`;

export const SearchSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }

  /* Large Screens */
  @media (min-width: 1920px) {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 2560px) {
    gap: 2rem;
    margin-bottom: 2rem;
  }

  @media (min-width: 3840px) {
    gap: 2.5rem;
    margin-bottom: 2.5rem;
  }
`;

export const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  border: 1px solid #CCC;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  flex: 1;
  max-width: 500px;

  svg {
    color: #6b7280;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.4rem;
  }

  @media (min-width: 1024px) {
    padding: 0.5rem 1rem;
    max-width: 450px;

    svg {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 1920px) {
    padding: 8px;
    max-width: 400px;

    svg {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 2560px) {
    padding: 1rem 1.4rem;
    max-width: 700px;

    svg {
      font-size: 1.4rem;
    }
  }

  @media (min-width: 3840px) {
    padding: 1.2rem 1.6rem;
    max-width: 800px;

    svg {
      font-size: 1.6rem;
    }
  }
`;

export const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-family: "Satoshi";
  font-weight: 300;
  font-size: 17px;
  background: transparent;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }

  /* Large Screens */
  @media (min-width: 1920px) {
    font-size: 19px;
  }

  @media (min-width: 2560px) {
    font-size: 21px;
  }

  @media (min-width: 3840px) {
    font-size: 25px;
  }
`;

export const Dropdown = styled.select`
  border: 1px solid #172554;
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #374151;
  background: #fff;
  cursor: pointer;
  min-width: 160px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }

  @media (max-width: 768px) {
    width: 80%;
    padding: 0.5rem 1rem;
  }
  @media (min-width: 1024px) {
    padding: 0.5rem 1rem;

    svg {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 1920px) {
    padding: 0.8rem 1.2rem;


    svg {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 2560px) {
    padding: 1rem 1.4rem;


    svg {
      font-size: 1.4rem;
    }
  }

  @media (min-width: 3840px) {
    padding: 1.2rem 1.6rem;


    svg {
      font-size: 1.6rem;
    }
  }

`;

export const TabButton = styled.button`
  width: 100%;
  background: ${({ $active }) => ($active ? "#304EB0" : "#F2F2F2")};
  color: ${({ $active }) => ($active ? "#fff" : "black")};
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #8ca0e2;
    color: white;
  }
@media (max-width: 768px) {
     padding:10px;
    font-size: 0.8rem;
  }

  
 @media (min-width: 1024px) {
    padding: 12px;
    font-size: 0.9rem;
  }

  @media (min-width: 1920px) {
    padding: 0.7rem 1rem;
       font-size: 0.9rem;
  }

  /* 2560px (2K) */
  @media (min-width: 2560px) {
    padding: 1.1rem 1.5rem;
    font-size: 1.3rem;
  }

  /* 3840px (4K) */
  @media (min-width: 3840px) {
    padding: 1.3rem 1.8rem;
    font-size: 1.8rem;
    border-radius: 6px;
  }
`;

export const TabsRowContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  overflow: hidden;


  /* Spacing for larger screens */
  @media (min-width: 1920px) {
    margin-top: 0.5rem;
  }

  @media (min-width: 2560px) {
    margin-top: 0.8rem;
  }

  @media (min-width: 3840px) {
    margin-top: 1rem;
  }
`;

export const TabsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
  width: 100%;
  margin-top: 0.5rem;


  @media (min-width: 768px) and (max-width: 1024px) {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;


    &::-webkit-scrollbar {
      display: none;
    }
  }

  /* 1920px */
  @media (min-width: 1920px) {
    gap: 1rem;
  }

  /* 2560px */
  @media (min-width: 2560px) {
    gap: 1.3rem;
  }

  /* 3840px */
  @media (min-width: 3840px) {
    gap: 1.6rem;
    margin-top: 1rem;
  }
`;

export const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export const ScrollLeft = styled(ScrollButton)`
  left: 0;
`;

export const ScrollRight = styled(ScrollButton)`
  right: 0;
`;

export const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e5e7eb;
  width: 100%;

  @media (max-width: 768px) {
    margin-top: 0.5rem;
  }
`;
export const BackArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin-right: 12px; */
  cursor: pointer;
  color: #3352ba;
  transition: 0.2s ease;

  &:hover {
    color: #172554;
    transform: translateX(-3px);
  }
`;

export const ReportButton = styled(Button)`
  background: #ffffff;
  color: #304eb0;
  border: 1px solid #304eb0;

  &:hover {
    background: #304eb0;
    color: #ffffff;
  }
`;
export const ReportWrapper = styled.div`
  position: relative;
`;

export const ReportMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 1000;
`;

export const ReportMenuItem = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #304eb0;
    color: #ffffff;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }

  @media (min-width: 2560px) {
    font-size: 18px;
    padding: 16px 20px;
  }

  @media (min-width: 3840px) {
    font-size: 22px;
    padding: 20px 24px;
  }
`;