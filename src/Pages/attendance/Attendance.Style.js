import styled from 'styled-components';

import { LuArrowLeft } from "react-icons/lu";

export const BackArrow = styled(LuArrowLeft)`
  cursor: pointer;
  width: clamp(20px, 2vw, 50px);
  height: clamp(20px, 2vw, 50px);
  @media (min-width: 2560px) {
    width: 60px;
    height: 60px;
  }

  @media (min-width: 3840px) {
    width: 80px;
    height: 80px;
  }

  @media (min-width: 7680px) {
    width: 120px;
    height: 120px;
  }
`;

export const Container = styled.div`
  background: white;
  // padding: 20px;
    padding: 20px 30px;
  font-family: sans-serif;
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

export const ProfileImage = styled.img`
  width: 65px;
  height: 65px;
  object-fit: cover;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
  @media (max-width: 1024px) and (min-width: 481px) {
    width: 70px;
    height: 80px;
  }
  @media (min-width: 1025px) and (max-width: 1440px) {
    width: 80px;
    height: 100px;
  }
@media (min-width: 1441px) and (max-width: 1920px) {
    width: 120px;
    height: 120px;
  }

@media (min-width: 1921px) and (max-width: 2560px) {
    width: 170px;
    height: 170px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    width: 250px;
    height: 250px;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1;
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;

export const DateNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const DateNavCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  gap: 1rem;
  font-weight: bold;

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }

  span {
    min-width: 180px;
    text-align: center;
  }
`;

export const DateBox = styled.div`
  input[type='date'] {
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
  }
`;

export const TableScroll = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 400px; 
  border-radius: 8px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
  @media (max-width: 1024px) {
    max-height: 250px; 
}
 
      @media (min-width: 2540px) and (max-width: 3819px)  {
    max-height: 700px;
  }
      @media (min-width: 3820px) {
    max-height:1200px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1rem;

  th {
    background: #304EB0;
    padding: clamp(0.5rem, 1vw, 0.8rem);
    text-align: center;
    color: white;
    font-size: clamp(0.85rem, 1vw, 1rem);
  }

  @media (max-width: 768px) {
    th {
      font-size: 1rem;
      padding: 0.5rem;
    }
  }
  @media (min-width: 2560px) {
    th {
      font-size: 2rem;
      padding: 1rem;
    }
  }
  @media (min-width: 3840px) { 
    th {
      font-size: 2.5rem;
      padding: 1.5rem;
    }
  }
  @media (min-width: 7680px) { 
    th {
      font-size: 2rem;
      padding: 2rem;
    }
  }
`;

export const TableRow = styled.tr`
  background: #fff;
  border: 1px solid #ddd;
`;

export const TimeCell = styled.td`
  padding: clamp(0.5rem, 1vw, 0.8rem);
  text-align: center;
  width: 20%;
  font-weight: bold;
  font-size: clamp(0.85rem, 1vw, 0.95rem);

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    background: #304EB0;
    color: white;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: #FD907B;
    color: white;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1.5rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.8rem;
  }

  @media (min-width: 7680px) {
    font-size: 2%.2;
    padding: 2rem;
  }
`;

export const TimeRange = styled.td`
  text-align: center;
  color: #555;
  font-size: clamp(0.75rem, 0.9vw, 0.85rem);
  padding: clamp(0.5rem, 0.8vw, 0.8rem);

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.4rem;
  }

  @media (min-width: 2560px) {
    font-size: 1rem;
    padding: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.3rem;
    padding: 1.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.7rem;
    padding: 2rem;
  }
`;

export const TimeIcon = styled.span`
  margin-right: 0.5rem;
  color: #888;
  font-size: clamp(0.8rem, 1vw, 1rem);

  @media (min-width: 2560px) {
    font-size: 1.2rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 2rem;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: clamp(0.5rem, 1vw, 0.8rem);
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-bottom: 2rem;
  font-size: clamp(0.85rem, 1vw, 1rem);

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.2rem;
    padding: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 1.5rem;
    padding: 1.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 2rem;
    padding: 2rem;
  }
`;


