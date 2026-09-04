// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { getLeaveRequests, patchLeaveStatus } from '../../Redux/leaveSlice';
// import { useNavigate } from 'react-router-dom';
// import OnLeaveModal from "./ModalList"
// import { getDepartments } from "../../Redux/departmentSlice";
// import EmployeeIcon from "../../assets/employeeicon.svg";
// import {
//   Container, TableRow,
//   TableCell, ActionButtons,
//   ApproveButton, StatusTabsWrapper,
//   StatusButton, StatusDot,
//   CountBadge,
//   PrintSection,
//   MonthSelect,
//   TopActionRow,
//   ExcelButton,
// } from './LeaveRequest.Styles';
// import Loader from "../../Components/Loader/Loader"
// import { TableHead, BodyCell, BodyRow, EmptyRow, HeadCell, HeadRow, StyledTable, TableBody, Avatar, AvatarFallback, NameCell, TableWrapper } from './EmployeeList.styles';
// import EmployeeTitle from '../../Components/Employee/Headers/EmployeeTitle';
// import Pagination from "../../Components/Pagination/Pagination"
// import NoEmployeeFound from '../../Components/No found/Noemployeefound';
// import { exportLeaveReport } from '../../utils/leaveExcelExport';

// export default function LeaveRequest() {
//   const dispatch = useDispatch();
//   const [menuOpen, setMenuOpen] = useState(false);
//   const { leaves, loading, pagination } = useSelector(state => state.leave);
//   const [actionType, setActionType] = useState('');
//   const [searchText, setSearchText] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLeave, setSelectedLeave] = useState(null);
//   const [page, setPage] = useState(1);
//   const navigate = useNavigate();
//   const [departmentFilter, setDepartmentFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   const [selectedMonth, setSelectedMonth] = useState(
//     new Date().getMonth() + 1
//   );
//   const [selectedYear, setSelectedYear] = useState(
//     new Date().getFullYear()
//   );
// const handleExportExcel = async () => {
//   try {
//     let allLeaves = [];
//     let currentPage = 1;
//     let totalPages = 1;

//     do {
//       const response = await dispatch(
//         getLeaveRequests({
//           page: currentPage,
//           department_id: departmentFilter || undefined,
//           status: statusFilter || undefined,
//           month: selectedMonth,
//           year: selectedYear,
//         })
//       ).unwrap();

//       allLeaves = [...allLeaves, ...response.results];
//       totalPages = response.total_pages;
//       currentPage++;
//     } while (currentPage <= totalPages);

//     // Apply search filter if needed
//     const excelData = allLeaves.filter((leave) => {
//       const name = leave?.employee?.name?.toLowerCase() || "";
//       const empId = leave?.employee?.employee_id?.toLowerCase() || "";
//       const search = searchText.toLowerCase();

//       return name.includes(search) || empId.includes(search);
//     });

//     exportLeaveReport(
//       excelData,
//       1,
//       formatDate
//     );
//   } catch (error) {
//     console.error("Export failed:", error);
//   }
// };
//   useEffect(() => {
//     dispatch(
//       getLeaveRequests({
//         page,
//         department_id: departmentFilter || undefined,
//         status: statusFilter || undefined,
//         month: selectedMonth,
//         year: selectedYear,
//       })
//     );
//   }, [
//     dispatch,
//     page,
//     departmentFilter,
//     statusFilter,
//     selectedMonth,
//     selectedYear,
//   ]);

//   useEffect(() => {
//   }, [pagination]);

//   const leaveData = leaves || [];

//   const { list: departmentList, loading: deptLoading } = useSelector(
//     (state) => state.departments
//   );
//   const isLoading = loading || deptLoading;

//   const filteredLeaves = leaveData.filter((leave) => {
//     const name = leave?.employee?.name?.toLowerCase() || '';
//     const empId = leave?.employee?.employee_id?.toLowerCase() || '';
//     const search = searchText.toLowerCase();
//     return name.includes(search) || empId.includes(search);
//   });

