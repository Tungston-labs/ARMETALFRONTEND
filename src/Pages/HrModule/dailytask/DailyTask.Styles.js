import styled, { css } from 'styled-components';

const colors = {
  primaryDark: '#172554',
  primary: '#3352BA',
  secondary: '#3352BA',
  background: ' #f4f8ff;',
  panelBg: '#FFFFFF',
  text: '#212121',
  lightText: '#757575',
  borderColor: '#E0E0E0',
  shadowLight: 'rgba(0, 0, 0, 0.08)',
  shadowMedium: 'rgba(0, 0, 0, 0.2)',
  activeBg: '#E8EBF5',
  hoverBg: '#f1f7ffff',
  selectedEmployee: '#e9f2ffff',
  warningBg: '#FFF3E0',
  warningText: '#FF9800',
  infoText: '#3352BA',
};


const CustomScrollbar = css`
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bdbdbd;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #9e9e9e;
  }
`;
export const StyledNoSelectionMessage = styled.div`
  padding: 40px 20px;
  border-radius: 10px;
  margin-top: 20px;
  text-align: center;
  font-size: 1.2em;
  font-weight: 600;
  
  p {
    margin: 10px 0 0;
    font-style: italic;
    font-size: 0.9em;

  }

  ${(props) =>
    props.$type === 'info' &&
    css`
      background-color: ${colors.infoBg};
      // border: 2px solid ${colors.primary};▼
      color: #172554;
      box-shadow: 0 4px 10px rgba(7, 29, 90, 0.2);
    `}

  ${(props) =>
    props.$type === 'warning' &&
    css`
      background-color: ${colors.warningBg};
      border: 2px solid ${colors.warningText};
      color: ${colors.warningText};
      box-shadow: 0 4px 10px rgba(255, 152, 0, 0.2);
    `}
`;

export const ViewContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  position: relative;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  background-color: ${colors.background};
`;

export const DepartmentPanel = styled.div`
  width: 320px;
  min-width: 320px;
  background-color: ${colors.panelBg};
  padding: 30px 20px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px ${colors.shadowMedium};
  border-right: 3px solid ${colors.primary}; 
  overflow-y: auto;
  z-index: 5;
  ${CustomScrollbar}

 img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
  ${(props) =>
    !props.$isOpen &&
    css`
      transform: translateX(-100%);
      width: 0;
      min-width: 0;
      padding: 0;
      opacity: 0;
    `}
`;

export const Title = styled.button`
  display: flex;             
  align-items: center;      
  gap: 12px;                   

  margin-top: 0;
  padding-bottom: 15px;

  color: #3352BA;
  font-size: 1.5em;
  font-weight: 700;
  letter-spacing: 0.5px;

  background: white;
  border: none;
  cursor: default;            
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  margin: 15px 0 20px 0;

  border: 2px solid ${colors.borderColor};
  border-radius: 10px;

  font-size: 0.95rem;
  outline: none;

  transition: 0.2s ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(51, 82, 186, 0.15);
  }

  @media (min-width: 2000px) {
    padding: 14px 18px;
    font-size: 1.15rem;
    margin: 20px 0 25px 0;
  }


  @media (max-width: 1400px) {
    font-size: 1rem;
    padding: 11px 16px;
  }


  @media (max-width: 1024px) {
    padding: 10px 14px;
    font-size: 0.9rem;
  }

 
  @media (max-width: 767px) {
    padding: 9px 12px;
    font-size: 0.85rem;
    margin: 12px 0 15px 0;
  }


  
`;


export const ToggleArrow = styled.button`
  position: absolute;
  left: ${(props) => (props.$isOpen ? '320px' : '0')}; 
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  
  width: 35px; 
  height: 80px;
  background-color:#172554 ;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 2em;
  line-height: 80px;
  text-align: center;
  border-radius: 0 10px 10px 0;
  transition: left 0.3s ease-out, background-color 0.2s;
  box-shadow: 2px 0 10px ${colors.shadowMedium};

  &:hover {
    background-color: ${colors.primary}; 
    box-shadow: 2px 0 15px ${colors.shadowMedium};
  }
`;

export const MainContent = styled.div`
width:100%;
  flex-grow: 1; 
  display: flex;
  padding: 30px;
  min-width: 0; 
  gap:20px;

     @media (min-width: 768px) and (max-width: 1024px) {
    flex-direction: column;
    height: 100vh;     
    min-height: 0;     
    padding: 16px;
    gap: 12px;
  }
