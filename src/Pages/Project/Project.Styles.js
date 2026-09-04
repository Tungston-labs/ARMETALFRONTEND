import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const PageWrapper = styled.div`
  font-family: "Satoshi", sans-serif;
  color: #1a1a1a;
  padding: 20px;
  background: #fff;
  min-height: 100vh;

  @media (max-width: 1200px) {
    padding: 1.5rem 3rem;
  }

  @media (max-width: 768px) {
    padding: 0.1rem 1.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;


export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem; 
`;

export const IconWrapper = styled.div`
   width: auto;
  height: 50px; 

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (min-width: 480px) {
    height: 70px;
  }

  @media (min-width: 768px) {
    height: 40px;
  }

  @media (min-width: 1024px) {
    height: 50px;
  }

  @media (min-width: 1440px) {
    height: 70px;
  }

  @media (min-width: 1920px) {
    height: 80px;
  }

  @media (min-width: 2560px) {
    height: 100px;
  }

  @media (min-width: 3840px) {
    height: 150px;
  }
`;


export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 0.3rem; */
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

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 14px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 14px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 16px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 18px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 20px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 24px;
  }

  @media (min-width: 3841px) {
    font-size: 32px;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 90%;
  max-width: 250px;
  margin: 1.5rem 0;

  /* Tablet */
  @media (max-width: 1024px) {
    max-width: 220px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    max-width: 200px;
    margin: 1rem 0;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    width: 100%;
    max-width: 100%;
    margin: 0.8rem 0;
  }

  /* Larger desktops */
  @media (min-width: 1440px) {
    max-width: 300px;
    margin: 2rem 0;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    max-width: 400px;
    margin: 2.5rem 0;
  }
`;

export const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  color: #5f53a5;
  font-size: 1rem;
  pointer-events: none;

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 0.95rem;
    left: 10px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.9rem;
    left: 10px;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.85rem;
    left: 9px;
  }

  /* Large screens */
  @media (min-width: 1440px) {
    font-size: 1.2rem;
    left: 14px;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    font-size: 1.4rem;
    left: 16px;
  }
`;

export const SearchBar = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem 0.8rem 2.5rem;
  border: 1px solid #5f53a5;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #333;
  background: #fff;
  transition: all 0.2s ease-in-out;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #3f64d7;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    font-size: 0.88rem;
    padding: 0.75rem 1rem 0.75rem 2.3rem;
  }

  /* Mobile */
  @media (max-width: 768px) {
    font-size: 0.85rem;
    padding: 0.7rem 1rem 0.7rem 2.2rem;
  }

  /* Small mobile */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.6rem 0.9rem 0.6rem 2rem;
  }

  /* Large desktop */
  @media (min-width: 1440px) {
    font-size: 0.88rem;
    padding: 0.75rem 1rem 0.75rem 2.3rem;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1rem 1.5rem 1rem 3rem;
    border-radius: 8px;
  }
  @media (min-width: 3840px) {
    font-size: 1.8rem;
    padding: 1rem 1.5rem 1rem 3rem;
    border-radius: 8px;
  }
