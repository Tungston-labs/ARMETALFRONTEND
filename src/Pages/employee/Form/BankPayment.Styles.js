// BankPaymentForm.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
 background: white; 
 font-family: Satoshi;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h2 {
    margin: 0;
  }

  p {
    // color: gray;
    // font-size: 0.9rem;
  }
`;

export const RoleInfo = styled.div`
   display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  // border: 1px solid #ccc;
  // border-radius: 12px;
  // background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  // box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const Stepper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  max-width: 600px;
`;
//Step
export const Step = styled.div`
  text-align: center;
  flex: 1;
  border-bottom: 2px solid ${({ active }) => (active ? '#003366' : '#ccc')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  padding: 0.5rem;
  font-size: 0.9rem;
  color: ${({ active }) => (active ? '#003366' : '#999')};
`;

export const SectionTitle = styled.h4`
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #333;
  background:white;
`;

export const FormSection = styled.div`
 
  border-radius: 12px;


`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const FormGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

export const ImageUpload = styled.div`
  width: 60px;
  height: 60px;
  background: #eee;
  border: 1px dashed #999;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 1.5rem;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

export const Button = styled.button`
  background: ${({ secondary }) => (secondary ? '#c7ceec' : '#003366')};
  color: ${({ secondary }) => (secondary ? '#000' : '#fff')};
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: ${({ secondary }) => (secondary ? '#aab3d0' : '#002244')};
  }
`;
export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 5px 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 480px) { /* small tablet */
    font-size: 0.8rem;
  }

  @media (min-width: 768px) { /* tablet */
    font-size: 1rem;
  }

  @media (min-width: 1024px) { /* desktop */
    font-size: 1.5rem;
  }

  @media (min-width: 1440px) { /* large desktop / 2K */
    font-size: 2rem;
  }

  @media (min-width: 2560px) { /* 4K */
    font-size: 3em;
  }

  @media (min-width: 3840px) { /* 8K */
    font-size: 4rem;
  }
`;

export const Subtitle = styled.p`
  // font-size: 1rem;
  color: #3250b5;
  margin: 0;
  font-family: Raleway;
  font-weight: 300;
  line-height: 1.2;

  @media (min-width: 480px) {
    font-size: 0.5rem;
  }

  @media (min-width: 768px) {
    font-size: 0.9rem;
  }

  @media (min-width: 1024px) {
    font-size: 1rem;
  }

  @media (min-width: 1440px) {
    font-size: 0.9rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;