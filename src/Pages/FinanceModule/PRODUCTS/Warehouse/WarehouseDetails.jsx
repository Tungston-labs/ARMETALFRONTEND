import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiChevronLeft,
  FiEdit2,
  FiTrash2,
  FiBox,
  FiCreditCard,
  FiPackage,
  FiUser,
  FiPhone,
  FiMail,
  FiLayers,
} from "react-icons/fi";

import StatsCards from "../../../../Components/StatsCards/StatsCards";
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
} from "../../../../Redux/finance/Product/warehouseSlice";

import {
  Page,
  Header,
  HeaderBrand,
  BackChevronButton,
  HeaderLeft,
  Title,
  HeaderSubtitle,
  HeaderActions,
  EditButton,
  DeleteButton,
  HeaderWrapper,
  TopSection,
  CompanyCard,
  WarehouseAvatar,
  CompanyDetails,
  CompanyName,
  CompanyText,
  ContactCard,
  ContactItem,
  ContactTitle,
  ContactValue,
} from "./WarehouseDetails.styles";
import ReusableConfirmModal from "../../../../Components/modals/ReusableConfirmModal";

const capitalize = (v) =>
  v
    ? String(v)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "-";

const formatDate = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
};

const formatCount = (value, padBelowTen = false) => {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num) || num < 0) return padBelowTen ? "00" : "0";
  const whole = Math.trunc(num);
  if (padBelowTen && whole < 10) return `0${whole}`;
  return whole.toLocaleString("en-US");
};

const formatUnitsValue = (value) => {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatCapacityValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";
  const str = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(str)) {
    return Number(str).toLocaleString("en-US");
  }
  return str;
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
    const addressParts = [
      d.postal_code ? `PO Box ${d.postal_code}` : "",
      d.address_line_1 || d.address_line1 || d.address || "",
      d.address_line_2 || d.address_line2 || "",
    ].filter(Boolean);

    const cityCountry = [d.city || "", d.country || ""].filter(Boolean).join(", ");

    return {
      code: d.code || "",
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
      storageCapacity: formatCapacityValue(d.storage_capacity),
      companyName: d.company_name || d.company?.name || "-",
      addressLine: addressParts.join(", ") || "-",
      cityCountry: cityCountry || d.location || "-",
      totalProducts: d.total_products ?? 0,
      stockQuantity: d.stock_quantity ?? d.total_units ?? 0,
      lowStock: d.low_stock_products ?? 0,
      outOfStock: d.out_of_stock_products ?? 0,
    };
  }, [warehouseDetail]);

  const headerSubtitle = [
    warehouse.code,
    warehouse.operatingSince ? `Created On : ${warehouse.operatingSince}` : "",
  ]
    .filter(Boolean)
    .join(" , ");

  const cards = useMemo(
    () => [
      {
        count: String(warehouse.type),
        title: "Warehouse Type",
        icon: <FiBox size={20} />,
        backgroundColor: "#E8EDFF",
        iconColor: "#3454B9",
      },
      {
        count: formatCount(warehouse.totalProducts),
        title: "Total Products",
        icon: <FiCreditCard size={20} />,
        backgroundColor: "#E4F7FB",
        iconColor: "#22A6C7",
      },
      {
        count: (
          <span>
            {formatUnitsValue(warehouse.stockQuantity)}{" "}
            <small style={{ fontSize: "0.55em", fontWeight: 500 }}>Units</small>
          </span>
        ),
        title: "Total Stock Quantity",
        icon: <FiPackage size={20} />,
        backgroundColor: "#E9F8ED",
        iconColor: "#16A34A",
      },
      {
        count: formatCount(warehouse.lowStock, true),
        title: "Low Stock Products",
        icon: <FiBox size={20} />,
        backgroundColor: "#FFF2E5",
        iconColor: "#FF8500",
      },
      {
        count: formatCount(warehouse.outOfStock, true),
        title: "Out of Stock Products",
        icon: <FiBox size={20} />,
        backgroundColor: "#FFECEC",
        iconColor: "#FF2D2D",
      },
    ],
    [warehouse],
  );

  const contacts = [
    { icon: FiUser, label: "Manager", value: warehouse.manager },
    { icon: FiPhone, label: "Phone Number", value: warehouse.phoneNumber },
    { icon: FiMail, label: "Email ID", value: warehouse.email },
    { icon: FiLayers, label: "Storage Capacity", value: warehouse.storageCapacity },
  ];

  const editInitialData = useMemo(
    () => (warehouseDetail ? mapWarehouseToForm(warehouseDetail) : undefined),
    [warehouseDetail],
  );

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
      dispatch(fetchWarehouseById(id));
    } catch {
      /* updateError is stored in Redux and displayed in the modal */
    }
  };

  const openDelete = () => {
    dispatch(clearDeleteWarehouseError());
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteWarehouse(id)).unwrap();
      setIsDeleteOpen(false);
      navigate("/product/warehouse");
    } catch {
      setIsDeleteOpen(false);
    }
  };

  const errorMessage = formatApiError(detailError) || "Warehouse not found.";

  const renderHeader = (showActions = false) => (
    <Header>
      <HeaderBrand>
        <BackChevronButton
          type="button"
          onClick={() => navigate("/product/warehouse")}
          aria-label="Back to warehouses"
        >
          <FiChevronLeft size={24} strokeWidth={2.2} />
        </BackChevronButton>

        <HeaderLeft>
          <Title>{showActions ? warehouse.name : "Warehouse"}</Title>
          {showActions && headerSubtitle && (
            <HeaderSubtitle>{headerSubtitle}</HeaderSubtitle>
          )}
        </HeaderLeft>
      </HeaderBrand>

      {showActions && (
        <HeaderActions>
          <EditButton type="button" onClick={openEdit} disabled={!warehouseDetail}>
            <FiEdit2 size={14} /> EDIT
          </EditButton>
          <DeleteButton
            type="button"
            onClick={openDelete}
            disabled={!warehouseDetail}
          >
            <FiTrash2 size={14} /> DELETE
          </DeleteButton>
        </HeaderActions>
      )}
    </Header>
  );

  if (!detailLoading && detailError && !warehouseDetail) {
    return (
      <Page>
        {renderHeader(false)}
        <div
          style={{
            marginTop: 20,
            padding: 15,
            borderRadius: 6,
            background: "#FDEAEA",
            color: "#D64545",
            fontSize: 13,
          }}
        >
          {errorMessage}
        </div>
      </Page>
    );
  }

  return (
    <Page>
      {renderHeader(true)}

      {deleteError && (
        <div
          style={{
            margin: "12px 0",
            padding: 12,
            borderRadius: 6,
            background: "#FDEAEA",
            color: "#D64545",
            fontSize: 13,
          }}
        >
          {formatApiError(deleteError)}
        </div>
      )}

      <StatsCards cards={cards} loading={detailLoading} />

      <HeaderWrapper style={{ marginTop: 16 }}>
        <TopSection>
          <CompanyCard>
            <WarehouseAvatar aria-hidden="true">
              <FiBox size={24} />
            </WarehouseAvatar>

            <CompanyDetails>
              <CompanyName title={warehouse.name}>{warehouse.name}</CompanyName>
              <CompanyText title={warehouse.companyName}>
                {warehouse.companyName}
              </CompanyText>
              <CompanyText title={warehouse.addressLine}>
                {warehouse.addressLine}
              </CompanyText>
              <CompanyText title={warehouse.cityCountry}>
                {warehouse.cityCountry}
              </CompanyText>
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
