import styled from "styled-components";
// import { FiSearch } from "react-icons/fi";

export const Container = styled.div`
  padding: 20px;
  font-family: "Satoshi";

`;



export const TableWrapper = styled.div`
  
`;


export const TruncatedText = styled.div`
  /* max-width: 80px; */
  white-space: nowrap;
  /* overflow: hidden; */
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    max-width: 50px; 
    overflow: hidden;
  }
   @media (min-width: 769px) and (max-width: 1024px) {
    max-width: 80px; 
    overflow: hidden;
  }
   @media (min-width: 1025px) and (max-width: 1440px) {
    max-width: 80px; 
    overflow: hidden;
  }
`;
export const PageLoaderOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;
