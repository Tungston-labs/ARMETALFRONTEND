import styled from "styled-components";
import { FiSearch } from "react-icons/fi";

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 40px;
`;

export const CardContainer = styled.div`
  //   display: flex;
  align-items: center;
  gap: 1rem;
  //   width: 300px;
  position: relative;
  @media (min-width: 3840px) {
    padding-inline: 4rem;
  }
`;

export const Initial = styled.div`
  width: clamp(35px, 3vw, 90px);
  height: clamp(35px, 3vw, 90px);
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 1);
  color: #ecf8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-family: Satoshi;
  font-size: clamp(5rem, 3vw, 9rem); /* responsive font */
  padding-right: clamp(5px, 1vw, 18px);
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    color: #cad2ed;
  }

  /* Extra-large screens (2K TVs) */
  @media (min-width: 2560px) {
    width: 120px;
    height: 120px;
    font-size: 10rem;
    padding-right: 25px;
  }

  /* 4K screens */
  @media (min-width: 3840px) {
    width: 150px;
    height: 150px;
    font-size: 15rem;
    padding-right: 120px;
  }
`;

export const InfoSection = styled.div`
  flex-grow: 1;
`;

export const Title = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`;

export const SubTitle = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

export const HeadRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
`;

export const Avatar = styled.img`
  height: 24px;
  width: 24px;
  border-radius: 50%;
`;

export const HeadName = styled.div`
  font-size: 0.95rem;
`;

export const Count = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
`;

export const Icon = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
`;
export const DateInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 7px;
  background-color: #fff;
  width: 120px;
`;
export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;
export const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.7rem 0;
  // border-bottom: 2px solid #ddd;
`;
export const Tab = styled.div`
  padding: 5px 20px;
  cursor: pointer;
  background: #304eb0;
  font-weight: 500;
  background: ${({ active }) => (active ? "3px solid #1e3a8a" : "none")};
  color: ${({ active }) => (active ? "white" : "#555")};
`;
export const SearchWrapper = styled.div`
  position: relative;
  display: inline-block;
  /* width: 100%; */
  max-width: 240px; 
`;

export const SearchInput = styled.input`
  padding: 0.8rem 1rem;
  border: 1px solid #172554;
  border-radius: 6px;
  width: 100%;
  font-family: "Satoshi";
  height: 30px;
  font-size: 0.7rem;
  box-sizing: border-box;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #021e82;
  }

  /* Laptop screens (≥1024px) */
  @media (min-width: 1024px) and (max-width: 1439px) {
    padding: 0.8rem 0.9rem;
    height: 30px;
    font-size: 0.8rem;
   
  }

  /* Large desktops (≥1440px) */
  @media (min-width: 1440px) and (max-width: 1919px) {
    padding: 0.9rem 1rem;
    height: 40px;
    font-size: 1rem;
  }

  /* Ultra-wide (≥2560px) */
  @media (min-width: 1920px) and (max-width: 2559px) {
    padding: 0.9rem 1rem;
    height: 50px;
    font-size: 1.5rem;
  }
@media (min-width: 2560px) and (max-width: 3839px) {
    padding: 0.9rem 1rem;
    height: 50px;
    font-size: 1.5rem;
  }
  /* 4K and above (≥3840px) */
  @media (min-width: 3840px) {
    padding: 1.5rem 4rem;
    height: 90px;
    font-size: 2rem;
    width: auto;
  }
`;
export const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  font-size: 1.2rem;
  pointer-events: none;
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;
export const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const HRManager = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0.3rem;
  border: 1px solid black;
  border-radius: 8px;
  background-color: rgb(178, 196, 243);
  font-size: 0.95rem;
  color: #333;

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
export const Subtitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-left: 10px;
  margin-top: -1px;
  color: #1e3a8a;
`;

