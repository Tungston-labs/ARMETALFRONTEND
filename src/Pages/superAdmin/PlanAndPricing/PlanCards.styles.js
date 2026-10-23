import styled from "styled-components";

export const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;


  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PlanCard = styled.div`
  background: ${({ orange }) => (orange ? "#E0822D" : "#3352BA")};
  border: 1px solid
    ${({ orange }) => (orange ? "#3352BA" : "#E0822D")};
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PlanName = styled.h2`
  font-family: "Poppins";
font-weight: 600;
font-size: 18px;
line-height: 100%;
letter-spacing: 0%;
vertical-align: middle;

`;

export const Badge = styled.div`
  padding: 4px 16px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, .4);
  font-family: "Poppins";
font-weight: 600;
font-size: 11px;
line-height: 100%;
letter-spacing: 0%;
text-align: center;
vertical-align: middle;

`;

export const Price = styled.h1`
  margin: 30px 0 10px;
  font-size: 40px;
  font-weight: 700;
`;

export const Currency = styled.span`
  font-size: 40px;
`;

export const Month = styled.span`
  font-size: 16px;
  font-weight: 400;
`;

export const Description = styled.p`
  line-height: 1.6;
  margin-bottom: 28px;
  font-family: "Poppins";
font-weight: 300;
font-style: Regular;
font-size: 14px;
vertical-align: middle;

`;

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
`;

export const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
font-size: 14px;
font-family: "poppins";
font-weight: 300;
  svg {
    font-size: 17px;
  }
`;

export const EditButton = styled.button`
  margin-top: 35px;
  height: 48px;
  border: none;
  border-radius: 30px;
  background: white;
  color: #222;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;