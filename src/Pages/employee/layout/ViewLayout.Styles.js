import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  margin: auto;
 background-color: white;
`;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
   /* margin-bottom:20px; */
  
`;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const TabsRowContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  overflow: hidden;
  justify-content: center; 
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
  grid-template-columns: repeat(3, 1fr); 
  gap: 20px;
  margin-top: 0.5rem;
 margin: 0 auto;              
  justify-content: center;   
  /* Tablet scroll for smaller screens */
  @media (max-width: 1024px) {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const TabButton = styled.button`
  width: 100%; 
  padding: 12px 10px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: ${({ active }) => (active ? "#304EB0" : "#f0f0f0")};
  color: ${({ active }) => (active ? "#fff" : "#555")};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ active }) => (active ? "#304EB0" : "#dbe4f7")};
    transform: scale(1.05);
  }
`;