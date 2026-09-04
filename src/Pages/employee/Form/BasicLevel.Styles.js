// AddEmployeeForm.styles.js
import styled from 'styled-components';
import { FaPlus } from "react-icons/fa6";

export const Container = styled.div`
  padding: 20px;
  font-family: Satoshi;
  box-sizing: border-box;
background-color:white;  
  /* Mobile screens */
  @media (max-width: 480px) {
    padding: 1rem;
  }

  /* Tablets */
  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  /* Full HD (1920px) */
  @media (min-width: 1920px) {
    padding: 2.5rem;
  }

  /* 4K (3840px) */
  @media (min-width: 3840px) {
    padding: 3rem 4rem;
  }

  /* 8K (7680px) */
  @media (min-width: 7680px) {
    padding: 5rem 6rem;
  }
`;


export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
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
export const InfoGrid = styled.div`
  display: flex;
  gap: 10px;
  // margin-bottom: 2rem;
  width:100%;
      // justify-content: space-between;

`;

export const ProfileImage = styled.img`
  width: 10rem;
  height: 10rem;
  border-radius: 10%;
  object-fit: cover;

  @media (max-width: 768px) {
    width: 50px;
    height: 60px;
  }

  @media (max-width: 480px) {
    width: 20px;
    height: 30px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 1rem 0.8rem;
  font-size: 1rem;
  color: black;
  border-radius: 7px;
  border: 1px solid #052DB4;
  background: #FFF;
  box-sizing: border-box;
  margin-top: 5px;

  /* Small screens */
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.7rem;
  }

  /* Medium screens */
  @media (min-width: 769px) and (max-width: 1020px) {
    font-size: 1.1rem;
    padding: 0.5rem 0.7rem;
  }

  @media (min-width: 1440px) {
    font-size: 1rem;
    padding: 0.9rem 0.9rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.2rem;
    padding: 0.8rem 1.2rem;
    /* margin-bottom: 1rem; */
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1.2rem 1.5rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
  }
`;



export const Label = styled.label`
  color: #3352BA;
  font-weight: 400;
  /* margin-bottom: 0.4rem; */
  font-size: 0.9rem; /* default for small devices */

  /* Small phones */
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }

  /* Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.8rem;
  }

  /* Laptops & Desktops */
  @media (min-width: 769px) and (max-width: 1020px) {
    font-size: 0.95rem;
  }
  @media (min-width: 1021px) and (max-width: 1440px) {
    font-size: 1.05rem;
  }
  @media (min-width: 1441px) and (max-width: 1920px) {
    font-size: 1rem;
  }

  /* 2K screens */
  @media (min-width: 1921px) and (max-width: 2560px) {
    font-size: 1.5rem;
  }

  /* 4K screens */
  @media (min-width: 2561px) and (max-width: 3839px) {
    font-size: 1.8rem;
  }

  /* 8K screens */
  @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;



export const TextArea = styled.textarea`
  width: 99%;
  min-height: 120px;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  margin-bottom: 2rem;
  color:black;
  
`;

export const SectionTitle = styled.h4`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #000;
  font-family: Satoshi;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3;


  font-size: clamp(1rem, 1.2vw, 2rem);


  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 3rem;
  }
`;


export const TwoColumn = styled.div`
  // display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  width: 30%;
  margin-top:10px;
  
`;

export const ThreeColumn = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  width: 90%;

`;

export const FlexRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem; /* default gap */
  margin-top: 2rem; /* default top margin */
  flex-wrap: wrap;

  /* Medium screens */
  @media (min-width: 1020px) {
    gap: 1.5rem;
    margin-top: 2.5rem;
  }

  @media (min-width: 1440px) {
    gap: 2rem;
    margin-top: 3rem;
  }

  @media (min-width: 1920px) {
    gap: 2.5rem;
    margin-top: 4rem;
  }

  @media (min-width: 2560px) {
    gap: 3rem;
    margin-top: 5rem;
  }

  @media (min-width: 3840px) {
    gap: 4rem;
    margin-top: 6rem;
  }

  @media (min-width: 7680px) {
    gap: 5rem;
    margin-top: 7rem;
  }
