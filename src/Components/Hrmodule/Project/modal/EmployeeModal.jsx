import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalContainer,
  Header,
  SearchBar,
  TableWrapper,
  Table,
  ButtonRow,
  Button,
  Checkbox,CenterText,
  Thead,
  Th,
  Tr,
  Td,
  EmptyRowText,
  StyledTable,
} from "./EmployeeModal.Styles";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeesNotInProject,
  assignEmployees,
  getProjectById,
} from "../../../Redux/fieldShiftSlice";
import Swal from "sweetalert2";

const EmployeeModal = ({ onClose, projectId, project }) => {
  const dispatch = useDispatch();

  const { employeesNotInProject = [], isLoading } = useSelector(
    (state) => state.projects
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (projectId) {
      dispatch(getEmployeesNotInProject(projectId));
    }
  }, [dispatch, projectId]);

  const filteredEmployees = (employeesNotInProject || []).filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = async () => {
    if (selected.length === 0) {
      Swal.fire("Select at least one employee!", "", "warning");
      return;
    }

    try {
      // Merge new employees with existing
      const currentEmployeeIds = project?.employees?.map((emp) => emp.id) || [];
      const mergedEmployeeIds = Array.from(
        new Set([...currentEmployeeIds, ...selected])
      );

      // Call assignEmployees
      await dispatch(
        assignEmployees({ projectId, employeeIds: mergedEmployeeIds })
      ).unwrap();

      Swal.fire("Success!", "Employees added successfully.", "success");
      onClose();

      // Refresh project data
      dispatch(getProjectById(projectId));
    } catch (error) {
      Swal.fire("Error", "Failed to add employees.", "error");
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <Header>
          <span> Add Employees to Project</span>
        </Header>
        <SearchBar>
          <div className="input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button onClick={() => setSearchTerm("")}>Clear</button>
          )}
        </SearchBar>
        
        <TableWrapper>
          {isLoading ? (
            <CenterText>Loading employees...</CenterText>
          ) : (
            <StyledTable>
              <Thead>
                <tr>
                  <Th>Sl No</Th>
                  <Th>Employee Name</Th>
                  <Th>Designation</Th>
                  <Th>Department</Th>
                  <Th>Select</Th>
                </tr>
              </Thead>
              <tbody>
                {(filteredEmployees || []).length === 0 ? (
                  <tr>
                    <EmptyRowText colSpan={6}>
                      No unassigned employees found
                    </EmptyRowText>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, index) => (
                    <Tr key={emp.id}>
                      <Td>{String(index + 1).padStart(3, "0")}</Td>
                      <Td>{emp.name}</Td>
                      <Td>{emp.designation}</Td>
                      <Td>{emp.department_name || "—"}</Td>
                      <Td>
                        <Checkbox
                          type="checkbox"
                          checked={selected.includes(emp.id)}
                          onChange={() => toggleSelect(emp.id)}
                        />
                      </Td>
                    </Tr>
                  ))
                )}
              </tbody>
            </StyledTable>
          )}
        </TableWrapper>
        <ButtonRow>
          <Button className="cancel" onClick={onClose}>
            Cancel
          </Button>
          <Button className="add" onClick={handleAdd}>
            Add
          </Button>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeModal;
