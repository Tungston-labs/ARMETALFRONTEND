import React from "react";
import ReimbursementLineChart from "./ReimbursementLineChart";
import {
  MainWrapper,
  LeftChart,
  RightCards,
  CardGrid,
  CardBox,
  Title,
  Count,
  Subtext
} from "./ReimbursementSummary.Styles";

const ReimbursementSummary = ({ reimbursements, reimbursementMonthwise }) => {
  if (!reimbursements || !reimbursementMonthwise) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <MainWrapper>
      <LeftChart>
        <ReimbursementLineChart data={reimbursementMonthwise} />
      </LeftChart>

      <RightCards>
        <CardGrid>
          <CardBox style={{ borderTopColor: "#3352BA" }}>
            <Title> Total Reimbursement Requests</Title>
            <Count>{reimbursements.total_requests || 0}</Count>
            <Subtext>Overall Request raised</Subtext>
          </CardBox>

          <CardBox style={{ borderTopColor: "#f59e0b" }}>
            <Title>Pending Reimbursement</Title>
            <Count>{reimbursements.pending_count || 0}</Count>
            <Subtext>Waiting for approval</Subtext>
          </CardBox>

          <CardBox style={{ borderTopColor: "#10b981" }}>
            <Title>Verified Reimbursement</Title>
            <Count>{reimbursements.verified_count || 0}</Count>
            <Subtext>Verified by Accounts</Subtext>
          </CardBox>

          <CardBox style={{ borderTopColor: "#ef4444" }}>
            <Title>Rejected Reimbursement</Title>
            <Count>{reimbursements.rejected_count || 0}</Count>
            <Subtext>Rejected due to mismatch</Subtext>
          </CardBox>
        </CardGrid>
      </RightCards>
    </MainWrapper>
  );
};

export default ReimbursementSummary;
