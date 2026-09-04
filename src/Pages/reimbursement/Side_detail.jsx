import React, { useEffect, useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  PageWrapper,
  Header,
  Title,
  CloseButton,
  DateHeading,
  Card,
  ProfileImage,
  Info,
  Label,
  Value,
  RightSection,
  Amount,
} from "./Side_detail.Styles";
import { getGroupedReimbursements } from "../../services/reimbursement";
import Loader from "../../Components/Loader/Loader";
const ReimbursementHistory = ({ onClose }) => {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        const data = await getGroupedReimbursements();
        setReimbursements(data);
      } catch (error) {
        console.error("❌ Failed to fetch reimbursements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReimbursements();
  }, []);

  const handleOverlayClick = (e) => {
    // Only close if clicked directly on overlay
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // if (loading) return <Loader/>;
  // if (!reimbursements.length) return <p>No reimbursements found.</p>;

const formatDate = (date) => {
  if (!date) return "----";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};
  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <PageWrapper>
          <Header>
            <Title>Reimbursement History</Title>
            <CloseButton onClick={onClose}>Close</CloseButton>
          </Header>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "60px" }}>
              <Loader />
            </div>
          ) : reimbursements.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#666", fontFamily: "Poppins, sans-serif" }}>
              No reimbursements found.
            </div>
          ) : (
            reimbursements.map((section, idx) => (
              <div key={idx}>
                <DateHeading>{ formatDate(section.date)}</DateHeading>
                {section.reimbursements.map((item) => (
                  <Card key={item.id}>
                    <ProfileImage
                      src={item.profile_pic || "https://via.placeholder.com/50"}
                      alt={item.employee_name}
                    />
                    <Info>
                      <div>
                        <Label>Name</Label>
                        <Value>{item.employee_name}</Value>
                      </div>
                      <div>
                        <Label>Department</Label>
                        <Value>{item.department?.name || "N/A"}</Value>
                      </div>
                    </Info>
                    <RightSection>
                      <div>
                        <Label>Position</Label>
                        <Value>{item.designation || "N/A"}</Value>
                      </div>
                      <Amount> {item.amount}</Amount>
                    </RightSection>
                  </Card>
                ))}
              </div>
            ))
          )}
        </PageWrapper>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReimbursementHistory;
