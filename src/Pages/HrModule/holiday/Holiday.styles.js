// src/Pages/holiday/Holiday.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  font-family: sans-serif;
`;


export const FormSection = styled.div`
  display: flex;
  gap: clamp(12px, 2vw, 27px);
  flex-wrap: wrap;

  /* ✅ Larger gaps for bigger screens */
  @media (min-width: 1920px) {
    gap: clamp(20px, 2vw, 36px);
  }

  @media (min-width: 2560px) {
    gap: clamp(24px, 2vw, 48px);
  }

  /* ✅ Stack vertically on small screens */
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: clamp(160px, 20vw, 200px);

  @media (min-width: 2560px) {
    min-width: 320px; /* Wider on 4K */
  }

  @media (max-width: 767px) {
    min-width: 100%; /* Full width on mobile */
  }
`;

export const Label = styled.label`
  font-family: Satoshi;
  font-weight: 400;
  line-height: 120%;
  font-size: clamp(0.8rem, 1vw, 1rem);

  @media (min-width: 1920px) {
    font-size: clamp(1rem, 0.9vw, 1.2rem);
  }

  @media (min-width: 2560px) {
    font-size: 1.3rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.8rem;
  }
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  width: 100%;
  background-color: #fff;
  font-size: 0.9rem;

`;

export const Select = styled.select`
  padding:12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  width: 100%;
  background-color: #fff;
  font-size: 0.9rem;

`;

export const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(6px, 1vw, 12px);
  width: 100%;
`;

export const DateInput = styled.input`
  padding: 11px;
  border: 1px solid #ccc;
  border-radius: 7px;
  width: 100%;
  background-color: #fff;
  font-size: 0.9rem;
`;



export const Heading = styled.h2`
  margin: 0 0 10px 0;
  font-family: Raleway;
  font-weight: 600;
font-size: 1rem;
`;



export const Pagination = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;

  span {
    padding: 0.2rem 0.5rem;
    border: 1px solid #ccc;
    cursor: pointer;
    border-radius: 4px;

     @media (min-width: 3500px) {
      padding: 0.8rem 1.5;
      font-size: 2.5rem;
    }
    @media (min-width: 2000px) {
      padding: 0.6rem 0.8rem;
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
export const ErrorMessage = styled.p`
  color: red;
  margin-top: 8px;
  font-size: 14px;
`;

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`;

export const FilterLabel = styled.label`
  font-family: Satoshi;
  font-size: 14px;
  color: #333;
`;

export const MonthFilter = styled.input`
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background: #fff;
  font-size: 0.9rem;
  width: 180px;

  &:focus {
    outline: none;
    border-color: #3352BA;
  }
`;

export const HeadingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  gap: 16px;
  flex-wrap: wrap;
`;