export const CardRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* pushes count up & arrow down */
  align-items: flex-end;
  height: 100%; /* make it stretch full card height */
  padding: 0.3rem 0; /* small spacing so they don’t stick to edges */

  .card-value {
    font-weight: 700;
    font-size: clamp(
      1.2rem,
      3vw,
      1.5rem
    ); /* fluid scaling: mobile → desktop → large screens */
    color: #000;

    /* Ultra-large / 4K screens */
    @media (min-width: 3840px) {
      font-size: 3.5rem; /* very large screens */
    }
  }
  @media (min-width: 3840px) {
    svg {
      width: 40px;
      height: 40px;
    }
  }
  .arrow-icon {
    background: #fff;
    color: #34347c;
    width: clamp(32px, 4vw, 60px); /* bigger max for large screens */
    height: clamp(32px, 4vw, 60px);
    border-radius: 50%;
    font-size: clamp(1rem, 1.8vw, 2rem); /* larger on big screens */
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1rem;
  margin: 0.5rem;
  @media (min-width: 1600px) {
    gap: 1.5rem;
  }

  @media (min-width: 2560px) {
    /* QHD/2K large monitors */
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
    padding-block: 1rem;
  }

  @media (min-width: 3840px) {
    /* 4K screens */
    /* grid-template-columns: repeat(auto-fit, minmax(600px, 1fr)); */
        grid-template-columns: repeat(4, 1fr);

    gap: 3rem;
    padding: 2.5rem;
  }
`;
export const DeptTitle = styled.div`
  font-weight: bold;
  font-size: clamp(1rem, 1.8vw, 1.5rem);
  font-family: Raleway;
  line-height: 1.2;
  letter-spacing: 0%;
white-space: nowrap;        /* Keep text on one line */
  overflow: hidden;           /* Hide overflow */
  text-overflow: ellipsis;    /* Show '...' when truncated */
  max-width: 10ch;             /* Approx 7 characters width */
  /* Small devices */
  @media (max-width: 600px) {
    font-size: 0.9rem;
  }

  /* Medium devices (tablets) */
  @media (min-width: 601px) and (max-width: 1024px) {
    font-size: 1.05rem;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 1.15rem;
  }

  /* Extra-large / QHD */
  @media (min-width: 1601px) and (max-width: 2560px) {
    font-size: 1.5rem;
    padding-bottom: 0.2rem;
  }

  /* 4K screens */
  @media (min-width: 2560px) {
    font-size: 2rem;
  }
  @media (min-width: 3840px) {
    font-size: 3rem;
    padding-bottom: 0.5rem;
  }
`;

export const DeptSub = styled.div`
  font-size: clamp(0.75rem, 1.2vw, 2rem);
  color: #666;
  font-family: Raleway;
  line-height: 1.2;

  /* Small devices */
  @media (max-width: 600px) {
    font-size: 0.7rem;
  }

  /* Medium devices (tablets) */
  @media (min-width: 601px) and (max-width: 1024px) {
    font-size: 0.8rem;
  }

  /* Large desktops */
  @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 0.6rem;
  }

  /* Extra-large / QHD */
  @media (min-width: 1601px) and (max-width: 2560px) {
    font-size: 1rem;
  }

  @media (min-width: 2560px) {
    font-size: 1.4rem;
  }
  /* 4K screens */
  @media (min-width: 3840px) {
    font-size: 2.5rem;
  }
`;

export const DeptHead = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  font-family: Raleway;

  span {
    font-size: clamp(0.75rem, 1.2vw, 0.95rem);

    /* Small devices */
    @media (max-width: 600px) {
      font-size: 0.7rem;
    }

    /* Medium devices (tablets) */
    @media (min-width: 601px) and (max-width: 1024px) {
      font-size: 0.8rem;
    }

    /* Large desktops */
    @media (min-width: 1025px) and (max-width: 1600px) {
      font-size: 0.9rem;
    }

    /* Extra-large / QHD */
    @media (min-width: 1601px) and (max-width: 2560px) {
      font-size: 0.95rem;
    }
    @media (min-width: 2560px) {
      font-size: 1.2rem;
    }
    /* 4K screens */
    @media (min-width: 3840px) {
      font-size: 2rem;
    }
  }
`;

export const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: clamp(0.8rem, 1.5vw, 1rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    ${DeptTitle},
    ${DeptSub},
    ${DeptHead} span,
    ${CardRight} .card-value {
      color: rgb(62, 101, 200);
    }

    ${CardRight} .arrow-icon {
      background-color: rgb(51, 51, 192);
      color: white;
    }

    ${Initial} {
      color: #1a73e8;
      transform: scale(1.1);
    }
  }

  h3 {
    font-size: clamp(0.9rem, 1.8vw, 1.05rem);
    font-weight: 600;
    margin: 0;
    color: #000;
    font-family: "Satoshi";
  }

  .head-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;

    img {
      width: clamp(20px, 2.5vw, 24px);
      height: clamp(20px, 2.5vw, 24px);
      border-radius: 50%;
      object-fit: cover;
    }

    .head-name {
      font-size: clamp(0.7rem, 1.5vw, 0.85rem);
      margin: 0;
      font-weight: 500;
      color: #000;
    }
  }

  @media (min-width: 3840px) {
    /* 4K */
    padding: 2rem;
    h3 {
      font-size: 2rem;
    }
    .head-row img {
      width: 48px;
      height: 48px;
    }
    .head-row .head-name {
      font-size: 1.2rem;
    }
  }
`;

export const DeptInfo = styled.div`
  flex: 1;
  margin: 0 clamp(0.5rem, 1vw, 1rem);
`;

export const HeadImg = styled.img`
  width: clamp(24px, 3vw, 28px);
  height: clamp(24px, 3vw, 28px);
  border-radius: 50%;

  @media (min-width: 3840px) {
    width: 48px;
    height: 48px;
  }
`;