export const SectionTitle = styled.h4`
  // margin-top: 2rem;
  margin-bottom: 0.5rem;
  // color:black;

`;

export const TwoColumn = styled.div`
  // display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  width: 40%;
`;


export const Input = styled.input`
  padding: clamp(0.4rem, 1vw, 1rem) clamp(0.8rem, 2vw, 1.5rem);
  border: 1px solid #052DB4;
  border-radius: clamp(6px, 1vw, 12px);
  width: clamp(90%, 99%, 100%);
  margin-bottom: clamp(0.5rem, 1vw, 1.5rem);
  color: black;
  background: #FFF;
  font-size: clamp(14px, 1vw, 20px);

  &:focus {
    outline: none;
    border-color: #304EB0;
    box-shadow: 0 0 0 2px rgba(48, 78, 176, 0.2);
  }

  /* 2K / QHD screens */
  @media (min-width: 2560px) {
    padding: 1.5rem 2.5rem;
    font-size: 2rem;
    border-radius: 16px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    padding: 2rem 3rem;
    font-size: 2.5rem;
    border-radius: 20px;
  }

  /* 8K screens */
  @media (min-width: 7680px) {
    padding: 3rem 4rem;
    font-size: 3rem;
    border-radius: 25px;
  }
`;


export const InfoSection = styled.div`
  width: 55%;
  // padding: 1rem 0;
  // margin-left:10%;
`;

export const FullWidthInput = styled.input`
  width: 97%;
  padding: 0.6rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  height:40%;
  border-radius: 7px;
border: 1px solid #052DB4;
background: #FFF;
`;

export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:97%;
`;
export const TwoColumnRows= styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:99%;
`;
export const InfoGrid = styled.div`
  display: flex;
  gap: 1rem;
  // margin-bottom: 2rem;
  width:100%;
      // justify-content: space-between;

`;
export const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: clamp(10px, 2vw, 40px);
  position: relative; /* for absolute centering of DateDetails on large screens */
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
  @media (max-width: 1024px) {
    /* flex-direction: column; */
    gap: 2rem;
  }
`;

export const WorkingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;  

  strong {
    font-weight: 600;
    font-size: 28px; 
    color:#3352BA;
  }

  div {
    font-size: 26px; 
    font-weight: bold;
  }
     @media (max-width: 1920px) {
    gap: 12px;

    strong {
      font-size: 18px;
    }

    div {
      font-size: 16px;
    }
  }
 @media (max-width: 1440px) {
    gap: 12px;

    strong {
      font-size: 18px;
    }

    div {
      font-size: 16px;
    }
  }
  @media (max-width: 1024px) {
    gap: 12px;

    strong {
      font-size: 18px;
    }

    div {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    gap: 8px;

    strong {
      font-size: 16px;
    }

    div {
      font-size: 14px;
    }
  }
`;



