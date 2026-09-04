import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  IconButton,
} from "./Company.Styles";

import ReusableTable from "../../../Components/ReusableTable/ReusableTable";
import { FaTrashAlt } from "react-icons/fa";
import { TbPencilMinus } from "react-icons/tb";
import {
  FaBuilding,
  FaUserCheck,
  FaUserTimes,
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import {
  getCompanies,
  removeCompany,
} from "../../../Redux/superAdminSlice";

import { useNavigate } from "react-router-dom";

import ReusableHeader from "../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../Components/ReusableTable/ReusableFilter";
import ReusableConfirmModal from "../../../Components/modals/ReusableConfirmModal";

import StatsCards from "../../../Components/StatsCards/StatsCards";

const CompanyTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    companies = [],
    loading,
    pagination,
  } = useSelector((state) => state.superAdmin);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // =====================================================
  // GET COMPANIES
  // =====================================================

  useEffect(() => {
    dispatch(
      getCompanies({
        page,
        search: search.trim(),
      })
    );
  }, [dispatch, page, search]);

  // =====================================================
  // ADD COMPANY
  // =====================================================

  const handleAdd = () => {
    navigate("/addcompany");
  };

  // =====================================================
  // EDIT COMPANY
  // =====================================================

  const handleEdit = (company) => {
    navigate(`/addcompany/${company.id}`);
  };

  // =====================================================
  // VIEW COMPANY
  // =====================================================

  const handleView = (company) => {
    navigate(`/superadmin/view/${company.id}`);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (id) => {
    setSelectedCompanyId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedCompanyId) return;

    dispatch(removeCompany(selectedCompanyId));

    setShowDeleteModal(false);
    setSelectedCompanyId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCompanyId(null);
  };

  // =====================================================
  // STATS CARDS
  // =====================================================

  const statsCards = useMemo(() => {
    const totalCompanies =
      pagination?.count ?? companies.length;

    const activeCompanies = companies.filter(
      (company) =>
        company.status === "active" ||
        company.is_active === true
    ).length;

    const inactiveCompanies = companies.filter(
      (company) =>
        company.status === "inactive" ||
        company.is_active === false
    ).length;

    const totalEmployees = companies.reduce(
      (total, company) =>
        total +
        (Number(company.number_of_employees) || 0),
      0
    );

    return [
      {
        title: "Total Companies",
        count: totalCompanies,
        icon: <FaBuilding />,
        iconColor: "#2563EB",
        backgroundColor: "#E8F0FF",
      },
      {
        title: "Active Companies",
        count: activeCompanies,
        icon: <FaUserCheck />,
        iconColor: "#16A34A",
        backgroundColor: "#E8F7ED",
      },
      {
        title: "Inactive Companies",
        count: inactiveCompanies,
        icon: <FaUserTimes />,
        iconColor: "#DC2626",
        backgroundColor: "#FDECEC",
      },
      {
        title: "Total Employees",
        count: totalEmployees,
        icon: <FaUsers />,
        iconColor: "#9333EA",
        backgroundColor: "#F3E8FF",
      },
    ];
  }, [companies, pagination]);

  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns = useMemo(
    () => [
      {
        header: "Sl no",
        accessor: "slNo",
        sortable: false,

        render: (row, index) =>
          (page - 1) * 7 + index + 1,
      },

      {
        header: "Company name",
        accessor: "name",
      },

      {
        header: "Company ID",
        accessor: "company_id",
      },

      {
        header: "Contact details",
        accessor: "contact_number",
      },

      {
        header: "No of Employees",
        accessor: "number_of_employees",
      },

      {
        header: "Edit",
        accessor: "edit",
        sortable: false,

        render: (row) => (
          <IconButton
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(row);
            }}
          >
            <TbPencilMinus />
          </IconButton>
        ),
      },

      {
        header: "Delete",
        accessor: "delete",
        sortable: false,

        render: (row) => (
          <IconButton
            danger
            onClick={(event) => {
              event.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <FaTrashAlt />
          </IconButton>
        ),
      },
    ],
    [page]
  );

  return (
    <Container>
      {/* ================= HEADER ================= */}

      <ReusableHeader
        title="Companies"
        breadcrumbs={[
          "Companies",
        ]}
        buttonText="+ ADD NEW COMPANY"
        onButtonClick={handleAdd}
      />

      {/* ================= STATS ================= */}

      <StatsCards cards={statsCards} />

      {/* ================= FILTER ================= */}

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        showSearch
        searchPlaceholder="Search by company name or ID"
      />

      {/* ================= TABLE ================= */}

      <ReusableTable
        columns={columns}
        data={companies}
        loading={loading}
        onRowClick={handleView}
      />

      {/* ================= DELETE MODAL ================= */}

      <ReusableConfirmModal
        show={showDeleteModal}
        title="Confirm Deletion"
        message="Are you sure you want to delete this company?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loadingText="Deleting..."
        onConfirm={confirmDelete}
        onClose={cancelDelete}
      />
    </Container>
  );
};

export default CompanyTable;