import styled from "styled-components";

export const Container = styled.div`
  padding: 2rem;
  font-family: Satoshi;
`;

export const Headers = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    margin: 0;
  }

  p {
    margin: 0.2rem 0 0;
    // font-size: 0.9rem;
    // color: #333;
  }
`;

export const ResponsiveH3 = styled.h3`
  font-family: Satoshi, sans-serif;
  font-weight: 700;
  color: #030303;

  /* Responsive font size */
  font-size: clamp(
    1rem,
    2vw,
    1.2rem
  ); /* min 1rem, max 2rem, scales with viewport */

  /* Optional: adjust margin for responsiveness */
  margin-top: clamp(0.5rem, 1vw, 1rem);
  margin-bottom: clamp(0.5rem, 1vw, 1rem);

  /* Ultra-large screens */
  @media (min-width: 3840px) {
    /* 4K */
    font-size: 3rem;
  }

  @media (min-width: 7680px) {
    /* 8K */
    font-size: 4rem;
  }
`;

export const EditButton = styled.button`
  display: flex; /* icon + text */
  align-items: center;
  justify-content: center; /* center content */
  gap: 0.4rem;
  padding: clamp(0.3rem, 0.5vw, 0.6rem);
  border: none;
  background: linear-gradient(
    180deg,
    rgba(23, 37, 84, 1) 50%,
    rgba(51, 82, 186, 1) 100%
  );
  color: white;
  border-radius: 8px;

  width: clamp(80px, 4vw, 100px);
  height: clamp(35px, 4vw, 40px);
  font-size: clamp(0.8rem, 0.9vw, 1rem);
  cursor: pointer;

  svg {
    font-size: clamp(0.9rem, 1vw, 1.2rem);
  }

  /* Ultra-large screens */
  @media (min-width: 3840px) {
    /* 4K */
    width: 150px;
    height: 60px;
    font-size: 1.2rem;

    svg {
      font-size: 1.4rem;
    }
  }

  @media (min-width: 7680px) {
    /* 8K */
    width: 200px;
    height: 80px;
    font-size: 1.6rem;

    svg {
      font-size: 2rem;
    }
  }
`;

export const Row = styled.div`
  display: flex;
  gap: 2.5rem;
  width: 100%;
  flex-wrap: wrap;
  align-items: flex-start;
`;

export const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
 
  flex: 1;
  min-width: 250px;
`;

export const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: rem;
  min-width: 300px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.7rem;
  height: 95px;
  border-radius: 7px;
  border: 1px solid #052db4;
  background: #fff;
  resize: none;
  font-size: 0.9rem; /* default font size */

  /* Small phones */
  @media (max-width: 480px) {
    font-size: 0.7rem;
    padding: 0.5rem;
    height: 80px;
  }

  /* Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.6rem;
    height: 90px;
  }

  /* Laptops & Desktops */
  @media (min-width: 769px) and (max-width: 1020px) {
    font-size: 0.9rem;
    padding: 0.7rem;
    height: 95px;
  }
  @media (min-width: 1021px) and (max-width: 1440px) {
    font-size: 1rem;
    padding: 0.8rem;
    height: 100px;
  }
  @media (min-width: 1441px) and (max-width: 1920px) {
    font-size: 1.1rem;
    padding: 0.9rem;
    height: 110px;
  }

  /* 2K screens */
  @media (min-width: 1921px) and (max-width: 2560px) {
    font-size: 1.3rem;
    padding: 1rem;
    height: 160px;
  }

  /* 4K screens */
  @media (min-width: 2561px) and (max-width: 3839px) {
    font-size: 1.5rem;
    padding: 1.2rem;
    height: 190px;
  }

  /* 8K screens */
  @media (min-width: 3840px) {
    font-size: 1.8rem;
    padding: 1.5rem;
    height: 230px;
  }
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // margin-bottom: 1rem;
`;

export const Label = styled.label`
  color: #3352ba;
  font-weight: 400;
  /* margin-bottom: 0.4rem; */
  font-size: 0.9rem;

  /* 📱 Small phones */
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }

  /* 📲 Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    font-size: 0.8rem;
  }

  /* 💻 Laptops & Desktops */
  @media (min-width: 769px) and (max-width: 1920px) {
    font-size: 1rem;
  }

  /* 🖥 4K screens */
  @media (min-width: 1921px) and (max-width: 3839px) {
    font-size: 1.8rem;
  }

  /* 🖥 8K screens */
  @media (min-width: 3840px) {
    font-size: 2rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.8rem;
  font-size: 1rem;
  color: black;
  border-radius: 7px;
  border: 1px solid #052db4;
  background: #fff;
  box-sizing: border-box;
  margin-bottom: 5px;
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.5rem 0.7rem;
  }

  /* Medium screens */
  @media (min-width: 1020px) {
    font-size: 1.1rem;
    padding: 0.6rem 0.9rem;
  }

  @media (min-width: 1440px) {
    font-size: 1rem;
    padding: 0.7rem 0.9rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.2rem;
    padding: 0.9rem 1.2rem;
    margin-bottom: 1rem;
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

export const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

export const Section = styled.div`
  //   padding: 2rem;
  background: white;
  font-family: sans-serif;
`;

export const Tabs = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(0.5rem, 2vw, 3rem); /* responsive gap between tabs */
  margin-bottom: clamp(1rem, 2vw, 2rem);
  flex-wrap: wrap; /* allows tabs to wrap on small screens */
  padding: clamp(0.5rem, 1vw, 1rem);
`;

export const Tab = styled.button`
  background: ${({ active }) => (active ? "#002ea3" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "#000")};
  border: ${({ active }) => (active ? "none" : "1px solid #ccc")};
  border-radius: 6px;
  padding: clamp(0.4rem, 1vw, 0.8rem) clamp(0.8rem, 2vw, 1.5rem); /* responsive padding */
  font-size: clamp(0.8rem, 1vw, 1.2rem); /* responsive font size */
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ active }) => (active ? "#002ea3" : "#f0f0f0")};
  }

  /* Large screens adjustments */
  @media (min-width: 1440px) {
    font-size: 1rem;
    padding: 0.8rem 1.6rem;
  }

  @media (min-width: 1960px) {
    font-size: 1.2rem;
    padding: 0.9rem 1.8rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.6rem;
    padding: 1rem 2rem;
  }

  @media (min-width: 3840px) {
    /* 4K */
    font-size: 2rem;
    padding: 1.2rem 2.2rem;
  }

  @media (min-width: 7680px) {
    /* 8K */
    font-size: 2.5rem;
    padding: 1.5rem 3rem;
  }
