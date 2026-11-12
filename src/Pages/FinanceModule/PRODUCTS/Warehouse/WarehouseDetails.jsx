import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiEdit2, FiTrash2, FiBox, FiArchive, FiPackage, FiAlertTriangle,
  FiUser, FiPhone, FiMail, FiLayers,
} from "react-icons/fi";

import StatsCards from "../../../../Components/StatsCards/StatsCards";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import WarehouseModal from "./modal/WarehouseModal";

import {
  buildWarehousePayload,
  mapWarehouseToForm,
  formatApiError,
} from "./modal/warehouseMapper";

import {
  fetchWarehouseById,
  updateWarehouse,
  deleteWarehouse,
  clearWarehouseDetail,
  clearUpdateWarehouseError,
  clearDeleteWarehouseError,
} from "../../../../Redux/finance/Product/warehouseSlice";

import {
  Page, Header, HeaderActions, EditButton, DeleteButton,
  HeaderWrapper, TopSection, CompanyCard, CompanyDetails, CompanyName,
  CompanyText, ContactCard, ContactItem, ContactTitle, ContactValue,
} from "./WarehouseDetails.styles";
import ReusableConfirmModal from "../../../../Components/modals/ReusableConfirmModal";

const capitalize = (v) =>
  v
    ? String(v)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "-";

