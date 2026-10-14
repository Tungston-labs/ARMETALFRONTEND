import styled from "styled-components";
const CONTROL_HEIGHT = "40px";
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 10px;
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  /* padding: 1.25rem 1.5rem; */
`;

export const CardHeader = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 1rem;
  /* color: #304eb0; */
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 1rem; */
`;

export const Grid2 = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0rem 1.25rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2;

  ${(props) =>
    props.$required &&
    `
      &::after {
        content: " *";
        color: #ef4444;
      }
    `}
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
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 0 10px;
  font-size: 0.9rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #304eb0;
  }
`;

export const ErrorText = styled.p`
  font-size: 0.75rem;
  line-height: 1rem;
  min-height: 1rem;
  margin: 4px 0 0;
  color: red;
`;

/* ---------- Table ---------- */

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

export const Th = styled.th`
  text-align: ${({ $align }) => $align || "left"};
  padding: 10px 12px;
  border-bottom: 2px solid #d1d5db;
  font-size: 0.9rem;
`;

export const Td = styled.td`
  text-align: ${({ $align }) => $align || "left"};
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  font-size: 0.9rem;
`;

export const TableFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  padding-top: 12px;
`;

export const AddButton = styled.button`
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: #2563eb;
  }
`;

export const SaveBtn = styled.button`
  height: 40px;
  padding: 0 16px;
  background: #304eb0;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #243d8f;
  }
`;

/* ---------- Kept in case other files import them ---------- */

export const SaveButton = styled.button`
  padding: 10px 16px;
  background: #304eb0;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1rem;
`;

export const PreviewBox = styled.div`
  margin: 8px 0;
  width: 220px;
  min-height: 120px;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
`;

export const PdfLink = styled.a`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1d4ed8;
  text-decoration: underline;
`;

export const UploadButton = styled.label`
  display: inline-block;
  padding: 8px 14px;
  background: #0f172a;
  color: #fff;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  width: fit-content;

  &:hover {
    background: #020617;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const Hr = styled.hr`
  width: 100%;
  height: 0;
  margin: 4px 0;
  border: 0;
  border-top: 1px solid #e5e7eb;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 3}, minmax(0, 1fr));
 column-gap:15px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;