import styled from "styled-components";
const CONTROL_HEIGHT = "40px";

export const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
  background-color: white;
`;

export const Section = styled.div`
  /* margin-top: 15px; */
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2;
  color: #333;

  ${(props) =>
    props.$required &&
    `
      &::after {
        content: " *";
        color: #ef4444;
      }
    `}
`;

export const Hr = styled.hr`
  width: 100%;
  margin: 10px 0;
  border: none;
  border-top: 1px solid #eaecf0;
`;

export const Rowes = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 5}, minmax(0, 1fr));
  gap: 16px 20px;
  align-items: start; /* keeps inputs aligned even when one field shows an error */

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Input = styled.input`
 box-sizing: border-box;
  width: 100%;
  height: ${CONTROL_HEIGHT};
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 1rem;
  background: #fff;

  &:focus {
    border-color: #3352ba;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

export const Select = styled.select`
 box-sizing: border-box;
  width: 100%;
  height: ${CONTROL_HEIGHT};
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 1rem;
  background: #fff;

  &:focus {
    border-color: #3352ba;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

export const FullPageLoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
`;

export const ResponsiveH3 = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 20px;
`;

/* ---------------- Cards ---------------- */
export const Card = styled.div`
  background: #fff;
  border-radius: 8px;
  /* padding: 20px; */
  margin-bottom: 20px;
`;

export const CardHeader = styled.div`
  margin: 0;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
export const UploadWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// export const Label = styled.label`
//   font-size: 0.9rem;
//   font-weight: 600;
//   color: #334155;
// `;

export const PreviewBox = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  @media (max-width: 768px) {
    width: 100px;
    height: 70px;
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const UploadButton = styled.label`
  display: inline-block;
  padding: 8px 14px;
  background: #1e293b;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;
  transition: all 0.2s ease;

  &:hover {
    background: #0f172a;
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  margin-bottom: 8px;
`;

export const FullWidthGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
`;

export const TotalLeaveBox = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: ${CONTROL_HEIGHT};
  padding: 0 10px;
  margin-bottom: 12px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  color: #172554;
  background-color: white;
`;

export const LeaveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const LeaveItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const LeaveLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: #172554;
`;

export const LeaveInput = styled(Input)`
  width: 100%;
`;

export const FileInputLabel = styled.label`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${CONTROL_HEIGHT};
  padding: 0 10px;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  color: #6b7280;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    color: #4f46e5;
  }
`;