const formatSar = (value) => {
  const num = Number(value ?? 0);
  const safe = Number.isFinite(num) ? num : 0;
  return `SAR ${safe.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const WarehouseDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    warehouseDetail,
    detailLoading,
    detailError,
    updating,
    updateError,
    deleteError,
  } = useSelector((state) => state.warehouse);

  useEffect(() => {
    if (!id) return undefined;
    dispatch(fetchWarehouseById(id));
    return () => {
      dispatch(clearWarehouseDetail());
      dispatch(clearUpdateWarehouseError());
      dispatch(clearDeleteWarehouseError());
    };
  }, [dispatch, id]);

  const warehouse = useMemo(() => {
    const d = warehouseDetail || {};
    return {
      name: d.warehouse_name || "Warehouse",
      type: capitalize(d.warehouse_type),
      status: capitalize(d.status),
      operatingSince: formatDate(d.operating_since || d.created_at),
      manager:
        (typeof d.manager === "string" ? d.manager : "") ||
        d.manager_name ||
        d.manager?.name ||
        d.manager?.full_name ||
        "-",
      phoneNumber: d.phone_number || "-",
      email: d.email || "-",
      storageCapacity: d.storage_capacity || "-",
      capacityUsed: d.capacity_used || d.storage_capacity || "-",
      companyName: d.company_name || d.company?.name || "-",
      addressLine1: d.address_line_1 || d.address_line1 || d.address || "-",
      addressLine2: d.address_line_2 || d.address_line2 || "-",
      city: d.location || d.city || d.country || "-",
      totalUnits: d.total_units ?? d.stock_quantity ?? 0,
      stockValue: formatSar(d.stock_value ?? 0),
    };
  }, [warehouseDetail]);

  const cards = useMemo(
    () => [
      { count: String(warehouse.type), title: "Warehouse Type", icon: <FiBox size={20} />, backgroundColor: "#E8EDFF", iconColor: "#3454B9" },
      { count: String(Number(warehouse.totalUnits) || 0), title: "Total Units", icon: <FiArchive size={20} />, backgroundColor: "#E4F7FB", iconColor: "#22A6C7" },
      { count: warehouse.stockValue, title: "Stock Value", icon: <FiPackage size={20} />, backgroundColor: "#E9F8ED", iconColor: "#16A34A" },
      { count: String(warehouse.capacityUsed), title: "Capacity Used", icon: <FiPackage size={20} />, backgroundColor: "#FFF2E5", iconColor: "#FF8500" },
      { count: String(warehouse.status), title: "Status", icon: <FiAlertTriangle size={20} />, backgroundColor: "#EEF2FF", iconColor: "#4F46E5" },
    ],
    [warehouse],
  );

  const contacts = [
    { icon: FiUser, label: "Manager", value: warehouse.manager },
    { icon: FiPhone, label: "Phone Number", value: warehouse.phoneNumber },
    { icon: FiMail, label: "Email", value: warehouse.email },
    { icon: FiLayers, label: "Storage Capacity", value: warehouse.storageCapacity },
  ];

  /* Edit form values, built from the loaded record */
  const editInitialData = useMemo(
    () => (warehouseDetail ? mapWarehouseToForm(warehouseDetail) : undefined),
    [warehouseDetail],
  );

  /* ---------------- EDIT ---------------- */

  const openEdit = () => {
    dispatch(clearUpdateWarehouseError());
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    if (updating) return;
    setIsEditOpen(false);
    dispatch(clearUpdateWarehouseError());
  };

  const handleUpdate = async (formData) => {
    try {
      await dispatch(
        updateWarehouse({ id, warehouseData: buildWarehousePayload(formData) }),
      ).unwrap();

      setIsEditOpen(false);
      dispatch(fetchWarehouseById(id)); // refresh with the full record
    } catch (err) {
      /* updateError is in the store; the modal shows it */
    }
  };

  /* ---------------- DELETE ---------------- */

  const openDelete = () => {
    dispatch(clearDeleteWarehouseError());
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteWarehouse(id)).unwrap();
      setIsDeleteOpen(false);
      navigate(-1); // back to the list; or navigate("/your/list/path")
    } catch (err) {
      setIsDeleteOpen(false); // deleteError is shown on the page
    }
  };

  const errorMessage = formatApiError(detailError) || "Warehouse not found.";

  const renderHeader = (showActions = false) => (
    <Header>
      <ReusableHeader title="Warehouses" breadcrumbs={["Product", "Warehouses"]} />

      {showActions && (
        <HeaderActions>
          <EditButton type="button" onClick={openEdit} disabled={!warehouseDetail}>
            <FiEdit2 size={12} /> EDIT
          </EditButton>
          <DeleteButton type="button" onClick={openDelete} disabled={!warehouseDetail}>
            <FiTrash2 size={12} /> DELETE
          </DeleteButton>
        </HeaderActions>
      )}
    </Header>
  );

  if (!detailLoading && detailError && !warehouseDetail) {
    return (
      <Page>
        {renderHeader(false)}
        <div style={{ marginTop: 20, padding: 15, borderRadius: 6, background: "#FDEAEA", color: "#D64545", fontSize: 13 }}>
          {errorMessage}
        </div>
      </Page>
    );
  }

  return (
    <Page>
      {renderHeader(true)}

      {deleteError && (
        <div style={{ margin: "12px 0", padding: 12, borderRadius: 6, background: "#FDEAEA", color: "#D64545", fontSize: 13 }}>
          {formatApiError(deleteError)}
        </div>
      )}

      <StatsCards cards={cards} loading={detailLoading} />

      <HeaderWrapper style={{ marginTop: 16 }}>
        <TopSection>
          <CompanyCard>
            <CompanyDetails>
              <CompanyName title={warehouse.name}>{warehouse.name}</CompanyName>
              <CompanyText>{warehouse.companyName}</CompanyText>
              <CompanyText>{warehouse.addressLine1}</CompanyText>
              <CompanyText>{warehouse.addressLine2}</CompanyText>
              <CompanyText>{warehouse.city}</CompanyText>
            </CompanyDetails>
          </CompanyCard>

          <ContactCard>
            {contacts.map(({ icon: Icon, label, value }) => (
              <ContactItem key={label}>
                <ContactTitle>
                  <Icon size={15} strokeWidth={1.5} />
                  <span>{label}</span>
                </ContactTitle>
                <ContactValue title={String(value)}>{value}</ContactValue>
              </ContactItem>
            ))}
          </ContactCard>
        </TopSection>
      </HeaderWrapper>

      {/* EDIT MODAL: mounted only while open, so it always starts from fresh data */}
      {isEditOpen && editInitialData && (
        <WarehouseModal
          isOpen
          isEdit
          initialData={editInitialData}
          onClose={closeEdit}
          onSave={handleUpdate}
          submitting={updating}
          error={formatApiError(updateError)}
        />
      )}

      {/* DELETE CONFIRMATION */}
      <ReusableConfirmModal
        show={isDeleteOpen}
        title="Delete Warehouse"
        message={`Are you sure you want to delete "${warehouse.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loadingText="Deleting..."
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteOpen(false)}
      />
    </Page>
  );
};

export default WarehouseDetails;