`;

export const GroupLabel = styled.h4`
  margin-bottom: 1rem;
`;

export const Rows = styled.div`
  display: flex;
  flex-wrap: wrap; /* wrap items on smaller screens */
  gap: 1rem; /* default gap */
  margin-bottom: 1rem;
  align-items: flex-start;
  background-color: #fff;

  /* Small phones */
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  /* Tablets */
  @media (min-width: 481px) and (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  /* Laptops & Desktops */
  @media (min-width: 769px) and (max-width: 1020px) {
    gap: 1rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 1021px) and (max-width: 1440px) {
    gap: 1.2rem;
    margin-bottom: 1.2rem;
  }

  @media (min-width: 1441px) and (max-width: 1920px) {
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  /* 2K screens */
  @media (min-width: 1921px) and (max-width: 2560px) {
    gap: 1.8rem;
    margin-top: 1.2rem;
  }

  /* 4K screens */
  @media (min-width: 2561px) and (max-width: 3839px) {
    gap: 2rem;
    margin-top: 1.2rem;
  }

  /* 8K screens */
  @media (min-width: 3840px) {
    gap: 2.5rem;
    margin-top: 1.2rem;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: clamp(0.6rem, 0.8vw, 1rem) clamp(0.8rem, 1vw, 1.2rem);
  border-radius: 7px;
  border: 1px solid #052db4;
  background: #fff;
  color: black;
  margin-top: 5px;
  /* Fluid responsive font size */
  font-size: clamp(0.75rem, 0.9vw, 1rem);

  /* Native dropdown reset + custom arrow */
  appearance: none;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:focus {
    outline: none;
    border-color: #3352ba;
    box-shadow: 0 0 4px rgba(5, 45, 180, 0.3);
  }

  /* Responsive refinements */
  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }

  @media (min-width: 1920px) {
    font-size: 1.5rem;
    padding: 1.2rem 1rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 3840px) {
    font-size: 2rem;
    padding: 1.5rem 2rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 7680px) {
    font-size: 1.3rem;
    padding: 1.4rem 2rem;
    margin-bottom: 1rem;
  }
`;


export const Column = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 1rem;  */
`;

export const Rowes = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;

  > input,
  > select {
    flex: 1;
    padding: 0.6rem 1rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    min-width: 0;
  }
`;
export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem; /* space between image and text */
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
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
  }
`;
export const Title = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 5px 0;
  color: #3250b5;
  font-family: "Satoshi";
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: 480px) {
    /* small tablet */
    font-size: 0.8rem;
  }

  @media (min-width: 768px) {
    /* tablet */
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    /* desktop */
    font-size: 1.5rem;
  }

  @media (min-width: 1440px) {
    /* large desktop / 2K */
    font-size: 2rem;
  }

  @media (min-width: 2560px) {
    /* 4K */
    font-size: 3em;
  }

  @media (min-width: 3840px) {
    /* 8K */
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

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;
export const HRManager = styled.div`
  display: flex;
  height: 30px;

  align-items: center;
  padding: 0.3rem;
  // border: 1px solid #ccc;
  // border-radius: 8px;
  background-color: #fff;
  font-size: 0.95rem;
  color: #333;
  // box-shadow: 0 0 4px rgba(0, 0, 0, 0.05);

  span {
    font-weight: 500;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const Rightside = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* aligns children to the right */
  gap: 0.5rem;
  margin-left: auto; /* pushes Rightside itself to the right if in a flex row */
`;

export const FormWrapper = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  height: auto;
  @media (min-width: 2560px) {
    height: auto;
    align-items: center;
  }
  @media (min-width: 3840px) {
    height: auto;
  }
`;
export const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
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
export const ImageColumn = styled.div`
  flex: 0 0 auto;

  img {
    width: 10rem;
    height: 10rem;
    border-radius: 10px;
    object-fit: cover;


     @media (min-width: 1024px) {
      width: 10rem;
      height: 12rem;
    }
 @media (min-width: 1440px) {
      width: 10rem;
      height: 15rem;
    }
     @media (min-width: 1940px) {
      width: 15rem;
      height: 20rem;
    }
 @media (min-width: 2560px) {
      width: 15rem;
      height: 20rem;
    }
    @media (min-width: 3840px) {
      width: 20rem;
      height: 25rem;
    }
  }
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
`;

export const UploadSection = styled.div`
  margin-bottom: 1.5rem;
  background: #f1f1f1;
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
    margin-bottom: 2rem;
  }
  @media (min-width: 3840px) {
    padding: 3rem;
    border-radius: 16px;
    margin-bottom: 2.5rem;
  }
  @media (min-width: 7680px) {
    padding: 4rem;
    border-radius: 18px;
  }
`;

export const LabelRow = styled.div`
  font-size: clamp(0.9rem, 1vw, 1.2rem);
  font-weight: 500;
  margin-bottom: clamp(0.5rem, 1vw, 1rem);
  background: white;
  color: #999999;
  padding: clamp(0.2rem, 0.5vw, 0.5rem);

  @media (min-width: 1440px) {
    font-size: 1rem;
    padding: 0.6rem;
  }
  @media (min-width: 1960px) {
    font-size: 1.2rem;
    padding: 0.7rem;
  }

`;

export const UploadButton = styled.button`
  background-color: #1e40af;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  padding: 8px 14px;
  width: 90px;
  height: 40px;
  font-size: 0.9rem;

  &:hover {
    background-color: #1c3aa9;
  }

  @media (min-width: 768px) {
    padding: 10px 18px;
    width: 120px;
    height: 50px;
   font-size: 0.9rem;
  }

  /* Small laptops */
  @media (min-width: 1024px) {
    padding: 12px 22px;
    width: 140px;
    height: 60px;
    font-size: 0.9rem;
  }

  @media (min-width: 1440px) {
    padding: 14px 26px;
    width: 150px;
    height: 60px;
    font-size: 1rem;
  }

`;


export const InlineUploadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; 
  background: #f1f1f1;
  padding: 10px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

export const Button = styled.button`
  background: ${({ secondary }) => (secondary ? "#9EABD8" : "#172554")};
  color: ${({ secondary }) => (secondary ? "#000" : "#fff")};
  padding: 0.7rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: ${({ secondary }) => (secondary ? "#aab3d0" : "#002244")};
  }
`;

export const SectionTitle = styled.h4`
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #000;
  font-family: Satoshi;
  font-style: normal;
  font-weight: 700;
  line-height: 1.3;

  /* Responsive font sizing */
  font-size: clamp(1rem, 1.2vw, 2rem);

  /* Adjust for ultra-wide screens */
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }

  @media (min-width: 7680px) {
    font-size: 3rem;
  }
`;
export const ImagePreviewRow = styled.div`
  display: flex;
  gap: 0.8rem;
`;

export const ImageBox = styled.div`
  width: clamp(80px, 10vw, 200px); /* min 80px, max 200px, grows with screen */
  height: clamp(60px, 8vw, 160px); /* min 60px, max 160px, grows with screen */
  border-radius: 10px;
  border: 1px solid #ccc;
  overflow: hidden;
  background-color: #f8f8f8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* Ultra-large screens adjustments */
  @media (min-width: 3840px) {
    /* 4K */
    width: 300px;
    height: 240px;
  }

  @media (min-width: 7680px) {
    /* 8K */
    width: 400px;
    height: 320px;
  }
`;
