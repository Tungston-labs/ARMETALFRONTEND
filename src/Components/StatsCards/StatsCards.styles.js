import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-bottom: 15px;
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 10px;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  cursor: pointer;
  transition: 0.25s;

  border: 1px solid #0000001a;
  box-shadow: 0px 2.5px 25px 0px #4545501a;

  min-width: 0;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

export const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  min-width: 50px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 28px;

  color: ${({ color }) => color};
  background: ${({ bg }) => bg};

  flex-shrink: 0;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 0;
  flex: 1;
  overflow: hidden;
`;

export const Count = styled.div`
  font-size: 24px;
  font-weight: 700;

  max-width: 100%;
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Title = styled.div`
  margin-top: 5px;
  font-size: 14px;
  color: #8c89b4;
  font-weight: 400;
  font-family: "poppins";

  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;