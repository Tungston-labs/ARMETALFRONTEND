import styled from "styled-components";

export const Grid = styled.div`
  margin-top: 5px;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(4, 1fr);



  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }


  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

 
  @media (min-width: 2560px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media (min-width: 3840px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
