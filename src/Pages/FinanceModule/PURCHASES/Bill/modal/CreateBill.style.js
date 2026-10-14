import styled from "styled-components";

export const CreateBillContainer = styled.div`
  width: 100%;
  min-height: 100vh;

  background: #ffffff;

  padding: 0 44px 48px;
`;

export const BillHeader = styled.div`
  border-bottom: 1px solid #eeeeee;

  margin: 0 -44px 20px;

  padding: 10px 44px 9px;

  h1 {
    margin: 0 0 7px;

    color: #2f4da8;

    font-size: 17px;
    font-weight: 600;
  }
`;

export const Breadcrumbs = styled.div`
  display: flex;
  align-items: center;

  gap: 8px;

  font-size: 12px;

  color: #222222;

  strong {
    color: #2f4da8;
    font-weight: 500;
  }
`;

export const FormGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  column-gap: 24px;

  row-gap: 13px;
`;

export const FormGroup = styled.div`
  min-width: 0;
`;

export const Label = styled.label`
  display: block;

  margin-bottom: 5px;

  color: #171717;

  font-size: 11px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;

  height: 36px;

  box-sizing: border-box;

  border: 1px solid #e5e5e5;

  border-radius: 4px;

  padding: 0 17px;

  outline: none;

  color: #777777;

  background: #ffffff;

  font-family: inherit;

  font-size: 12px;

  &:focus {
    border-color: #2f4da8;
  }

  &::placeholder {
    color: #999999;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;

  width: 100%;
`;

export const Select = styled.select`
  width: 100%;

  height: 36px;

  appearance: none;

  box-sizing: border-box;

  border: 1px solid #e5e5e5;

  border-radius: 4px;

  padding: 0 35px 0 17px;

  outline: none;

  color: #777777;

  background: #ffffff;

  font-family: inherit;

  font-size: 12px;

  cursor: pointer;

  &:focus {
    border-color: #2f4da8;
  }
`;

export const SelectIcon = styled.span`
  position: absolute;

  top: 50%;
  right: 12px;

  display: flex;

  transform: translateY(-50%);

  pointer-events: none;

  color: #111111;

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const ItemsTitle = styled.h3`
  margin: 24px 0 12px;

  color: #171717;

  font-size: 12px;

  font-weight: 600;
`;

export const ItemsTable = styled.div`
  width: 100%;

  border-bottom: 1px solid #eeeeee;
`;

export const TableHeader = styled.div`
  display: grid;

  grid-template-columns:
    65px
    1.05fr
    1.55fr
    75px
    95px
    105px
    100px
    115px
    120px
    80px;

  align-items: center;

  min-height: 36px;

  padding: 0 10px;

  background: #2f4da8;

  color: #ffffff;

  font-size: 11px;
  font-weight: 600;
`;

export const TableRow = styled.div`
  display: grid;

  grid-template-columns:
    65px
    1.05fr
    1.55fr
    75px
    95px
    105px
    100px
    115px
    120px
    80px;

  align-items: center;

  min-height: 48px;

  padding: 0 10px;

  border-bottom: 1px solid #f0f0f0;

  color: #777777;

  font-size: 12px;
`;

export const TableCell = styled.div`
  display: flex;

  align-items: center;

  min-width: 0;

  padding: 0 7px;
`;

export const SmallInput = styled.input`
  width: 100%;

  max-width: 100%;

  height: 26px;

  box-sizing: border-box;

  border: 1px solid #eeeeee;

  border-radius: 0;

  padding: 0 8px;

  outline: none;

  color: #777777;

  background: #ffffff;

  font-family: inherit;

  font-size: 12px;

  &:focus {
    border-color: #2f4da8;
  }
`;

export const RemoveButton = styled.button`
  width: 25px;
  height: 25px;

  display: flex;

  align-items: center;
  justify-content: center;

  border: 1px solid #ff0000;

  border-radius: 50%;

  background: #ffffff;

  color: #ff0000;

  cursor: pointer;

  padding: 0;

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const SummaryWrapper = styled.div`
  width: 360px;

  margin-left: auto;

  margin-top: 20px;

  color: #171717;

  font-size: 12px;
`;

export const SummaryRow = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  min-height: 24px;

  strong {
    font-weight: 600;
  }

  .discount {
    color: #18a34a;
  }
`;

export const TotalAmount = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  height: 37px;

  margin-top: 10px;

  padding: 0 18px;

  border-radius: 4px;

  background: #f79312;

  color: #ffffff;

  font-size: 12px;

  font-weight: 600;

  strong {
    font-size: 14px;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;

  justify-content: flex-end;

  gap: 12px;

  margin-top: 24px;
`;

export const CancelButton = styled.button`
  width: 98px;

  height: 36px;

  border: 1px solid #2f4da8;

  border-radius: 4px;

  background: #ffffff;

  color: #111111;

  font-size: 12px;

  cursor: pointer;
`;

export const PreviewButton = styled.button`
  width: 91px;

  height: 36px;

  border: 1px solid #2f4da8;

  border-radius: 4px;

  background: #2f4da8;

  color: #ffffff;

  font-size: 12px;

  cursor: pointer;
`;