//   const handleStatusUpdate = async () => {
//     if (!selectedLeave || !actionType) return;
//     const status = actionType === 'approve' ? 'approved' : 'rejected';
//     try {
//       await dispatch(patchLeaveStatus({ leaveId: selectedLeave.id, status }));
//       dispatch(getLeaveRequests({ page, department_id: departmentFilter || undefined, status: statusFilter || undefined }));
//     } catch (error) {
//     } finally {
//       setShowModal(false);
//       setSelectedLeave(null);
//       setActionType('');
//     }
//   };

//   useEffect(() => {
//     dispatch(getDepartments());
//   }, [dispatch]);

//   const handleSearch = (e) => {
//     setSearchText(e.target.value);
//     setPage(1);
//   };

//   const handlePageChange = (newPage) => {
//     if (!newPage || newPage < 1) return;
//     dispatch(
//       getLeaveRequests({
//         page: newPage,
//         department_id: departmentFilter || undefined,
//         status: statusFilter || undefined,
//         month: selectedMonth,
//         year: selectedYear,
//       })
//     ).then(() => {
//       setPage(newPage);
//     });
//   };

//   const statusTabs = [
//     { label: "All", value: "", color: "#304eb0", bg: "#eff3ff", border: "#304eb0" },
//     { label: "Pending", value: "pending", color: "#f59e0b", bg: "#fffbeb", border: "#f59e0b" },
//     { label: "Approved", value: "approved", color: "#16a34a", bg: "#f0fdf4", border: "#16a34a" },
//     { label: "Rejected", value: "rejected", color: "#dc2626", bg: "#fef2f2", border: "#dc2626" },
//   ];

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "N/A";
//     const d = new Date(dateStr);
//     const day = d.getDate().toString().padStart(2, "0");
//     const month = d.toLocaleString("en-GB", { month: "short" });
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   };
//   const months = [
//     { value: 1, label: "January" },
//     { value: 2, label: "February" },
//     { value: 3, label: "March" },
//     { value: 4, label: "April" },
//     { value: 5, label: "May" },
//     { value: 6, label: "June" },
//     { value: 7, label: "July" },
//     { value: 8, label: "August" },
//     { value: 9, label: "September" },
//     { value: 10, label: "October" },
//     { value: 11, label: "November" },
//     { value: 12, label: "December" },
//   ];
//   return (
//     <>
//       {loading && <Loader />}
//       <Container>
//         <EmployeeTitle
//           iconSrc={EmployeeIcon}
//           showAddButton={false}
//           dropdownOptions={departmentList || []}
//           dropdownLoading={deptLoading}
//           searchValue={searchText}
//           onSearchChange={setSearchText}
//           selectedDropdownValue={departmentFilter}
//           onDropdownChange={setDepartmentFilter}
//           showBackArrow={false}
//           showReportButton={false}
//           showTabs={true}
//         />
//         <TopActionRow>
//           <StatusTabsWrapper>
//             {statusTabs.map(({ label, value, color, bg, border }) => (
//               <StatusButton
//                 key={value}
//                 $active={statusFilter === value}
//                 $color={color}
//                 $bg={bg}
//                 $borderColor={border}
//                 onClick={() => {
//                   setStatusFilter(value);
//                   setPage(1);
//                 }}
//               >
//                 <StatusDot
//                   $active={statusFilter === value}
//                   $color={color}
//                 />

//                 {label}

//                 {value !== "" &&
//                   pagination?.[`${value}_count`] !== undefined && (
//                     <CountBadge
//                       $active={statusFilter === value}
//                       $color={color}
//                     >
//                       {pagination[`${value}_count`]}
//                     </CountBadge>
//                   )}
//               </StatusButton>
//             ))}

//           </StatusTabsWrapper>
//           <PrintSection>

//             <MonthSelect
//               value={selectedMonth}
//               onChange={(e) =>
//                 setSelectedMonth(Number(e.target.value))
//               }
//             >
//               {months.map((month) => (
//                 <option
//                   key={month.value}
//                   value={month.value}
//                 >
//                   {month.label}
//                 </option>
//               ))}
//             </MonthSelect>

//             <MonthSelect
//               value={selectedYear}
//               onChange={(e) =>
//                 setSelectedYear(Number(e.target.value))
//               }
//             >
//               {[2024, 2025, 2026, 2027, 2028].map((year) => (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               ))}
//             </MonthSelect>

//             <ExcelButton
//               onClick={handleExportExcel}

