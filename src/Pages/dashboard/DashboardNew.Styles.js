import styled from "styled-components";

export const Container = styled.div`
  padding: 0.5rem;
  box-sizing: border-box;
  background: #f4f4f4;
  /* Allow scrolling if content overflows */
  min-height: 100vh;  
  width: 100%;
  overflow-x: auto;
  overflow-y: auto; 

 padding-top: 70px;
  @media (min-width: 1440px) {
    padding:1rem;
     padding-top: 50px;
  }
  @media (min-width: 1920px) {
     padding-top: 70px;
  }
`;


export const CardGrid = styled.div`
  display: grid;
  gap: 1rem;

  /* Default (desktop) */
  grid-template-columns: repeat(3, 1fr);

  /* Tablet */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;


export const Card = styled.div`
  background: white;
  border-radius: 10px;
  display: flex;
  // align-items: flex-start;
  padding: 1rem;
  position: relative;
    font-family:"satoshi";
`;

export const LeftIcon = styled.div`
  flex-shrink: 0;
`;

export const VerticalBar = styled.div`
  width: clamp(2px, 0.5vw, 6px); /* auto-scales between 2px–6px */
  background: #3352BA;
  margin: 0 clamp(0.5rem, 2vw, 1.5rem);

  /* Adjust height if it's meant to fill parent */
  height: 100%;

  @media (max-width: 768px) {
    width: clamp(2px, 1vw, 4px);
    margin: 0 0.5rem;
  }

  @media (max-width: 480px) {
    width: 2px;
    margin: 0 0.3rem;
  }
`;


export const CardContent = styled.div`
  flex: 1;
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;

`;
export const CardList = styled.ul`
  list-style: none;
  padding: 8px;
  margin: 0;
  font-size: 0.9rem;

  li {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; /* Desktop: 3 columns */
    padding: 5px 0;
    border-bottom: 1px solid #eee;
    align-items: center;
    text-align: left;
  }

  /* Tablet: 2 columns */
  @media (max-width: 1024px) {
    li {
      grid-template-columns: 1fr 1fr;
      grid-row-gap: 8px;
    }
  }

  /* Mobile: 1 column */
  @media (max-width: 600px) {
    li {
      grid-template-columns: 1fr;
      grid-row-gap: 6px;
    }
  }
`;



export const Icon = styled.div`
  position: absolute;
  right: 10px;
  bottom: 1px;
  cursor: pointer;
  color: blue;
  transition: transform 0.3s ease, color 0.3s ease;
font-size:20px;
  &:hover {
    transform: scale(1.3); /* Zoom in */
    color: darkblue; /* Optional color change */
  }
`;




export const DepartmentGrid = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  overflow-x: auto;
  padding-bottom: 1.5rem;
width:66%;
  /* Optional: Hide scrollbar in a nice way */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: #f0f0f0;
  }
`;


export const DepartmentCard = styled.div`
  flex: 1;
  min-height: 150px;
  min-width: 250px;
  max-width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap; /* ✅ allows wrapping on smaller screens */
  box-sizing: border-box;

  h4 {
    margin: 0;
    font-size: 1rem;
    font-family: "Raleway", sans-serif;
    word-break: break-word;
  }

  p {
    margin: 4px 0;
    font-size: 1rem;
    font-family: "Raleway", sans-serif;
    word-break: break-word;
  }

  strong {
    font-size: 1rem;
    color: #003366;
    font-family: "Raleway", sans-serif;
  }

  /* ✅ Responsive behavior */
  @media (max-width: 1024px) {
    min-width: 200px;
    padding: 0.8rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    min-width: 100%;
    padding: 1rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    h4,
    p,
    strong {
      font-size: 0.9rem;
    }
  }
`;


export const Label = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #B5E2FF;
  font-family:"raleway";
`;

export const Heading = styled.h3`
  margin-top: 1.5rem;
  font-weight: 700;
  font-family: "Satoshi", sans-serif;
  line-height: 1.2;
  letter-spacing: 0;

  /* Responsive font size: min 18px, preferred 4vw, max 26px */
  font-size: clamp(15px, 3vw, 24px);
`;


export const DepartmentCalendarWrapper = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  align-items: flex-start;
  margin-bottom:3%;
`;

// export const DepartmentGrid = styled.div`
//   display: flex;
//   gap: 1rem;
//   flex-wrap: wrap;
//   width: 66%;
// `;

export const CalendarWrapper = styled.div`
  flex: 1;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  min-width: 300px;
 margin-top: 0;
  box-sizing: border-box;

  /* Ensure proper height scaling */
  width: 100%;
  max-width: 100%;
  overflow-x: auto;

  /* Responsive adjustments */
  @media (max-width: 1200px) {
    padding: 0.7rem;
    // margin-top: -40px;
  }

  @media (max-width: 992px) {
    padding: 0.8rem;
    // margin-top: -30px;
  }

  @media (max-width: 768px) {
    padding: 0.7rem;
    // margin-top: -20px;
    min-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    // margin-top: -10px;
    min-width: 100%;
  }
`;