`;
export const CardItem = styled.div`
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 12px;
  background-color: ${colors.panelBg};
  box-shadow: 0 4px 10px ${colors.shadowLight};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  > strong {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2em;
    color: #172554;
  }

  &:hover {
    background-color: ${colors.hoverBg};
    box-shadow: 0 6px 15px ${colors.shadowLight};
  }

  ${(props) =>
    props.$isActive &&
    css`
      border: 1px solid ${colors.primary};
      background-color: ${colors.activeBg};
      box-shadow: 0 8px 20px ${colors.shadowMedium};
      padding-bottom: 10px;
    `}
  @media (min-width: 2000px) {
    padding: 12px;
    margin-bottom: 22px;

    > strong {
      font-size: 1.45em;
    }
  }
 @media (max-width: 1920px) {
    padding: 10px;

    > strong {
      font-size: 1rem;
    }
  }

  @media (max-width: 1400px) {
    padding: 10px;

    > strong {
      font-size: 1.15em;
    }
  }

  @media (max-width: 1024px) {
    padding: 10px;
    border-radius: 10px;

    > strong {
      font-size: 1.1em;
    }
  }

 
  @media (max-width: 768px) {
    padding: 10px;

    > strong {
      font-size: 1em;
    }
  }

`;


export const EmployeeContainer = styled.div`
  background-color: ${colors.panelBg}; 
  border-radius: 12px;
  overflow-y: auto;
  
`;
export const EmployeeListWrapper = styled.div`
  min-width: 0;
  width: ${(props) => (props.$visible ? '300px' : '0')}; 
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: width 0.4s ease, opacity 0.3s ease;
  overflow: hidden;
  padding: 0;
  
  > ${EmployeeContainer} {
    width: 300px; 
    padding: ${(props) => (props.$visible ? '30px' : '0')};
    height: 100%;
    box-shadow: 0 6px 20px ${colors.shadowMedium};
    margin: 0; 
  }
`;

export const EmployeeListItem = styled.div`
  padding: 12px 15px; 
  border-radius: 8px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500; 
  color: ${colors.text};
  
  &:hover {
    background-color: ${colors.selectedEmployee}80; 
  }
  background-color: ${(props) => (props.$isActive ? colors.selectedEmployee : 'transparent')};
  font-weight: ${(props) => (props.$isActive ? '700' : '500')};
  color: ${(props) => (props.$isActive ? colors.text : colors.lightText)};
  border: ${(props) => (props.$isActive ? `2px solid ${colors.secondary}` : 'none')};
  transform: ${(props) => (props.$isActive ? 'translateX(5px)' : 'none')}; 
`;

export const TaskPanelContainer = styled.div`
  flex: 1;
  min-width: 450px;
  padding: 30px;
  border-radius: 12px;
  background-color: ${colors.panelBg};
  box-shadow: 0 6px 20px ${colors.shadowMedium};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;


export const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  font-weight: 600;
  color: ${colors.lightText};
  gap: 10px;

  label {
    font-size: 0.85rem;
    white-space: nowrap;
  }

  input[type="date"] {
    padding: 8px 12px;
    border: 2px solid ${colors.borderColor};
    border-radius: 8px;
    font-size: 0.8rem;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;

    &:focus {
      border-color: ${colors.primary};
      box-shadow: 0 0 0 3px ${colors.primary}30;
    }
  }


  @media (min-width: 1025px) {
    label {
      font-size: 0.9rem;
    }
    input[type="date"] {
      font-size: 0.85rem;
      padding: 9px 14px;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    label {
      font-size: 0.6rem;
    }
    input[type="date"] {
      font-size: 0.8rem;
      padding: 4px 10px;
    }
  }


  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;

    label {
      font-size: 0.75rem;
    }

    input[type="date"] {
      width: 100%;
      font-size: 0.75rem;
      padding: 7px 10px;
    }
  }
`;

export const
  TaskList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;        
  min-height: 0;      
  overflow-y: auto;
  ${CustomScrollbar};

  li {
    padding: 15px;
    margin-bottom: 12px;
    background-color: #f4f8ff;
    border-radius: 10px;
    color: ${colors.text};
    box-shadow: 0 2px 4px ${colors.shadowLight};
    display: flex;
    flex-direction: column;  
  align-items: flex-start;  
  gap: 8px;                  
  width: 100%;
  word-break: break-word;   
  white-space: normal;      
  overflow: hidden;   
    justify-content: space-between;
    align-items: flex-start;
    font-size: 1em;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${colors.hoverBg};
    }
  }
`;

