import styled from "styled-components";

export const Card = styled.div`
  width: 100%;
  min-height: 122px;

  box-sizing: border-box;

  display: flex;
  align-items: center;

  gap: 24px;

  padding: 20px 18px;

  background: #ffffff;

  border: 1px solid #e2e2e2;
  border-radius: 2px;
`;

export const ImageWrapper = styled.div`
  width: 60px;
  height: 66px;

  flex-shrink: 0;

  overflow: hidden;

  border-radius: 7px;

  background: #000000;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const WarehouseImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;

  display: block;
`;

export const Content = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
`;

export const WarehouseName = styled.h3`
  margin: 0 0 2px;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 500;

  line-height: 1.4;

  color: #111111;
`;

export const CompanyName = styled.p`
  margin: 0 0 1px;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 400;

  line-height: 1.45;

  color: #111111;
`;

export const Address = styled.p`
  margin: 0;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 400;

  line-height: 1.45;

  color: #111111;
`;