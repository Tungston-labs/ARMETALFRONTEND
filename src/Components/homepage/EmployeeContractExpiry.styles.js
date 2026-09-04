import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  box-sizing: border-box;

`;

export const Header = styled.div`
   display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  align-items: center;
`;

export const Title = styled.h4`
  margin: 0;
  font-size: 17px;
  color: #0f172a;
  font-weight: 700;

  @media (max-width: 600px) {
    font-size: 15px;
  }

  @media (min-width: 1920px) {
    font-size: 22px;
  }
      @media (min-width: 2560px) {
    font-size: 22px;
  }
     @media (min-width: 3840px) {
    font-size: 30px;
  }
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 1920px) {
    gap: 10px;
  }
       @media (min-width: 2560px) {
     gap: 35px;
  }
     @media (min-width: 3840px) {
     gap: 35px;
  }
`;

export const ListItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
    /* padding: 8px 0px; */
  transition: background 0.2s, transform 0.2s;
   cursor: pointer;

    &:hover {
    background: #fff8f8ff;
    border-radius: 10px;
    transform: translateY(-2px);
  }
  @media (max-width: 600px) {
    gap: 10px;
  }

  @media (min-width: 1920px) {
    gap: 24px;
  }
       @media (min-width: 2560px) {
     gap:  24px;
  }
     @media (min-width: 3840px) {
     gap: 28px;
  }
`;

export const ExpiryBox = styled.div`
  width: 70px;
  padding: 10px 0;
  border-radius: 12px;
  text-align: center;

  background: ${({ $highlight }) =>
    $highlight ? "linear-gradient(180deg,#fee2e2,#fecaca)" : "#f1f5f9"};

  border: ${({ $highlight }) =>
    $highlight ? "1px solid #dc2626" : "1px solid #e2e8f0"};

  color: ${({ $highlight }) => ($highlight ? "#7f1d1d" : "#0f172a")};

  display: flex;
  flex-direction: column;
  justify-content: center;

  .day {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 2px;

    @media (max-width: 600px) {
      font-size: 16px;
    }
    @media (min-width: 1920px) {
      font-size: 20px;
    }
    @media (min-width: 2560px) {
      font-size: 26px;
    }
    @media (min-width: 3840px) {
      font-size: 30px;
    }
  }

  .month {
    font-size: 12px;
    text-transform: uppercase;

    @media (max-width: 600px) {
      font-size: 10px;
    }
    @media (min-width: 1920px) {
      font-size: 12px;
    }
    @media (min-width: 2560px) {
      font-size: 16px;
    }
    @media (min-width: 3840px) {
      font-size: 23px;
    }
  }

  @media (max-width: 600px) {
    width: 55px;
    padding: 6px 0;
  }
  @media (min-width: 1440px) {
    width: 80px;
    padding: 5px;
  }
  @media (min-width: 1920px) {
    width: 90px;
    padding: 14px 0;
  }
  @media (min-width: 2560px) {
    width: 90px;
    padding: 14px 0;
  }
  @media (min-width: 3840px) {
    width: 120px;
    padding: 20px 0;
  }
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  @media (min-width: 1920px) {
    gap: 6px;
  }
`;


export const NoData = styled.div`
  text-align: center;
  padding: 20px 0;
  color: #94a3b8;
  font-size: 14px;

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 12px 0;
  }

  @media (min-width: 1920px) {
    font-size: 18px;
    padding: 28px 0;
  }
`;