//             >
//               Export Excel
//             </ExcelButton>

//           </PrintSection>
//         </TopActionRow>
//         <TableWrapper>
//           <StyledTable>
//             <TableHead>
//               <HeadRow>
//                 <HeadCell>Sl No</HeadCell>
//                 <HeadCell>Employee Name</HeadCell>
//                 <HeadCell>Leave Type</HeadCell>
//                 <HeadCell>Department</HeadCell>
//                 <HeadCell>Start Date</HeadCell>
//                 <HeadCell>End Date</HeadCell>
//                 <HeadCell>Status</HeadCell>
//                 <HeadCell></HeadCell>
//               </HeadRow>
//             </TableHead>

//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan="8"></TableCell>
//                 </TableRow>
//               ) : filteredLeaves.length === 0 ? (
//                 <tr>
//                   <td colSpan={8}>
//                     <NoEmployeeFound />
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLeaves.map((leave, index) => (
//                   <BodyRow
//                     key={leave.id}
//                     onClick={() => navigate(`/employee-leave-details/${leave.id}`)}
//                     style={{
//                       cursor: "pointer",
//                       transition: "background 0.2s ease",
//                     }}
//                     onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f9ff")}
//                     onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
//                   >
//                     <BodyCell>{index + 1 + (page - 1) * 20}</BodyCell>
//                     <BodyCell style={{ textTransform: "capitalize" }}>
//                       {leave?.employee?.name || "N/A"}
//                     </BodyCell>
//                     <BodyCell>{leave.leave_type}</BodyCell>
//                     <BodyCell>{leave.employee.department}</BodyCell>
//                     <BodyCell>{formatDate(leave.from_date)}</BodyCell>
//                     <BodyCell>{formatDate(leave.to_date)}</BodyCell>

//                     {/* Status Badge */}
//                     <BodyCell>
//                       <span style={{
//                         // padding: "4px 12px",
//                         // borderRadius: "12px",
//                         // fontSize: "12px",
//                         fontWeight: "600",
//                         // background:
//                         // leave.status === "approved" ? "#f0fdf4" :
//                         // leave.status === "rejected" ? "#fef2f2" : "#fffbeb",
//                         color:
//                           leave.status === "approved" ? "#16a34a" :
//                             leave.status === "rejected" ? "#dc2626" : "#f59e0b",
//                       }}>
//                         {leave.status
//                           ? leave.status.charAt(0).toUpperCase() + leave.status.slice(1)
//                           : "Pending"}
//                       </span>
//                     </BodyCell>

//                     <BodyCell onClick={(e) => e.stopPropagation()}>
//                       <ActionButtons>
//                         <ApproveButton
//                           onClick={() => {
//                             const today = new Date();
//                             const leaveEnd = new Date(leave.to_date);
//                             if (leaveEnd < today.setHours(0, 0, 0, 0)) {
//                               alert("You cannot approve past leave requests.");
//                               return;
//                             }
//                             setSelectedLeave({
//                               leave_id: leave.id,
//                               employee_id: leave.employee?.id,
//                               date: today.toISOString().split("T")[0],
//                             });
//                             setShowModal(true);
//                           }}
//                           style={{
//                             backgroundColor:
//                               new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0)
//                                 ? "#fa8e8e"
//                                 : "#304EB0",
//                             cursor:
//                               new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0)
//                                 ? "not-allowed"
//                                 : "pointer",
//                           }}
//                           disabled={new Date(leave.to_date) < new Date().setHours(0, 0, 0, 0)}
//                         >
//                           On Leave
//                         </ApproveButton>
//                       </ActionButtons>
//                     </BodyCell>
//                   </BodyRow>
//                 ))
//               )}
//             </TableBody>
//           </StyledTable>
//         </TableWrapper>

//         <Pagination
//           currentPage={page}
//           totalPages={pagination?.total_pages ?? 1}
//           onPageChange={handlePageChange}
//         />

//         {showModal && (
//           <OnLeaveModal
//             leaveId={selectedLeave?.leave_id}
//             employeeId={selectedLeave?.employee_id}
//             date={selectedLeave?.date}
//             onClose={() => setShowModal(false)}
//           />
//         )}

//       </Container>
//     </>
//   );
// }