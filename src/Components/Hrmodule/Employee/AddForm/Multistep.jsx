// Components/Multistep.jsx
import React from "react";
import { ConfigProvider, Steps } from "antd";
import { StepsWrapper } from "./Multistep.Style";

const items = [
  { title: "Basic Details" },
  { title: "Bank Details" },
  { title: "Documents" },
];

const Multistep = ({ currentStep }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#2F4CAC", 
      },
    }}
  >
    <StepsWrapper>
      <Steps
        current={currentStep}
        labelPlacement="vertical"
        items={items}
      />
    </StepsWrapper>
  </ConfigProvider>
);

export default Multistep;
