import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const Container = styled.div`
  padding: 20px;
  font-family: Satoshi;
`;

export const ExpiryAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 1rem;
  color: #000000;
  font-size: 0.9rem;
  font-weight: 600;
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start; /* changed from flex-end to flex-start */
  gap: 0.3rem;
  margin-top: 1.5rem;
  // padding: 0.6rem;

  span {
    padding: 0.2rem 0.4rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 0.7rem;

    @media (min-width: 3500px) {
      padding: 0.8rem 1.5;
      font-size: 2.5rem;
    }
    @media (min-width: 2000px) {
      // padding: 0.6rem 0.8rem;
      font-size: 1.8rem;
    }
  }
  @media (min-width: 2560px) {
    span{
      font-size: 2rem;
    padding: 0.5rem 1.5rem;
    }
    gap: 0.5rem;
  }
  @media (min-width: 3840px) {
    span{
      font-size: 2.5rem;
    }
    gap: 1rem;
  }

  .active {
    background: #1e3a8a;
    color: white;
    border-color: #1e3a8a;
  }
`;


export const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;