`;

export const ActionButton = styled.button`
  padding: clamp(0.4rem, 0.8vw, 1rem) clamp(1rem, 2vw, 2rem); /* vertical & horizontal padding responsive */
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: clamp(0.9rem, 1vw, 1.2rem);  /* responsive font size */
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    padding: 1rem 2.5rem;
    font-size: 1.4rem;
  }

  /* 8K screens */
  @media (min-width: 7680px) {
    padding: 1.2rem 3rem;
    font-size: 1.6rem;
  }
`;

export const ApproveButton = styled(ActionButton)`
  background-color: #172554;
  color: white;
  /* width: 100px; */
  /* height: 40px; */
  font-size: 1rem;

  /* Center the text */
  display: flex;
  align-items: center;   /* vertical center */
  justify-content: center; /* horizontal center */
  text-align: center;

  @media (min-width: 1020px) {
    width: 120px;
    height: 45px;
    font-size: 1.1rem;
  }

  @media (min-width: 1440px) {
    /* width: 140px; */
    /* height: 50px; */
    font-size: 1.2rem;
  }

  @media (min-width: 1920px) {
    /* width: 160px; */
    /* height: 55px; */
    font-size: 1.3rem;
  }

  @media (min-width: 2560px) {
    width: 180px;
    height: 60px;
    font-size: 1.5rem;
  }

  @media (min-width: 3840px) {
    width: 220px;
    height: 70px;
    font-size: 2rem;
  }

  @media (min-width: 7680px) {
    width: 300px;
    height: 80px;
    font-size: 2.5rem;
  }
`;


export const FormGroups = styled.div`
  // margin-bottom: 0.2rem;
  width: 100%;
`;
export const ErrorText = styled.p`
  color: red;
  font-size: clamp(0.7rem, 0.8vw, 1rem); 
  margin-bottom: 0.3rem;

  /* Larger screens (4K) */
  @media (min-width: 3840px) {
    font-size: 1.8rem;
  }

  /* Ultra large screens (8K) */
  @media (min-width: 7680px) {
    font-size: 2rem;
  }
`;


export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 12px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

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
export const EmployeeImage = styled.img`
  height: clamp(50px, 8vw, 120px); /* scales between 50px and 120px */
  width: auto; /* maintain aspect ratio */
  
  @media (min-width: 768px) {
    height: clamp(20px, 6vw, 20px);
  }

  @media (min-width: 1024px) {
    height: clamp(20px, 4vw, 50px);
  }

  @media (min-width: 1440px) {
    height: clamp(50px, 1vw, 80px);
  }

  @media (min-width: 2560px) {
    height: clamp(80px, 1vw, 100px);
  }

  @media (min-width: 3840px) {
    height: clamp(100px, 3vw, 200px);
  }`;


export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;
export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;

`;



export const InfoSection = styled.div`
  width: 60%;
  // padding: 1rem 0;
  margin-left:5%;
  
`;


export const FullWidthInput = styled.input`
  width: 99%;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 7px;
  border: 1px solid #052DB4;
  background: #FFF;
  color: black;


  &:focus {
    outline: none;
    border-color: #3352BA;
    box-shadow: 0 0 4px rgba(5, 45, 180, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.7rem;
  }

  /* Medium screens */
  @media (min-width: 769px) and (max-width: 1020px) {
    font-size: 1.1rem;
    padding: 0.5rem 0.7rem;
  }

  @media (min-width: 1440px) {
    font-size: 1rem;
    padding: 0.9rem 0.9rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.2rem;
    padding: 0.8rem 1.2rem;
    /* margin-bottom: 1rem; */
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1.2rem 1.5rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
  }
`;

export const TwoColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 2vw, 2.5rem);
  margin-top: 0;
  width: 99%;

  /* Mobile (stack to 1 column) */
  @media (max-width: 768px) {
    /* grid-template-columns: 1fr; */
    gap: 1rem;
  }

  /* Large screens (more breathing space) */
  @media (min-width: 1920px) {
    gap: 3rem;
  }

  /* 4K */
  @media (min-width: 3840px) {
    gap: 4rem;
  }

  /* 8K */
  @media (min-width: 7680px) {
    gap: 6rem;
  }
`;

export const TwoColumnRows= styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width:98%;
  margin-top:15px;
  
`;

export const Stepper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2rem 0;
  max-width: 500px;
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

export const FormSection = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  h3 {
    margin-bottom: 1rem;
  }

  h4 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #333;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const FormGroup = styled.div`
  flex: 1;
  min-width: 180px;