export const DateDetails = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;

  .date-block {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h1 {
    font-size: 48px;
    font-weight: 600;
    margin: 0;
  }

  .month-day {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // gap: 4px;

    strong {
      font-size: 20px;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: 16px;
      color: #555;
    }
  }

  /* 📱 Small screens */
  @media (max-width: 768px) {
    position: static;
    transform: none;
    align-items: center;
    gap: 12px;

    .date-block {
      gap: 8px;
    }

    h1 {
      font-size: 28px;
    }

    .month-day {
      align-items: center;

      strong {
        font-size: 16px;
      }

      p {
        font-size: 14px;
      }
    }
  }

  /* 💻 Standard HD / Full HD */
  @media (min-width: 1440px) and (max-width: 1919px) {
    gap: 18px;

    h1 {
      font-size: 50px;
    }

    .month-day strong {
      font-size: 20px;
    }

    .month-day p {
      font-size: 20px;
    }
  }

  /* 🖥️ 2K Displays */
  @media (min-width: 1920px) and (max-width: 2559px) {
    gap: 22px;

    h1 {
      font-size: 48px;
    }

    .month-day strong {
      font-size: 20px;
    }

    .month-day p {
      font-size: 16px;
    }
  }

  /* 🖥️ 2.5K–3.8K Displays */
  @media (min-width: 2560px) and (max-width: 3839px) {
    gap: 30px;

    h1 {
      font-size: 80px;
    }

    .month-day strong {
      font-size: 28px;
    }

    .month-day p {
      font-size: 22px;
    }
  }

  /* 🖥️ 4K+ Displays */
  @media (min-width: 3840px) {
    gap: 40px;

    h1 {
      font-size: 110px;
    }

    .month-day strong {
      font-size: 34px;
    }

    .month-day p {
      font-size: 26px;
    }
  }
`;

export const DayBoxes = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px; 


  @media (min-width: 1440px) {
    gap: 2rem;
  }
  @media (min-width: 1920px) {
    gap: 3rem;
  }
  @media (min-width: 2560px) {
    gap: 3rem;
  }

  @media (min-width: 3840px) { /* 4K */
    gap: 4rem;
  }

  @media (min-width: 7680px) { /* 8K */
    gap: 5rem;
  }
`;

export const DayBox = styled.div`
  background-color: #f3f3f3;
  padding: 10px;
  width: 70px;
  text-align: center;
  border-radius: 6px;
  color: ${(props) => (props.isFuture ? "#aaa" : "#000")};
  strong {
    text-decoration: underline;
    font-weight: 600;
    font-size: 16px;
    color: ${(props) => (props.isFuture ? "#aaa" : "#000")};
    @media (min-width: 2560px) {
      font-size: 1.3rem;
    }
    @media (min-width: 3840px) {
      font-size: 2rem;
    }
    @media (min-width: 7680px) {
      font-size: 2.5rem;
    }
  }

  div {
    margin-top: 6px;
    margin-bottom:0.3rem;
    font-size: 14px;
color: ${(props) => (props.isFuture ? "#aaa" : "#000")};
    @media (min-width: 2560px) {
      font-size: 1.3rem;
      margin-top: 0.8rem;
    }

    /* 4K */
    @media (min-width: 3840px) {
      font-size: 2rem;
      margin-top: 1rem;
    }

    /* 8K */
    @media (min-width: 7680px) {
      font-size: 3rem;
      margin-top: 1.2rem;
    }
  }

  p {
    font-size: 12px;
    color: #525252ff;
    color: ${(props) => (props.isFuture ? "#aaa" : "#525252")};
    @media (min-width: 2560px) {
      font-size: 1.2rem;
    }

    @media (min-width: 3840px) {
      font-size: 1.5rem;
    }

    @media (min-width: 7680px) {
      font-size: 2.4rem;
    }
  }

  @media (min-width: 2560px) {
    width: 120px;
    /* padding: 1rem; */
  }

  @media (min-width: 3840px) {
    width: 150px;
    /* padding: 1.8rem; */
  }

  @media (min-width: 7680px) {
    width: 220px;
    padding: 2rem;
  }
`;



export const ActiveDayBox = styled(DayBox)`
  background: linear-gradient(180deg, #172554 0%, #3352ba 100%);
  color: #ffffff;

  strong,
  div,
  p {
    color: #ffffff;
  }

 
`;

export const TotalHours = styled.p`
  margin-top: clamp(10px, 1.5vw, 30px);
  font-size: clamp(14px, 1.2vw, 24px);
  font-weight: 500;

  strong {
    font-weight: 700;
  }

  /* Large screens (2K / QHD) */
  @media (min-width: 2560px) {
    font-size: 2.5rem;
    margin-top: 3rem;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    font-size: 3rem;
    margin-top: 4rem;
  }

  /* 8K screens */
  @media (min-width: 7680px) {
    font-size: 4rem;
    margin-top: 5rem;
  }
`;
