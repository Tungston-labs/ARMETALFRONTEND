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
  /* gap: 0.2rem; */
  flex: 1;
  min-width: 250px;
`;

export const RightSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;

  min-width: 300px;
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


export const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // margin-bottom: 1rem;
`;

// export const Label = styled.label`
//   font-size: 0.9rem;
//   font-weight: 500;
//   // margin-bottom: 0.3rem;
//   color: #052DB4;
// `;

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
  gap: 1rem; /* adds vertical spacing */
`;

export const Button = styled.button`
  display: block; /* makes margin: auto work */
  margin: 1rem auto 0 auto; /* top: 1rem, auto on left/right to center */
  background: #172554;
  color: white;
  border: none;
  padding: 0.6rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  text-align: center;
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
    border-radius: 7px;
    border: 1px solid #052db4;
    background: #fff;
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
  align-items: flex-start;
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
  width: 10px;
  height: 10px;
  border-radius: 10%;
  object-fit: cover;
  /* style={{ width: 150, height: 150, borderRadius: "10%", objectFit: "cover" }} */
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

export const FullPageLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
`;