`;


export const AddFieldButton = styled.button`
   background: #3352BA;
  color: white;
  border: none;
  padding: clamp(0.5rem, 1vw, 1rem) clamp(1rem, 2vw, 2rem);
  border-radius: 15px;
  display: flex; 
  align-items: center;
  gap: clamp(0.3rem, 0.5vw, 1rem);
  font-size: clamp(0.9rem, 1vw, 1rem);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #2744a3;
  }

  @media (min-width: 1440px) {
    font-size: clamp(0.9rem, 0.8vw, 1rem);
    padding: clamp(0.8rem, 1vw, 1rem) clamp(1.5rem, 2vw, 2rem);
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1rem 3rem;
    gap: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2.5rem;
    padding: 1.3rem 4.5rem;
    gap: 1.2rem;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, 1fr);



  @media (min-width: 1940px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1440px) {
    grid-template-columns: repeat(4, 1fr);
  }
 @media (max-width: 1439px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
  
      @media (min-width: 2560px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const Card = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  aspect-ratio: 1.7 / 1;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2rem;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }

  .employee-count {
    font-weight: 600;
    font-size: 1rem;
  }

  /* Tablet */
  @media (max-width: 1024px) {
    padding: 1.8rem;
    .employee-count {
      font-size: 0.95rem;
    }
  }

  /* Mobile */
  @media (max-width: 768px) {
    padding: 1.5rem;
    .employee-count {
      font-size: 0.9rem;
    }
  }

  /* Small Mobile */
  @media (max-width: 480px) {
    padding: 1rem;
    .employee-count {
      font-size: 0.8rem;
    }
  }

  /* Large screens (Full HD and above) */
  @media (min-width: 1440px) {
    padding: 2.5rem;
    .employee-count {
      font-size: 1.1rem;
    }
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    padding: 3rem;
    .employee-count {
      font-size: 1.3rem;
    }
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .menu-icon {
    font-size: 1.3rem;
    color: #555;
    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #3f64d7;
    }
  }

  @media (max-width: 768px) {
    .menu-icon {
      font-size: 1.1rem;
    }
  }

  @media (min-width: 2560px) {
    .menu-icon {
      font-size: 1.8rem;
    }
  }
`;

export const CardTitle = styled.h2`
  font-family: "Raleway", sans-serif;
  font-weight: 800;
  font-style: normal;
  color: #172554;
  font-size: 22px;
  margin: 0 0 0.2rem 0;
  line-height: 100%;
  letter-spacing: 0%;

  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }

  @media (max-width: 1024px) {
    font-size: 1rem;
  }
   @media (min-width: 1025px) {
    font-size: 1rem;
  }
  @media (min-width: 1440px) {
    font-size: 1.2rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.3rem;
  }
    @media (min-width:3840px) {
    font-size: 1.5rem;
    padding: 1rem;
  }
`;

export const Divider = styled.div`
  height: 1px;
  width: 40px;
  background-color: #ccc;

  @media (max-width: 768px) {
    width: 30px;
  }

  @media (max-width: 480px) {
    width: 25px;
  }

  @media (min-width: 1440px) {
    width: 50px;
  }

  @media (min-width: 2560px) {
    width: 60px;
  }
`;

export const CardTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 1px solid gray;

  @media (max-width: 768px) {
    gap: 0.4rem;
  }

  @media (min-width: 2560px) {
    gap: 0.8rem;
  }
`;

export const CardText = styled.p`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0 0.2rem 0;
  color: #172554;
  font-size: 0.9rem;

  .employee-count {
    font-weight: 600;
    color: #172554;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
@media (max-width: 1024px) {
    font-size: 0.8rem;
  }
  @media (min-width: 1440px) {
    font-size: 0.8rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
  }
`;

export const CardFooter = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
justify-content: space-between;
  @media (max-width: 768px) {
    gap: 0.4rem;
  }

  @media (min-width: 2560px) {
    gap: 1rem;
  }
`;

export const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #b4c5ff;
  color: #172554;
  font-family: "Trispace", sans-serif;
  font-weight: 400;
  font-size: 12px;
  border-radius: 6px;
  padding: 5px;

  img {
    width: 15px;
    height: 15px;
    background-color: #172554;
    border-radius: 50%;
  }

  @media (max-width: 900px) {
    font-size: 15px;
    padding: 0.4rem 0.5rem;
    img {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    font-size: 10px;
    img {
      width: 15px;
      height: 15px;
    }
  }
  @media (max-width: 1024px) {
    font-size: 10px;
    img {
      width: 12px;
      height: 12px;
    }
  }
  
  @media (min-width: 1440px) {
    font-size: 0.7rem;
    img {
      width: 1rem;
      height: 1rem;
    }
  }

  @media (min-width: 2560px) {
    font-size: 15px;
    padding: 0.4rem 0.8rem;
    img {
      width: 26px;
      height: 26px;
    }
  }
   @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 0.4rem 0.8rem;
    img {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
`;

export const StatusTag = styled.span`
  background-color: ${(props) => props.$lightbg};
  color: ${(props) => props.$color};
  border: 1.5px solid ${(props) => props.$color};
  margin-left: 0.5rem;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
`;
