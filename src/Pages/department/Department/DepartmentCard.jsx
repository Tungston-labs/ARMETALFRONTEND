import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  Container,
  HeaderWrapper,
  CardsGrid,
  Card,
  CardHeader,
  DepartmentName,
  ActiveBadge,
  DepartmentHead,
  TotalEmployee,
  StatusRow,
  Present,
  Leave,
  CardBottom,
  EmployeeCount,
  EmployeeImage,
  EmployeeNumber,
  ViewButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateText,
} from "./DepartmentCard.Styles";

import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import DepartmentModal from "./modal/DepartmentModal";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";

import {
  getDepartments,
  createNewDepartment,
} from "../../../Redux/departmentSlice";

import { getAllEmployees } from "../../../Redux/employeeSlice";
import SkeletonCard from "../../../Components/Skeleton/ SkeletonCard";
import { FiInbox } from "react-icons/fi";

const DepartmentCards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  // =====================================================
  // REDUX DATA
  // =====================================================

  const {
    list: departments = [],
    loading,
    error,
  } = useSelector((state) => state.departments);

  // Employee list, used to resolve department_head (an ID) into a name
  const { employeeList = [] } = useSelector((state) => state.employee);

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [showDepartmentModal, setShowDepartmentModal] =
    useState(false);

  const [modalMode, setModalMode] = useState("add");

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  // =====================================================
  // GET DEPARTMENTS + EMPLOYEES
  // =====================================================

  useEffect(() => {
    dispatch(
      getDepartments({
        page: 1,
        search: "",
      })
    );

    // Needed to resolve department_head id -> employee name
    dispatch(getAllEmployees({ page: 1, search: "" }));
  }, [dispatch]);

  // =====================================================
  // RESOLVE DEPARTMENT HEAD NAME FROM ID
  // =====================================================

  const getDepartmentHeadName = (headId) => {
    if (!headId) return "—";

    const match = employeeList.find(
      (emp) => Number(emp.id) === Number(headId)
    );

    if (!match) return "—";

    return (
      match.name ||
      match.employee_name ||
      match.full_name ||
      `Employee #${match.id}`
    );
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (value) => {
    setSearch(value);

    dispatch(
      getDepartments({
        page: 1,
        search: value,
      })
    );
  };

  // =====================================================
  // VIEW DEPARTMENT
  // =====================================================

  const handleViewDepartment = (id) => {
    navigate(`/department/${id}`);
  };

  // =====================================================
  // ADD DEPARTMENT
  // =====================================================

  const handleAddDepartment = () => {
    setModalMode("add");
    setSelectedDepartment(null);
    setShowDepartmentModal(true);
  };

  // =====================================================
  // EDIT DEPARTMENT
  // =====================================================

  const handleEditDepartment = (department) => {
    setModalMode("edit");

    setSelectedDepartment({
      id: department.id,

      departmentName:
        department.departmentName ||
        department.name ||
        "",

      departmentCode:
        department.departmentCode ||
        department.department_code ||
        department.code ||
        "",

      headOfDepartment:
        department.headOfDepartment ||
        department.head_of_department ||
        department.department_head ||
        department.head ||
        "",
    });

    setShowDepartmentModal(true);
  };

  // =====================================================
  // CREATE / UPDATE DEPARTMENT
  // =====================================================

  const handleDepartmentSubmit = async (data) => {
    try {
      // =================================================
      // CREATE
      // =================================================

      if (modalMode === "add") {
        const payload = {
          name: data.departmentName.trim(),
          department_code: data.departmentCode.trim(),
          department_head: data.headOfDepartment || "",   // was: head_of_department
        };

        console.log(
          "Creating department:",
          payload
        );

        const result = await dispatch(
          createNewDepartment(payload)
        ).unwrap();

        console.log(
          "Department created successfully:",
          result
        );

        // ===============================================
        // CLOSE MODAL ONLY ON SUCCESS
        // ===============================================

        setShowDepartmentModal(false);

        // ===============================================
        // REFRESH DEPARTMENT LIST
        // ===============================================

        dispatch(
          getDepartments({
            page: 1,
            search: search,
          })
        );

        return result;
      }

      // =================================================
      // UPDATE
      // =================================================

      if (modalMode === "edit") {
        console.log(
          "Update Department:",
          data
        );

        // Update API will be added here later.
      }
    } catch (error) {
      // =================================================
      // IMPORTANT
      // =================================================
      //
      // DO NOT swallow the error here.
      //
      // DepartmentModal needs this error so it can
      // display:
      //
      // "Department code already exists."
      //
      // under the Department Code input.
      // =================================================

      console.error(
        "Department save failed:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // DEPARTMENT DATA
  // =====================================================

  const departmentList = departments;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Container>
      {/* =================================================
          HEADER
      ================================================= */}

      <HeaderWrapper>
        <ReusableHeader
          title="Department"
          breadcrumbs={["Department"]}
          buttonText="+ ADD NEW DEPARTMENT"
          onButtonClick={handleAddDepartment}
        />
      </HeaderWrapper>

      {/* =================================================
          SEARCH
      ================================================= */}

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        showSearch
      searchPlaceholder="Search by Department Name "
      />

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div>
          Loading departments...
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div>
          {typeof error === "string"
            ? error
            : "Failed to load departments"}
        </div>
      )}

      {/* =================================================
          DEPARTMENT CARDS
      ================================================= */}
<CardsGrid>
  {loading ? (
    Array.from({ length: 8 }).map((_, index) => (
      <SkeletonCard key={index} />
    ))
     ) : departmentList.length === 0 ? (
   <EmptyState>
         <EmptyStateIcon>
             <FiInbox />
         </EmptyStateIcon>
 
         <EmptyStateTitle>
             No Department Found
         </EmptyStateTitle>
 
         <EmptyStateText>
             There are no department matching your
             current search or filter selection.
         </EmptyStateText>
     </EmptyState>
  ) : (
    departmentList.map((department) => {
      const departmentId = department.id;

      const departmentName =
        department.name || "Department";

      const departmentHead =
        department.department_head?.name ||
        department.department_head?.employee_name ||
        department.department_head?.full_name ||
        department.department_head?.employee_code ||
        "—";

      const totalEmployees =
        department.employee_count ?? 0;

      const presentEmployees =
        department.attendance_employee_count ?? 0;

      const leaveEmployees =
        department.todays_leave_employee_count ?? 0;

      return (
<Card
  key={departmentId}
  onClick={() => handleViewDepartment(departmentId)}
>

          {/* HEADER */}
          <CardHeader>
            <DepartmentName>
              {departmentName}
            </DepartmentName>

            <ActiveBadge>
              Active
            </ActiveBadge>
          </CardHeader>

          {/* DEPARTMENT HEAD */}
          <DepartmentHead>
            Head Of The Department:{" "}
            <strong>
              {departmentHead}
            </strong>
          </DepartmentHead>

          {/* TOTAL EMPLOYEES */}
          <TotalEmployee>
            Total Employee:{" "}
            {String(totalEmployees).padStart(2, "0")}
          </TotalEmployee>

          {/* STATUS */}
          <StatusRow>
            <Present>
              Present Today:{" "}
              {String(presentEmployees).padStart(2, "0")}
            </Present>

            <Leave>
              On Leave Today:{" "}
              {String(leaveEmployees).padStart(2, "0")}
            </Leave>
          </StatusRow>

          {/* BOTTOM */}
          <CardBottom>
            <EmployeeCount>
              <EmployeeImage>
                {departmentHead !== "—"
                  ? departmentHead
                      .trim()
                      .charAt(0)
                      .toUpperCase()
                  : "-"}
              </EmployeeImage>

              <EmployeeNumber>
                {String(totalEmployees).padStart(2, "0")}
              </EmployeeNumber>
            </EmployeeCount>
{/* 
            <ViewButton
              type="button"
              onClick={() =>
                handleViewDepartment(departmentId)
              }
            >
              VIEW DEPARTMENT
            </ViewButton> */}
          </CardBottom>

        </Card>
      );
    })
  )}
</CardsGrid>

      {/* =================================================
          ADD / EDIT DEPARTMENT MODAL
      ================================================= */}

      <DepartmentModal
        isOpen={showDepartmentModal}
        onClose={() =>
          setShowDepartmentModal(false)
        }
        mode={modalMode}
        departmentData={selectedDepartment}
        departments={departments}
        onSubmit={handleDepartmentSubmit}
      />
    </Container>
  );
};

export default DepartmentCards;