// import React, { useEffect, useState } from "react";
// import EmployeeModal from "../../Components/Project/modal/EmployeeModal";
// import EditProjectModal from "../../Components/Project/modal/EditProjectModal";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, useNavigate } from "react-router-dom";
// import { getProjectById, updateProject, deleteProject, removeEmployeeFromProject } from "../../Redux/fieldShiftSlice";
// import {
//   PageWrapper,
//   FormContainer,
//   FormRow,
//   InputField,
//   ActionButton,
//   EmployeesSection,
//   AddButton,
//   ButtonWrapper,
//   EmployeeHeader,
//   ProgressContainer,
//   LeftSide,
//   RightSide,
//   StyledTable,
//   BodyCell,
//   BodyRow,
//   HeadCell, HeadRow, TableBody, TableHead,
//   TableWrapper
// } from "./ProjectInfo.Styles";
// import FieldShiftIcon from "../../assets/projecticon.svg";
// import { FaPlus, FaTrash } from "react-icons/fa";
// import { BiEditAlt } from "react-icons/bi";
// import Swal from "sweetalert2";
// import Loader from "../../Components/Loader/Loader";
// import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle";
// import ProgressModal from "../../Components/Project/ProgressModal";

// const ProjectInfo = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const { project, loading, error } = useSelector((state) => state.projects);

