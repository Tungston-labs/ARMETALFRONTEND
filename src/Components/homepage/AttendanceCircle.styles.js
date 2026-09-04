import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  padding: 12px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(0,0,0,0.1);
  @media (max-width: 768px) {
    max-width: 220px;
    padding: 10px;
  }

  @media (min-width: 1920px) {
    max-width: 350px;
    padding: 16px;
  }

   @media (min-width: 2560px) {
    max-width: 370px;
    padding: 18px;
  }
`;

export const Title = styled.h3`
  font-size: 18px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  
   @media (min-width: 2540px) {
    font-size: 2rem;
  }
`;

export const DoughnutWrapper = styled.div`
  margin-top: -50px;
  margin-bottom: -10px;

  @media (max-width: 768px) {
    margin-top: -40px;
    margin-bottom: -5px;
  }

  @media (min-width: 1920px) {
    margin-top: -60px;
    margin-bottom: -15px;
  }
`;

export const LegendBox = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: -2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    margin-top: -1.5rem;
  }

  @media (min-width: 1920px) {
    gap: 24px;
    margin-top: -2.5rem;
  }
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 13px;
    gap: 4px;
  }

  @media (min-width: 1920px) {
    font-size: 16px;
    gap: 8px;
  }
`;

export const ColorDot = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background-color: ${(props) => props.color};

  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }

  @media (min-width: 1920px) {
    width: 16px;
    height: 16px;
  }
`;