export const NoSelectionMessage = styled.p`
  color: ${colors.lightText};
  font-style: italic;
  padding: 30px;
  text-align: center;
  border: 1px dashed ${colors.borderColor};
  border-radius: 10px;
  margin-top: 15px;
  font-size: 1.1em;
`;
export const EmployeePanel = styled.div`
  width: 300px;
  min-width: 300px;
  background-color: ${colors.panelBg};
  padding: 30px 20px;
  border-right: 2px solid ${colors.borderColor};
  box-shadow: 4px 0 15px ${colors.shadowLight};
  overflow-y: auto;
  ${CustomScrollbar}

  h3 {
    margin: 0 0 15px 0;
    color: #172554;
    font-size: 1.4em;
    font-weight: 700;
  }
`;

export const PanelContainer = styled.div`
  flex: 2 1 auto;
  min-width: 0;        
  min-height: 0;     
  padding: 15px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  /* width: calc(100% - 300px)'' */

  h4 {
    padding-bottom: 10px;
    margin-top: 0;
    color: #555;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    flex: 1 1 auto;    
    padding: 12px;
  }

 @media (min-width: 1440px)  {
     width: calc(100% - 300px);
  }
`;

export const EmployeeSlidePanel = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 320px;
  height: 100%;
  background: #ffffff;
  box-shadow: 4px 0 10px rgba(0,0,0,0.1);
  transform: translateX(${(p) => (p.$visible ? "0" : "-100%")});
  transition: transform 0.4s ease;
  z-index: 2;
  padding: 20px;
  overflow-y: auto;
`;
export const EmployeePanelWrapper = styled.div`
  min-width: 0;
  width: ${(props) => (props.$visible ? "300px" : "0")};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  padding: ${(props) => (props.$visible ? "0 20px 0 0" : "0")};
  transition: width 0.4s ease, opacity 0.3s ease, padding 0.4s ease;
  overflow: hidden;
  > ${EmployeeContainer} {
    height: 100%;
    width: 300px;
    padding: 30px;
    box-shadow: 0 6px 20px ${colors.shadowMedium};

@media (min-width: 1200px) and (max-width: 1300px) {
      width: 200px;
      padding: 15px;
      box-shadow: 0 8px 24px ${colors.shadowMedium};
  }
    @media (min-width: 768px) and (max-width: 1119px) {
      width: 100%;
      padding: 15px;
      box-shadow: 0 8px 24px ${colors.shadowMedium};
  }
  
  }
 
  @media (min-width: 768px) and (max-width: 1024px) {
    width: ${(props) => (props.$visible ? "100%" : "0")};
    padding: ${(props) => (props.$visible ? "0 15px 0 0" : "0")};
  }
  @media (max-width: 480px) {
    width: ${(props) => (props.$visible ? "100%" : "0")};
    padding: 0;
  }
`;


export const EmployeeItem = styled.div`
  padding: 8px 10px;
  border-radius: 10px;
  border:1px solid #304EB0;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.1s;
  font-size: 1rem;
  margin-top:10px;
  background-color: ${(props) =>
   props.$isActive ? colors.activeBg : "transparent"};
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  color: ${(props) => (props.$isActive ? "#3352BA" : colors.text)};

  &:hover {
    background-color: ${colors.hoverBg};

  }
 @media (min-width: 1921px) {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }

  @media (min-width: 1600px) and (max-width: 1920px) {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }
  @media (min-width: 1025px) and (max-width: 1599px) {
    font-size: 1.05rem;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.95rem;
  }
`;



export const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${colors.borderColor};
  padding-bottom: 15px;
  margin-bottom: 20px;
`;

export const Heading = styled.div`
  margin: 0;
  color: ${colors.primaryDark};
  font-weight: 700;
  font-size: 1rem;

@media (min-width: 2540px) {
    font-size: 1.4rem;
  }

   @media (min-width: 1920px) and (max-width: 2539px) {
    font-size: 1.4rem;
  }
 @media (min-width: 1601px) and (max-width: 1919px) {
    font-size: 1.2rem;
  }

 @media (min-width: 1025px) and (max-width: 1600px) {
    font-size: 1rem;
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 0.8rem;
  }

 


`;