export const PresenceContainer = styled.div`
  display: flex;
  // flex-wrap: wrap;
  gap: 2rem;
  width:100%;

`;

export const ChartContainer = styled.div`
  // flex: 1;
  min-width: 200px;
  background: white;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;

  h1 {
    font-size: 3rem;
    margin-bottom: 0.5rem;
      font-family:"satoshi"
  }

  p {
    font-weight: bold;
      font-family:"satoshi"
  }
`;
export const SubText = styled.div`
  margin-top: 2rem;
  font-size: 0.9rem;
  font-family:"raleway"
`;

export const ContractList = styled.div`
  flex: 1;
  min-width: 250px;
  background: white;
  padding: 10px;

  /* Tablet */
  @media (max-width: 1024px) {
    flex: 1;
    min-width: 200px;
  }

  /* Mobile */
  @media (max-width: 768px) {
    flex: 1 1 100%; /* takes full width */
    min-width: 100%;
  }
`;


export const ContractItem = styled.div`
  display: grid;
  grid-template-columns: 35px minmax(100px, 1fr) 80px 120px; 
  align-items: center;
  padding: 0.4rem 0;
  font-family: "satoshi";
  column-gap: 2px;

  p, small, span {
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    font-size: 0.95rem;
    font-weight: 500;
  }

  small {
    font-size: 0.8rem;
    color: #666;
    text-align: center;
  }

  span {
    font-size: 0.85rem;
    color: #333;
    text-align: right;
  }

  /* Tablet screens */
  @media (max-width: 1024px) {
    grid-template-columns: 35px minmax(120px, 1fr) 80px; 
    /* hide date */
    span:last-child {
      display: none;
    }
  }

  /* Mobile screens */
  @media (max-width: 768px) {
    grid-template-columns: 35px minmax(120px, 1fr); 
    /* avatar + name only */
    small, span {
      display: none;
    }
  }
`;

export const LeftSection = styled.div`
width:65%;
`;


export const Avatar = styled.div`
  font-size: 1.5rem;
  color: #999;
`;
export const HolidayCard = styled(Card)`
  background: #f4f4f4;
  flex-direction: column; 
  align-items: stretch;
  gap: 5px;
  padding: 1rem;
`;

export const HolidayItem = styled.div`
  display: flex;
  width: 100%;           
  max-width: 20rem;      /* default for normal screens */
  border: 1px solid #eee;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 8px;

  div {
    display: flex;
    flex-direction: column;
    max-width: 50%;
  }

  h4 {
    margin: 0;
    font-size: 1rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
  }

  p {
    margin: 0;
    font-size: 0.8rem;
    color: #777;
  }

  span {
    font-size: 0.9rem;
    color: #333;
    white-space: nowrap;
  }

  /* 📱 Mobile screens */
  @media (max-width: 768px) {
    max-width: 100%;     
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  /* 💻 QHD / 2K screens */
  @media (min-width: 1440px) and (max-width: 2023px) {
    max-width: 40rem;   /* scale wider for 2K monitors */
  }

  /* 🖥️ Ultra-wide 4K+ screens */
  @media (min-width: 2024px) {
    max-width: 100%;    
  }
`;



export const SvgIcon = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
  flex-shrink: 0; 

  img, svg {
    width: 30px;
    height: 30px;
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top:-7%;
`;

export const UserMenuWrapper = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: #3352BA;
`;

export const DropdownIcon = styled.div`
  font-size: 14px;
  color: #3352BA;
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  background: #fff;
  box-shadow: 0px 4px 10px rgba(0,0,0,0.1);
  border-radius: 6px;
  overflow: hidden;
  min-width: 150px;
  z-index: 10;

  div {
    padding: 10px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s ease;

    &:hover {
      background: #f5f5f5;
    }
  }
    `;

  export const ResponsiveHr = styled.hr`
  border-top: 2px solid #3352ba;
  width: 66%;
  margin: 0;

  /* Tablet */
  @media (max-width: 1024px) {
    width: 50%;
  }

  /* Mobile */
  @media (max-width: 768px) {
    width: 100%;
  }
`;  
export const LineWithIcon = styled.div`
  position: relative;
  width: 66%;

  hr {
    border-top: clamp(1px, 0.3vw, 3px) solid #3352ba; /* responsive thickness */
    width: 100%;
    margin: 0;
  }
  svg {
    position: absolute;
    right: 0;
    top: -30px;
    color: #3352ba;
    cursor: pointer;
    transition: transform 0.3s ease, color 0.3s ease;
  }

  svg:hover {
    transform: scale(1.2);
    color: #1e3a8a; /* darker blue */
  }

  /* 📱 Tablet */
  @media (max-width: 1024px) {
    width: 80%;

     svg {
      display: none; /* 👈 hide icon on mobile */
    }
  }

  /* 📱 Mobile */
  @media (max-width: 768px) {
    width: 100%;

    svg {
      display: none; /* 👈 hide icon on mobile */
    }
  }
`;