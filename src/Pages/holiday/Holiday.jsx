import React, { useEffect, useState } from 'react';
import { Container} from './Holiday.styles';
import { useDispatch, useSelector } from "react-redux";
import { getHolidays, addHoliday, removeHoliday } from '../../Redux/holidaySlice';
import { fetchHolidayTypes } from '../../services/holidayService';
import ReusableHeader from '../../Components/ReusableTable/ReusableHeader';
import ReusableTable from '../../Components/ReusableTable/ReusableTable';
import ReusableFilter from '../../Components/ReusableTable/ReusableFilter';
import Pagination from "../../Components/Pagination/Pagination";
import NoEmployeeFound from '../../Components/No found/Noemployeefound';
import HolidayModal from './modal/HolidayModal';
import { getHolidayColumns } from './Holidaycolumns';
import ReusableConfirmModal from '../../Components/modals/ReusableConfirmModal';

const DEFAULT_HOLIDAY_TYPES = [
  { key: "public", label: "Public Holiday" },
  { key: "company", label: "Company Holiday" },
  { key: "company_off_day", label: "Company Off Day" },
  { key: "second_saturday", label: "Second Saturdays" },
];

const formatDateToISO = (dateStr) => {
  const date = new Date(dateStr);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const PAGE_SIZE = 20;

const HolidayManager = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const {
    list: holidays = [],
    loading,
    totalPages = 1,
    currentPage = 1,
    // `count` should be the server-side total record count for this
    // Redux slice (e.g. from a DRF-style paginated response). Adjust
    // this field name if your holidaySlice stores it under something
    // else (e.g. totalCount, totalItems).
    count,
  } = useSelector(state => state.holidays);

  const [searchText, setSearchText] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [formError, setFormError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    date: "",
    off_day_weekday: ""
  });
  const [typeOptions, setTypeOptions] = useState(DEFAULT_HOLIDAY_TYPES);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  useEffect(() => {
    fetchHolidayTypes()
      .then(data => {
        if (data?.holiday_types?.length) {
          setTypeOptions(data.holiday_types);
        } else {
          setTypeOptions(DEFAULT_HOLIDAY_TYPES);
        }
      })
      .catch(() => {
        setTypeOptions(DEFAULT_HOLIDAY_TYPES);
      });
  }, []);

  useEffect(() => {
    dispatch(getHolidays(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", type: "", date: "", off_day_weekday: "" });
    setFormError("");
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFormError("");
  };

  const handleAdd = () => {
    const { name, type, date, off_day_weekday } = formData;
    const trimmedName = name.trim();

    if (!trimmedName || !type) {
      setFormError("⚠️ Please fill in all required fields.");
      return;
    }

    if (trimmedName.length > 250) {
      setFormError("⚠️ Holiday name cannot exceed 250 characters.");
      return;
    }

    if (type === "company_off_day" && off_day_weekday === "") {
      setFormError("⚠️ Please select a weekly off day.");
      return;
    }

    if (type !== "company_off_day" && !date) {
      setFormError("⚠️ Please select a date.");
      return;
    }

    let formattedDate = null;

    if (type !== "company_off_day") {
      formattedDate = formatDateToISO(date);

      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setFormError("⚠️ Holiday date cannot be in the past.");
        return;
      }

      const isDateAlreadyExists = holidays.some(
        (holiday) => holiday.date === formattedDate
      );

      if (isDateAlreadyExists) {
        setFormError("⚠️ A holiday already exists on this date.");
        return;
      }
    }

    const payload = {
      description: trimmedName,
      holiday_type: type,
    };

    if (type === "company_off_day") {
      payload.off_day_weekday = Number(off_day_weekday);
      payload.date = new Date().toISOString().split("T")[0];
    } else {
      payload.date = formattedDate;
    }

    dispatch(addHoliday(payload))
      .unwrap()
      .then(() => {
        dispatch(getHolidays(page));
        setIsModalOpen(false);
        resetForm();
      })
      .catch((err) => {
        setFormError(err?.message || "Failed to create holiday");
      });
  };

  const handleDeleteClick = (id) => {
    setSelectedIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await dispatch(removeHoliday(selectedIdToDelete));
    dispatch(getHolidays(page));
    setShowDeleteModal(false);
    setSelectedIdToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedIdToDelete(null);
  };

  // Search (by holiday name) + month filter, applied together
  const filteredHolidays = holidays
    .filter((holiday) => {
      if (!searchText.trim()) return true;
      return holiday.description
        ?.toLowerCase()
        .includes(searchText.trim().toLowerCase());
    })
    .filter((holiday) => {
      if (!selectedMonth) return true;
      if (!holiday.date) return false;
      const d = new Date(holiday.date);
      const holidayMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      return holidayMonth === selectedMonth;
    });

  const sortedHolidays = [...filteredHolidays].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(b.date) - new Date(a.date);
  });

  const columns = getHolidayColumns({
    currentPage,
    pageSize: PAGE_SIZE,
    onDeleteClick: handleDeleteClick,
  });

  return (
    <>
      <Container>
        <ReusableHeader
          title="Holiday"
          breadcrumbs={["Holiday"]}
          buttonText="+ ADD NEW HOLIDAY"
          onButtonClick={handleOpenModal}
        />

        <ReusableFilter
          showSearch
          search={searchText}
          onSearch={setSearchText}
          searchPlaceholder="Search Holiday Name"
          showDate
          date={selectedMonth}
          onDate={setSelectedMonth}
        />
          <ReusableTable columns={columns} data={sortedHolidays} loading={loading} />
        <ReusableConfirmModal
          show={showDeleteModal}
          title="Confirm Deletion"
          message="Are you sure you want to delete this Holiday?"
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
          loadingText="Deleting..."
          onConfirm={confirmDelete}
          onClose={cancelDelete}
        />

        <Pagination
          currentPage={page}
          totalPages={Number(totalPages) || 1}
          totalRecords={count ?? sortedHolidays.length}
          onPageChange={handlePageChange}
        />
      </Container>

      <HolidayModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={formData}
        onChange={handleChange}
        onAdd={handleAdd}
        formError={formError}
        typeOptions={typeOptions}
      />
    </>
  );
};

export default HolidayManager;