export const TaskListItemStyled = styled.li`
  padding: 15px;
  margin-bottom: 15px;
  background-color: ${colors.background};
  border-radius: 10px;
  box-shadow: 0 2px 5px ${colors.shadowLight};
  display: flex;
  align-items: flex-start;
  transition: background-color 0.2s, transform 0.2s;
  border-left: 5px solid ${colors.secondary}; 
  
  &:hover {
    background-color: ${colors.hoverBg};
    transform: translateY(-2px);
  }
  
  &:before {
    content: '✅'; 
    font-size: 1.2em;
    margin-right: 15px;
    margin-top: 2px;
  }
`;

export const TaskDetails = styled.div`
  flex-grow: 1;
  color: ${colors.text};
  
  .task-header-info {
    display: flex;
    align-items: baseline;
    margin-bottom: 5px;
  }
  
  .task-name {
    font-size: 1.1em;
    font-weight: 700;
    color: ${colors.primaryDark};
  }
  
  .project-name {
    font-size: 0.9em;
    font-weight: 500;
    color: ${colors.lightText};
    margin-left: 10px;
  }
  
  .task-description {
    font-size: 0.95em;
    color: ${colors.text};
    margin: 5px 0 0 0;
    line-height: 1.4;
  }
`;

export const TaskFooter = styled.div`
  display: flex;
  justify-content: flex-end; 
  gap: 20px;
  padding-top: 20px;
  margin-top: 20px;
  border-top: 1px solid ${colors.borderColor};
`;

export const TaskLeft = styled.div`
  display: flex;
  flex-direction: column;

  .task-title {
    font-size: 1.05em;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .task-desc {
    font-size: 0.9em;
    color: ${colors.lightText};
  }

  @media (min-width: 2540px) {
    .task-title {
      font-size: 1.5rem;
    }
    .task-desc {
      font-size: 1.2rem;
    }
  }

  @media (min-width: 1920px) and (max-width:2539px){
    .task-title {
      font-size: 1.1rem;
    }
    .task-desc {
      font-size: 1rem;
    }
  }

  @media (min-width: 1600px) and (max-width:1919px) {
    .task-title {
      font-size: 1rem;
    }
    .task-desc {
      font-size: 0.9rem;
    }
  }

  @media (min-width: 1025px) and (max-width: 1400px) {
    .task-title {
      font-size: 1rem;
    }
    .task-desc {
      font-size: 0.9em;
    }
  }

  
  @media (min-width: 768px) and (max-width: 1024px) {
    .task-title {
      font-size: 0.9rem;
    }
    .task-desc {
      font-size: 0.8em;
    }
  }
 

`;


export const TaskRight = styled.div`
  text-align: right;
  font-size: 0.85em;
  color: ${colors.primaryDark};

  .task-time {
    font-weight: 600;
  }

  .task-date {
    color: ${colors.lightText};
  }
`;

export const TaskBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  padding-top: 12px;
  border-top: 1px dashed ${colors.borderColor};

  .right-block {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 16px;
  }

  .time-taken {
    font-size: 0.95em;

    strong {
      color: ${colors.primaryDark};
      font-weight: 700;
    }
  }

  .due-info {
    display: flex;
    align-items: flex-end;
    gap: 20px;

    .task-date {
      font-weight: 600;
      color: ${colors.text};
    }

    .task-time {
      font-weight: 600;
      color: ${colors.primary};
    }
  }


    @media (min-width: 2560px) {
    padding-top: 18px;

    .time-taken {
      font-size: 1.5rem;
    }

    .due-info {
      gap: 28px;

      .task-date,
      .task-time {
        font-size: 1.5rem;
      }
    }
  }

  @media (min-width: 1600px) {
    padding-top: 18px;

    .time-taken {
      font-size: 1.15em;
    }

    .due-info {
      gap: 28px;

      .task-date,
      .task-time {
        font-size: 1.15em;
      }
    }
  }


  @media (min-width: 1025px) and (max-width: 1400px) {
    .time-taken {
      font-size: 1rem;
    }

    .due-info .task-date,
    .due-info .task-time {
      font-size: 1rem;
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    .time-taken {
      font-size: 0.8em;
    }

    .due-info {
      gap: 16px;

      .task-date,
      .task-time {
        font-size: 0.8rem;
      }
    }
  }
`;

export const TaskContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px; 
`;