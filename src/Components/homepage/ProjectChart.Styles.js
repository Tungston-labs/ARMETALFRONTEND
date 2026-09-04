import styled from "styled-components";

export const ChartCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
height: 100%;
  @media (max-width: 992px) {
    padding: 16px;
    border-radius: 14px;
  }

  @media (max-width: 600px) {
    padding: 12px;
    border-radius: 12px;
  }

  /* Large screen improvements */
  @media (min-width: 1920px) {
    padding: 28px;
  }

  @media (min-width: 2560px) {
    padding: 45px;
  }

  @media (min-width: 3840px) {
    padding: 60px;
  }
`;

export const ChartTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
   display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 992px) {
    font-size: 16px;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }

  @media (min-width: 1920px) {
    font-size: 22px;
  }

  @media (min-width: 2560px) {
    font-size: 2rem;
  }

  @media (min-width: 3840px) {
    font-size: 34px;
  }
`;

export const TooltipBox = styled.div`
  background: white;
  padding: 10px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  .label {
    margin: 0;
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    @media (min-width: 1920px) {
      font-size: 18px;
    }

    @media (min-width: 2560px) {
      font-size: 20px;
    }

    @media (min-width: 3840px) {
      font-size: 24px;
    }
  }

  .value {
    margin: 4px 0 0;
    color: #3b5bff;
    font-weight: 500;
    font-size: 14px;

    @media (max-width: 600px) {
      font-size: 12px;
    }

    @media (min-width: 1920px) {
      font-size: 18px;
    }

    @media (min-width: 2560px) {
      font-size: 20px;
    }

    @media (min-width: 3840px) {
      font-size: 24px;
    }
  }
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;

  @media (max-width: 1024px) {
    height: 300px;
  }

  @media (min-width: 1920px) {
    height: 280px;
  }


 /* @media (min-width: 2560px) {
    height: 27vh;
  }

  @media (min-width: 3840px) {
    height: 26vh;
  } */
`;


export const getXAxisTickStyle = () => {
  const width = window.innerWidth;

  return {
    fill: "#334155",
    fontWeight: 500,
    fontSize:
      width >= 3840 ? 32 :  
      width >= 2560 ? 24 :   
      width >= 1920 ? 18 :  
      width >= 1024 ? 16 :   
      width >= 600  ? 14 :   
      12,                    
  };
};

export const getYAxisTickStyle = () => {
  const width = window.innerWidth;

  return {
    fill: "#64748b",
    fontSize:
      width >= 3840 ? 30 :
      width >= 2560 ? 20 :
      width >= 1920 ? 16 :
      width >= 1024 ? 14 :
      width >= 600  ? 13 :
      11,
  };
};


export const IconButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  svg {
    color: #3352ba;
    font-size: 22px;
  }

  &:hover svg {
    opacity: 0.8;
    transform: scale(1.05);
    transition: 0.2s ease;
  }
`;