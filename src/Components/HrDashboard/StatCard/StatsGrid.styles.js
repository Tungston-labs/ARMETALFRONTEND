import styled from "styled-components";

export const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 14px;
  border: 1px solid #edf1f7;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }
`;

export const TopSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ bg }) => bg};

  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const Content = styled.div`
  flex: 1;
`;

export const Title = styled.p`
  margin: 0;
  color: #000;
  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 18px;
letter-spacing: 0%;
text-transform: capitalize;

`;

export const Value = styled.h2`
  margin: 6px 0 0;
 font-family: "Poppins";
font-weight: 500;
font-style: Medium;
font-size: 20px;
line-height: 18px;
letter-spacing: 0%;
margin-bottom: 4px;
`;

export const BottomSection = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap:10px;
`;

export const ChangeContainer = styled.span`
  color: ${({ color }) => color};
  font-size: 14px;
  font-weight: 600;
`;

export const ChangeText = styled.span`
  font-size: 13px;
  color: #94a3b8;
`;
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;

  @media (max-width: 1440px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;