`;

export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
`;

export const Button = styled.button`
  background: #003366;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 2rem;
  cursor: pointer;

  &:hover {
    background: #002244;
  }
`;

export const IconWrapper = styled.div`
  width: 10rem;
  height: 10rem;
  border-radius: 10%;
  border: 1px solid #ccc;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
`;
export const ColumnRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
   column-gap: 3rem;
  width:98%;
`;

export const Select = styled.select`
  width: 100%;
  padding: 1rem 0.8rem;
  font-size: 1rem;
  border-radius: 7px;
  border: 1px solid #052DB4;
  background: #FFF;
  color: black;
margin-top:5px;


  /* Native dropdown reset + custom arrow */
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #3352BA;
    box-shadow: 0 0 4px rgba(5, 45, 180, 0.3);
  }

    /* Small screens */
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.7rem;
  }

  /* Medium screens */
  @media (min-width: 769px) and (max-width: 1020px) {
    font-size: 1.1rem;
    padding: 0.5rem 0.7rem;
  }

  @media (min-width: 1440px) {
    font-size: 1rem;
    padding: 0.9rem 0.9rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.2rem;
    padding: 0.8rem 1.2rem;
    /* margin-bottom: 1rem; */
  }

  @media (min-width: 2560px) {
    font-size: 1.5rem;
    padding: 1.2rem 1.5rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
  }
`;

export const UploadWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #052DB4;
  border-radius: 7px;
  padding: clamp(0.6rem, 1vw, 0.9rem);
  cursor: pointer;
  background-color: #fff;
  // font-size: clamp(0.8rem, 1vw, 1rem);

  &:hover {
    border-color: #3352BA;
    box-shadow: 0 0 4px rgba(5, 45, 180, 0.3);
  }

   @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.5rem;
    padding: 1rem 1rem;
    margin-bottom:1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom:1rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.3rem;
    padding: 1.4rem 2rem;
    margin-bottom:1rem;
  }
`;


export const FileName = styled.span`
  flex: 1;
  color: ${(props) => (props.hasFile ? "#000" : "#999")};
  font-size: clamp(0.75rem, 0.9vw, 1rem);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const PlusIcon = styled(FaPlus)`
  color: #3352BA;
  font-size: clamp(1rem, 1.2vw, 1.4rem);
  margin-left: 0.5rem;

  @media (min-width: 3840px) {
    font-size: 1.6rem;
  }

  @media (min-width: 7680px) {
    font-size: 2rem;
  }
`;


export const UploadWrappers = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

export const ProfileLabel = styled.label`
  cursor: pointer;
  display: inline-block;
`;

export const ProfileImages = styled.img`
  width: clamp(60px, 12vw, 300px);  /* auto-resizes between small and large screens */
  height: clamp(60px, 12vw, 300px);
  border-radius: 10%;               /* square with 10% rounded corners */
  object-fit: cover;
  border: 2px solid #052DB4;

  /* Small screens */
  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
  }

  /* Tablets */
  @media (min-width: 768px) and (max-width: 1024px) {
    width: 120px;
    height: 120px;
  }

  /* Normal laptops/desktops */
  @media (min-width: 1440px) {
    width: 200px;
    height: 200px;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    width: 260px;
    height: 260px;
  }

  /* 8K screens */
  @media (min-width: 7680px) {
    width: 300px;
    height: 300px;
  }
`;

export const IconWrappers = styled.div`
  width: clamp(60px, 12vw, 300px);
  height: clamp(60px, 12vw, 300px);
  border-radius: 10%;                
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #3352BA;
  color: #3352BA;
  background: #f8f9fa;

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    width: 120px;
    height: 120px;
  }

  @media (min-width: 1440px) {
    width: 200px;
    height: 200px;
  }

  @media (min-width: 2560px) {
    width: 260px;
    height: 280px;
  }

  @media (min-width: 7680px) {
    width: 300px;
    height: 300px;
  }
`;



export const PlusButtons = styled.label`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #001F3F;
  color: white;
  border-radius: 50%;
  width: clamp(1rem, 2vw, 3rem);
  height: clamp(1rem, 2vw, 3rem);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(12px, 1vw, 18px);
  cursor: pointer;
`;

export const HiddenFileInputs = styled.input`
  display: none;
`;