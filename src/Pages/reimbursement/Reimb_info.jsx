import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchReimbursementDetail,
  updateReimbursementStatus,
} from "../../services/reimbursement";
import Loader from "../../Components/Loader/Loader";

import {
  PageWrapper,
  Card,
  SectionTitle,
  ProfileRow,
  ProfileImage,
  ProfileInfo,
  InfoRow,
  Label,
  Value,
  StatusSelect,
  TopStatusBar,
  TopStatusLabel,
  Divider,
  NoteBox,
  BillsGrid,
  BillImageWrapper,
  BillImage,
  NoteCard,
  NoteHeader,
  Arrow,
} from "./Reimb_info.Styles";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

const getStatusStyle = (status) => {
  switch (status) {
    case "Approve":
      return "#4CAF50";
    case "On Hold":
      return "#FF9800";
    case "In Verification":
      return "#FFC107";
    case "Reject":
      return "#E57373";
    default:
      return "#E0E0E0";
  }
};

const ReimbursementDetail = () => {
  const { id } = useParams();
  const [reimbursement, setReimbursement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNote, setShowNote] = useState(false);

  // Fetch on load
  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await fetchReimbursementDetail(id);
        setReimbursement(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  const handleStatusChange = async (e) => {
    if (reimbursement.status === "Approve") return;
    const newStatus = e.target.value;
    const oldStatus = reimbursement.status;

    setReimbursement((prev) => ({ ...prev, status: newStatus }));

    try {
      await updateReimbursementStatus(id, newStatus);
    } catch {
      setReimbursement((prev) => ({ ...prev, status: oldStatus }));
    }
  };

  if (loading) return <Loader />;

  if (!reimbursement) return <p>No reimbursement found.</p>;

  const formatDate = (date) => {
    if (!date) return "----";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <PageWrapper>
        <ReusableHeader
          title="Reimbursement Details"
          breadcrumbs={["Dashboard", "Reimbursement", "Reimbursement Details"]}
          showBack={true}
        />

        {/* Status changer — top of page */}
        <TopStatusBar>
          <TopStatusLabel>Status:</TopStatusLabel>
          <StatusSelect
            value={reimbursement.status}
            onChange={handleStatusChange}
            statusColor={getStatusStyle(reimbursement.status)}
            disabled={reimbursement.status === "Approve"}
            style={{
              cursor: reimbursement.status === "Approve" ? "not-allowed" : "pointer",
              pointerEvents: reimbursement.status === "Approve" ? "none" : "auto",
              opacity: 1,
            }}
          >
            <option value="Approve">Approved</option>
            <option value="On Hold">On Hold</option>
            <option value="In Verification">In Verification</option>
            <option value="Reject">Reject</option>
          </StatusSelect>
        </TopStatusBar>

        {/* Profile Card */}
        <Card>
          <SectionTitle>Employee Information</SectionTitle>
          <Divider />
          <ProfileRow>
            <ProfileImage
              src={
                reimbursement.profile_pic
                  ? reimbursement.profile_pic
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      reimbursement.employee_name,
                    )}&background=random`
              }
            />
            <ProfileInfo>
              <InfoRow>
                <Label>Name:</Label>
                <Value>{reimbursement.employee_name}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Employee ID:</Label>
                <Value>{reimbursement.employee_id}</Value>
              </InfoRow>
              <InfoRow>
                <Label>Department:</Label>
                <Value>{reimbursement.department?.name}</Value>
              </InfoRow>
            </ProfileInfo>
          </ProfileRow>
        </Card>

        {/* Date & Amount Card */}
        <Card>
          <SectionTitle>Reimbursement Details</SectionTitle>
          <Divider />
          <InfoRow>
            <Label>Date:</Label>
            <Value>{formatDate(reimbursement.date)}</Value>
          </InfoRow>

          <InfoRow>
            <Label>Amount:</Label>
            <Value>{reimbursement.amount}</Value>
          </InfoRow>

          <Divider />

          <NoteCard>
            <NoteHeader onClick={() => setShowNote(!showNote)}>
              <span>Note</span>
              <Arrow>{showNote ? "▲" : "▼"}</Arrow>
            </NoteHeader>

            {showNote && <NoteBox>{reimbursement.note}</NoteBox>}
          </NoteCard>
        </Card>

        {/* Bills */}
        <Card>
          <SectionTitle>Bills Uploaded</SectionTitle>
          <Divider />

          <BillsGrid>
            {reimbursement.images.map((bill) => (
              <BillImageWrapper key={bill.id}>
                <a href={bill.image} target="_blank" rel="noreferrer">
                  <BillImage src={bill.image} />
                </a>
              </BillImageWrapper>
            ))}
          </BillsGrid>
        </Card>
      </PageWrapper>
    </>
  );
};

export default ReimbursementDetail;