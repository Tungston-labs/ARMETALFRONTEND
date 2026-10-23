// DocumentUploadForm.styles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
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
  background-color: #fff;
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
margin-top: 10px;
  color: #171717;
  font-size: 18px;
  font-weight: 500;
  line-height: 18px;
font-size: "poppins";
  @media (max-width: 600px) {
    font-size: 14px;

    margin-bottom: 12px;
  }

  @media (max-width: 420px) {
    font-size: 13px;
  }
`;


export const UploadSection = styled.div`
  margin-bottom: 1.5rem;
  background: #F1F1F1;
  padding: clamp(0.8rem, 1vw, 2rem);
  border-radius: 8px;

  @media (min-width: 1440px) {
    padding: 2rem;
    border-radius: 10px;
  }
  @media (min-width: 1960px) {
    padding: 2.5rem;
    border-radius: 12px;
  }
  @media (min-width: 2560px) {
    padding: 2rem;
    border-radius: 14px;
     margin-bottom:2rem;
  }
  @media (min-width: 3840px) {
    padding: 3rem;
    border-radius: 16px;
       margin-bottom:2.5rem;
  }
  @media (min-width: 7680px) {
    padding: 4rem;
    border-radius: 18px;
  }
`;

export const LabelRow = styled.div`
  font-size: 1rem;       
font-weight: 500;
margin-bottom: 0.8rem;    
background: white;
color: #999999;
padding: 0.4rem;  
display: flex;
align-items: center;
flex-wrap: wrap;
gap: 0.6rem;

  @media (min-width: 1440px) { font-size: 1rem; padding: 0.6rem; }
  @media (min-width: 1960px) { font-size: 1rem; padding: 0.6rem; }
`;

export const SizeHint = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  color: #9ca3af;

  &::before {
    content: "•";
    margin-right: 0.6rem;
    color: #d1d5db;
  }
`;


export const FormCard = styled.div`
  /* padding:20px; */
`;
export const UploadButton = styled.button`
  background-color: #1e40af;
  color: #fff;
  padding: 10px;
  border: none;
  width: 100px;     
  height: 60px;      
  font-size: 10px;   
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #1c3aa9;
  }


  @media (min-width: 1440px) { font-size: 1rem; width: 150px; height: 60px; }
  @media (min-width: 1960px) { font-size: 1rem; width: 150px; height: 60px; }
`;

export const InlineUploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; 
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;
export const Button = styled.button`
  background: ${({ secondary }) => (secondary ? '#304EB0' : '#304EB0')};
  color: ${({ secondary }) => (secondary ? '#000' : '#fff')};
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;


  &:hover {
    background: ${({ secondary }) => (secondary ? '#304EB0' : '#304EB0')};
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
export const ImagePreviewRow = styled.div`
  display: flex;
  gap: 0.8rem;
`;

export const ImageBox = styled.div`
 width: 117px;
//   height: 80px;
//   border-radius: 10px;
//   border: 1px solid #ccc;
  overflow: hidden;
//   background-color: #f8f8f8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;