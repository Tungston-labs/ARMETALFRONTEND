import React, { useEffect, useState } from "react";
import { Container, LoaderOverlay } from "./Visa.Styles";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllEmployees,
  deleteEmployeeById,
  getUpcomingExpiryEmployees,
} from "../../Redux/employeeSlice";
import Loader from "../../Components/Loader/Loader";
import Pagination from "../../Components/Pagination/Pagination";
import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle";
import {
  BodyCell,
  BodyRow,
  EmptyRow,
  HeadCell,
  HeadRow,
  StyledTable,
  TableBody,
  TableHead,
  TableWrapper,
} from "../leaveDetails/EmployeeList.styles";
import NoEmployeeFound from "../../Components/No found/Noemployeefound";
const EmployeeList = () => {
  const dispatch = useDispatch();

  const { employeeList, loading, pagination } = useSelector(
    (state) => state.employees,
  );
  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );

  const country = user?.company?.country || "IN";
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [expiryFilter, setExpiryFilter] = useState("");

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (expiryFilter) {
      dispatch(
        getUpcomingExpiryEmployees({
          expiryType: expiryFilter,
          page,
          search: debouncedSearch,
        }),
      );
    } else {
      dispatch(getAllEmployees({ page, search: debouncedSearch }));
    }
  }, [dispatch, page, debouncedSearch, expiryFilter]);

  useEffect(() => {
    if (pagination?.total_pages && page > pagination.total_pages) {
      setPage(pagination.total_pages);
    }
  }, [pagination?.total_pages]);

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };

  const formatDate = (date) => {
    if (!date) return "----";

    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "short" });
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const currentPage = pagination?.current_page || 1;
  const handlePageChange = (newPage) => {
    if (!newPage || newPage < 1) return;
    setPage(newPage);
  };
  return (
    <>
      <Container>
        {loading && (
          <LoaderOverlay>
            <Loader />
          </LoaderOverlay>
        )}

        <EmployeeTitle
          iconSrc={EmployeeIcon}
          showAddButton={false}
          searchValue={searchText}
          showSearch={true}
          showDropdown={true}
          selectedDropdownValue={expiryFilter}
          dropdownOptions={[
            { id: "visa", name: "Visa Expiry (next 30 days)" },
            { id: "contract", name: "Contract Expiry (next 30 days)" },
          ]}
          onDropdownChange={(value) => {
            setExpiryFilter(value);
            setPage(1);
          }}
          onSearchChange={(value) => handleSearch(value)}
          showBackArrow={false}
          showReportButton={false}
          showTabs={true}
        />
        <TableWrapper>
          <StyledTable>
            <TableHead>
              <HeadRow>
                <HeadCell>Sl No</HeadCell>
                <HeadCell>Employee Name</HeadCell>
                <HeadCell>Employee ID</HeadCell>
                <HeadCell>Email</HeadCell>
                <HeadCell>
                  {country === "IN"
                    ? "Contract Expiry Date"
                    : "Visa Expiry Date"}
                </HeadCell>
              </HeadRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    style={{ textAlign: "center", padding: "1rem" }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : employeeList?.length > 0 ? (
                employeeList.map((emp, index) => (
                  <BodyRow key={emp.id}>
                    <BodyCell>{index + 1 + (currentPage - 1) * 20}</BodyCell>
                    <BodyCell style={{ textTransform: "capitalize" }}>
                      {emp.name}
                    </BodyCell>
                    <BodyCell>{emp.employee_id}</BodyCell>
                    <BodyCell>{emp.email}</BodyCell>
                    <BodyCell>
                      {country === "IN"
                        ? formatDate(emp.contract_expiry_date)
                        : formatDate(emp.visa_expiry_date)}
                    </BodyCell>
                  </BodyRow>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <NoEmployeeFound searchTerm={debouncedSearch} />
                  </td>
                </tr>
              )}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        <Pagination
          currentPage={currentPage}
          totalPages={pagination?.total_pages || 1}
          totalRecords={pagination?.count ?? pagination?.total_items ?? 0}
          onPageChange={handlePageChange}
        />
      </Container>
    </>
  );
};

export default EmployeeList;
