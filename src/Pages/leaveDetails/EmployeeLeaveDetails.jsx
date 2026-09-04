// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   PageCard,
//   SectionTitle,
//   InfoRow,
//   InfoGrid,
//   Label,
//   ReadonlyInput,
//   ButtonRow,
//   ApproveButton,
//   DeclineButton,
//   ReasonBox,
//   CardWrapper,
//   CardHeader,
//   CardContent,
//   ArrowIcon,
// } from "./EmployeeLeaveDetails.Styles";

// import Header from "../../Components/Employee/Headers/Header";
// import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle";
// import ReusableConfirmModal from "../../Components/modals/ReusableConfirmModal";
// import Loader from "../../Components/Loader/Loader";
// import { useDispatch, useSelector } from "react-redux";
// import { getLeaveDetails, patchLeaveStatus } from "../../Redux/leaveSlice";
// import { useParams, useNavigate } from "react-router-dom";
// import EmployeeIcon from "../../assets/employeeicon.svg";
// import { FaAngleDown } from "react-icons/fa6";
// import { FaChevronUp } from "react-icons/fa";

// const EmployeeLeaveForm = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { leaveDetails, loading } = useSelector(state => state.leave);
//   const navigate = useNavigate();

//   const [showJob, setShowJob] = useState(false);
//   const [showLeaveApp, setShowLeaveApp] = useState(false);
//   const [showBalance, setShowBalance] = useState(false);
//   const [showReason, setShowReason] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [actionType, setActionType] = useState("");

// const formatDate = (date) => {
//   if (!date) return "-";

//   const d = new Date(date);
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = d.toLocaleString("en-US", { month: "short" });
//   const year = d.getFullYear();

//   return `${day}/${month}/${year}`;
// };
//   useEffect(() => {
//     if (id) dispatch(getLeaveDetails(id));
//   }, [dispatch, id]);

  
//   const employee = leaveDetails?.employee || {};

//   const handleStatusUpdate = async () => {
//     if (!id || !actionType) return;

//     const status = actionType === "approve" ? "approved" : "rejected";

//     try {
//       await dispatch(patchLeaveStatus({ leaveId: id, status }));
//       navigate("/employee-leave-request");
//     } finally {
//       setShowModal(false);
//       setActionType("");
//     }
//   };


//   if (loading) {
//     return (
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           height: "100vh",
//           alignItems: "center",
//         }}
//       >
//         <Loader color="#003366" size={15} />
//       </div>
//     );
//   }

//   return (
//     <>
//       <Container>
//         <EmployeeTitle
//           iconSrc={EmployeeIcon}
//           showAddButton={false}
//           showDropdown={false}
//           showBackArrow={true}
//           showTabs={false}
//           showSearch={false}
//           showReportButton={false}
//         />

//         <Header employee={employee} />

//         <PageCard>


//           <CardWrapper>
//             <CardHeader onClick={() => setShowJob(!showJob)}>
//               <SectionTitle>Job Details</SectionTitle>
//               <ArrowIcon>
//                 {showJob ? <FaChevronUp /> : <FaAngleDown />}
//               </ArrowIcon>
//             </CardHeader>

//             {showJob && (
//               <CardContent>
//                 <InfoGrid>
//                   <ReadonlyInput value={employee.designation || ""} readOnly />
//                   <ReadonlyInput value={employee.employment_type || ""} readOnly />
//                   <ReadonlyInput value={employee.department || ""} readOnly />
//                   <ReadonlyInput value={formatDate(employee.joining_date)} readOnly />
//                 </InfoGrid>
//               </CardContent>
//             )}
//           </CardWrapper>


//           {/* --- Leave Application Card --- */}
//           <CardWrapper>
//             <CardHeader onClick={() => setShowLeaveApp(!showLeaveApp)}>
//               <SectionTitle>Leave Application</SectionTitle>
//               <ArrowIcon>
//                 {showLeaveApp ? <FaChevronUp /> : <FaAngleDown />}
//               </ArrowIcon>
//             </CardHeader>

//             {showLeaveApp && (
//               <CardContent>
//                 <InfoRow>
//                   <ReadonlyInput value={leaveDetails?.leave_type || ""} readOnly />
//                 </InfoRow>

//                 <InfoGrid columns="2">
//                   <div>
//                     <Label>From</Label>
//                     <ReadonlyInput
//                       value={
//                         leaveDetails?.from_date
//                           ? `${formatDate(leaveDetails.from_date)} (${leaveDetails.from_date_type || ""})`
//                           : ""
//                       }
//                       readOnly
//                     />
//                   </div>

//                   <div>
//                     <Label>To</Label>
//                     <ReadonlyInput
//                       value={
//                         leaveDetails?.to_date
//                           ? `${formatDate(leaveDetails.to_date)} (${leaveDetails.to_date_type || ""})`
//                           : ""
//                       }
//                       readOnly
//                     />
//                   </div>
//                 </InfoGrid>
//               </CardContent>
//             )}
//           </CardWrapper>


//           {/* --- Leave Balance Card --- */}
//           <CardWrapper>
//             <CardHeader onClick={() => setShowBalance(!showBalance)}>
//               <SectionTitle>Leave Balance</SectionTitle>
//               <ArrowIcon>
//                 {showBalance ? <FaChevronUp /> : <FaAngleDown />}
//               </ArrowIcon>
//             </CardHeader>

//             {showBalance && (
//               <CardContent>
//                 <InfoGrid>
//                   <div>
//                     <Label>Balance Leave</Label>
//                     <ReadonlyInput value={employee?.total_leave || ""} readOnly />
//                   </div>
//                   <div>
//                     <Label>Paid Leave</Label>
//                     <ReadonlyInput value={employee?.paid_leave || ""} readOnly />
//                   </div>
//                 </InfoGrid>
//               </CardContent>
//             )}
//           </CardWrapper>


//           {/* --- Reason --- */}
//           <CardWrapper>
//             <CardHeader onClick={() => setShowReason(!showReason)}>
//               <SectionTitle>Reason for Leave</SectionTitle>
//               <ArrowIcon>
//                 {showReason ? <FaChevronUp /> : <FaAngleDown />}
//               </ArrowIcon>
//             </CardHeader>

//             {showReason && (
//               <CardContent>
//                 <ReasonBox>
//                   {leaveDetails?.reason || "No reason provided"}
//                 </ReasonBox>
//               </CardContent>
//             )}
//           </CardWrapper>


//           {/* Buttons */}
//           <ButtonRow>
//             <DeclineButton
//               onClick={() => {
//                 setActionType("reject");
//                 setShowModal(true);
//               }}
//             >
//               Decline
//             </DeclineButton>

//            <ApproveButton
//   onClick={() => {
//     setActionType("approve");
//     setShowModal(true);
//   }}
// >
//   Approve
// </ApproveButton>
//           </ButtonRow>

//         </PageCard>

//         {/* Modal */}
//         <ReusableConfirmModal
//           show={showModal}
//           onClose={() => setShowModal(false)}
//           onConfirm={handleStatusUpdate}
//           actionType={actionType}
//           leaveId={id}
//         />


//       </Container>
//     </>
//   );
// };

// export default EmployeeLeaveForm;