//   const [showEmployeeModal, setShowEmployeeModal] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleted, setIsDeleted] = useState(false);
//   const [formData, setFormData] = useState({
//     projectName: "",
//     punchType: "",
//     latitude: "",
//     longitude: "",
//     status: "",
//   });
//   const statusText = {
//     in_progress: "In Progress",
//     completed: "Completed",
//     on_hold: "On Hold",
//     cancelled: "Cancelled",
//   };
//   const statusColors = {
//     in_progress: "#f59e0b",   // yellow
//     completed: "#10b981",     // green
//     on_hold: "#3b82f6",       // blue
//     cancelled: "#ef4444",     // red
//   };
//   const [employees, setEmployees] = useState([]);
//   useEffect(() => {
//     if (id) dispatch(getProjectById(id));
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (project) {
//       setFormData({
//         projectName: project.name || "",
//         punchType: project.punch_type || "",
//         latitude: project.latitude || "",
//         longitude: project.longitude || "",
//         status: project.status || "in_progress",
//       });


//       setEmployees(
//         project.employees?.map((emp) => ({
//           id: emp.id,
//           name: emp.name,
//           employeeId: emp.employee_id,
//           email: emp.email,
//           position: emp.designation,
//           department_name: emp.department_name,
//         })) || []
//       );
//     }
//   }, [project]);

//   const handleInfoClick = (employeeId) => {
//     console.log("Navigating to employee info for ID:", employeeId);

//     navigate(`/project/${employeeId}`, { state: { employeeId } });
//   };

// const handleDelete = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This will permanently delete the project!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await dispatch(deleteProject(id)).unwrap();
//           Swal.fire({
//             title: "Deleted!",
//             text: "The project has been successfully deleted.",
//             icon: "success",
//             timer: 1500,
//             showConfirmButton: false,
//           });
//           setIsDeleted(true);
//           navigate("/project");
//         } catch (err) {
//           Swal.fire({
//             title: "Error!",
//             text: "Failed to delete project.",
//             icon: "error",
//           });
//         }
//       }
//     });
//   };

//   const handleEmployeeDelete = async (employeeId) => {
//     const employee = employees.find((emp) => emp.id === employeeId);

//     Swal.fire({
//       title: "Are you sure?",
//       text: `You are about to remove ${employee.name} from this project.`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, remove",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await dispatch(removeEmployeeFromProject({ projectId: id, employeeId })).unwrap();
//           setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId));

//           Swal.fire({
//             title: "Removed!",
//             text: `${employee.name} has been successfully removed from this project.`,
//             icon: "success",
//             timer: 1500,
//             showConfirmButton: false,
//           });
//           dispatch(getProjectById(id));
//         } catch (err) {
//           Swal.fire({
//             title: "Error!",
//             text: "Failed to remove employee from project.",
//             icon: "error",
//           });
//         }
//       }
//     });
//   };



//   const handleSaveFromModal = async (updatedData) => {
//     const updatedProject = {
//       name: updatedData.projectName,
//       punch_type: updatedData.punchInType,
//       latitude: updatedData.latitude,
//       longitude: updatedData.longitude,
//       status: updatedData.status,
//     };


//     try {
//       await dispatch(updateProject({ id, projectData: updatedProject })).unwrap();

//       Swal.fire({
//         title: "Updated!",
//         text: "Project details have been updated successfully.",
//         icon: "success",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       setIsEditModalOpen(false);
//       dispatch(getProjectById(id));
//     } catch (err) {
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to update project.",
//         icon: "error",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <PageWrapper>
//           <Loader />
//         </PageWrapper>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <PageWrapper>
//           <h3 style={{ color: "red" }}>Failed to load project: {error}</h3>
//         </PageWrapper>
//       </>
//     );
//   }

//   return (
//     <>
//       <PageWrapper>
//         <EmployeeTitle
//           iconSrc={FieldShiftIcon}
//           title="Project"
//           subtitle="Manage all Project within the organization"
//           showDropdown={false}
//           showTabs={false}
//           showAddButton={false}
//           showSearch={false}
//           showReportButton={false}
//         />
//         {!isDeleted ? (
//           <>
//             <ProgressContainer>
//               <LeftSide>
//                 <ProgressModal
//                   isOpen={!showEmployeeModal}
//                   status={formData.status}
//                 />
//               </LeftSide>

//               <RightSide>
//                 <ButtonWrapper>
//                   <ActionButton color="edit" onClick={() => setIsEditModalOpen(true)}>
//                     <BiEditAlt style={{ marginRight: "6px" }} />
//                     Edit
//                   </ActionButton>

//                   <ActionButton color="delete" onClick={handleDelete}>
//                     <FaTrash style={{ marginRight: "6px" }} />
//                     Delete
//                   </ActionButton>
//                 </ButtonWrapper>
//               </RightSide>
//             </ProgressContainer>
//             <FormContainer>
//               <div
//                 style={{
//                   alignItems: "flex-start",
//                   gap: "10rem",
//                 }}
//               >
//                 <div style={{ flex: "1" }}>
//                   <FormRow>
//                     <div>
//                       <label>Project name</label>
//                       <InputField value={formData.projectName} disabled />
//                     </div>
//                     <div>
//                       <label>Punch in type</label>
//                       <InputField value={formData.punchType} disabled />
//                     </div>
//                   </FormRow>

//                   <FormRow>
//                     <div>
//                       <label>Latitude</label>
//                       <InputField value={formData.latitude} disabled />
//                     </div>
//                     <div>
//                       <label>Longitude</label>
//                       <InputField value={formData.longitude} disabled />
//                     </div>
//                   </FormRow>
//                 </div>
//               </div>

//             </FormContainer>

//             <EmployeesSection>
//               <EmployeeHeader>
//                 <h2>Employees</h2>
//                 <AddButton onClick={() => setShowEmployeeModal(true)}>
//                   <FaPlus /> Add
//                 </AddButton>
//               </EmployeeHeader>
//               <TableWrapper>
//                 <StyledTable>
//                   <TableHead>
//                     <HeadRow>
//                       <HeadCell>Sl No</HeadCell>
//                       <HeadCell>Employee Name</HeadCell>
//                       <HeadCell>Employee ID</HeadCell>
//                       <HeadCell>Email ID</HeadCell>
//                       <HeadCell>Job Position</HeadCell>
//                       <HeadCell>Department</HeadCell>
//                       <HeadCell>Delete</HeadCell>
//                     </HeadRow>
//                   </TableHead>

//                   <TableBody>
//                     {employees.map((emp, i) => (
//                       <BodyRow
//                         key={emp.id}
//                         className={i % 2 === 0 ? "even" : ""}
//                         // onClick={() => navigate(`/project/${emp.id}`)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <BodyCell>{i + 1}</BodyCell>
//                         <BodyCell>{emp.name}</BodyCell>
//                         <BodyCell>{emp.employeeId}</BodyCell>
//                         <BodyCell>{emp.email}</BodyCell>
//                         <BodyCell>{emp.position}</BodyCell>
//                         <BodyCell>{emp.department_name}</BodyCell>


//                         <BodyCell
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleEmployeeDelete(emp.id);
//                           }}
//                         >
//                           <FaTrash color="red" style={{ cursor: "pointer" }} />
//                         </BodyCell>
//                       </BodyRow>
//                     ))}
//                   </TableBody>

//                 </StyledTable>
//               </TableWrapper>
//             </EmployeesSection>

//             {showEmployeeModal && (
//               <EmployeeModal
//                 onClose={() => setShowEmployeeModal(false)}
//                 projectId={id}
//               />
//             )}

//           </>
//         ) : (
//           <div style={{ textAlign: "center", marginTop: "4rem" }}>
//             <h3>The project has been deleted.</h3>
//           </div>
//         )}
//       </PageWrapper>



//       {isEditModalOpen && (
//         <EditProjectModal
//           isOpen={isEditModalOpen}
//           onClose={() => setIsEditModalOpen(false)}
//           onSave={handleSaveFromModal}
//           projectData={{ ...formData, punchInType: formData.punchType, status: formData.status, }}
//         />
//       )}
//     </>
//   );
// };

// export default ProjectInfo;
