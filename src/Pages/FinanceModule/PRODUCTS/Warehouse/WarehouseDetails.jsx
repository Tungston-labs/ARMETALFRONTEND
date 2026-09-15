// // import React, { useEffect, useMemo } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useParams } from "react-router-dom";

// // import {
// //   FiEdit2,
// //   FiTrash2,
// //   FiBox,
// //   FiArchive,
// //   FiPackage,
// //   FiAlertTriangle,
// // } from "react-icons/fi";

// // import WarehouseInfoCard from "../../../../Components/WarehouseDetails/WarehouseInfoCard";
// // import WarehouseContactCard from "../../../../Components/WarehouseDetails/WarehouseContactCard";

// // import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
// // import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

// // import StatsCards from "../../../../Components/StatsCards/StatsCards";

// // import { fetchWarehouseById } from "../../../../Redux/warehouseSlice";

// // import { Page, DetailsGrid } from "./WarehouseDetails.styles";

// // const WarehouseDetails = () => {
// //   const dispatch = useDispatch();
// //   const { id } = useParams();

// //   const { warehouseDetail, detailLoading, detailError } = useSelector(
// //     (state) => state.warehouse,
// //   );

// //   useEffect(() => {
// //     if (!id) {
// //       return;
// //     }

// //     dispatch(fetchWarehouseById(id));
// //   }, [dispatch, id]);

// //   const warehouse = useMemo(() => {
// //     const data = warehouseDetail || {};

// //     return {
// //       name: data.warehouse_name || data.name || "Warehouse",
// //       date: data.operating_since || data.created_at || "-",
// //       type: data.warehouse_type || "-",
// //       totalProducts: data.total_products ?? 0,
// //       stockQuantity: data.stock_quantity ?? 0,
// //       lowStockProducts: data.low_stock_products ?? 0,
// //       outOfStockProducts: data.out_of_stock_products ?? 0,
// //       manager: data.manager_name || data.manager || "-",
// //       phoneNumber: data.phone_number || "-",
// //       email: data.email || "-",
// //       storageCapacity: data.storage_capacity || "-",
// //       companyName: data.company_name || data.company?.name || "-",
// //       addressLine1: data.address_line_1 || data.address || "-",
// //       addressLine2: data.address_line_2 || data.city || "-",
// //       city: data.city || "-",
// //     };
// //   }, [warehouseDetail]);

// //   const warehouseCards = useMemo(
// //     () => [
// //       {
// //         count: String(warehouse.type || "-"),
// //         title: "Warehouses Type",
// //         icon: <FiBox size={20} />,
// //         backgroundColor: "#E8EDFF",
// //         iconColor: "#3454B9",
// //       },
// //       {
// //         count: String(warehouse.totalProducts ?? 0),
// //         title: "Total Products",
// //         icon: <FiArchive size={20} />,
// //         backgroundColor: "#E4F7FB",
// //         iconColor: "#22A6C7",
// //       },
// //       {
// //         count: String(warehouse.stockQuantity ?? 0),
// //         title: "Total Stock Quantity",
// //         icon: <FiPackage size={20} />,
// //         backgroundColor: "#E9F8ED",
// //         iconColor: "#16A34A",
// //       },
// //       {
// //         count: String(warehouse.lowStockProducts ?? 0),
// //         title: "Low Stock Products",
// //         icon: <FiPackage size={20} />,
// //         backgroundColor: "#FFF2E5",
// //         iconColor: "#FF8500",
// //       },
// //       {
// //         count: String(warehouse.outOfStockProducts ?? 0),
// //         title: "Out of Stock Products",
// //         icon: <FiAlertTriangle size={20} />,
// //         backgroundColor: "#FFECEC",
// //         iconColor: "#FF2D2D",
// //       },
// //     ],
// //     [warehouse],
// //   );

// //   const handleEditWarehouse = () => {
// //     console.log("Edit warehouse:", warehouse);
// //   };

// //   const handleDeleteWarehouse = () => {
// //     const confirmed = window.confirm(
// //       `Are you sure you want to delete "${warehouse.name}"?`,
// //     );

// //     if (!confirmed) {
// //       return;
// //     }

// //     console.log("Delete warehouse:", warehouse);
// //   };

// //   return (
// //     <Page>
// //       <ReusableHeader
// //         title={`${warehouse.name} - ${warehouse.date}`}
// //         breadcrumbs={["Dashboard", "Products", "Warehouse"]}
// //       >
// //         <HeaderButton onClick={handleEditWarehouse}>
// //           <FiEdit2 />
// //           EDIT
// //         </HeaderButton>

// //         <HeaderButton $variant="delete" onClick={handleDeleteWarehouse}>
// //           <FiTrash2 />
// //           DELETE
// //         </HeaderButton>
// //       </ReusableHeader>

// //       {detailError && (
// //         <div style={{ color: "#c0392b", margin: "14px 0" }}>
// //           {typeof detailError === "string"
// //             ? detailError
// //             : detailError?.detail || "Failed to fetch warehouse detail"}
// //         </div>
// //       )}

// //       <StatsCards cards={warehouseCards} loading={detailLoading} />

// //       <DetailsGrid>
// //         <WarehouseInfoCard
// //           image="/warehouse-logo.png"
// //           warehouseName={warehouse.name}
// //           companyName={warehouse.companyName}
// //           addressLine1={warehouse.addressLine1}
// //           addressLine2={warehouse.addressLine2}
// //           city={warehouse.city}
// //         />

// //         <WarehouseContactCard
// //           manager={warehouse.manager}
// //           phoneNumber={warehouse.phoneNumber}
// //           email={warehouse.email}
// //           storageCapacity={warehouse.storageCapacity}
// //         />
// //       </DetailsGrid>
// //     </Page>
// //   );
// // };

// // export default WarehouseDetails;

// import React, { useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";

// import {
//   FiEdit2,
//   FiTrash2,
//   FiBox,
//   FiArchive,
//   FiPackage,
//   FiAlertTriangle,
// } from "react-icons/fi";

// import WarehouseInfoCard from "../../../../Components/WarehouseDetails/WarehouseInfoCard";
// import WarehouseContactCard from "../../../../Components/WarehouseDetails/WarehouseContactCard";

// import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
// import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

// import StatsCards from "../../../../Components/StatsCards/StatsCards";

// import { fetchWarehouseById } from "../../../../Redux/warehouseSlice";

// import { Page, DetailsGrid } from "./WarehouseDetails.styles";

// const WarehouseDetails = () => {
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   const { warehouseDetail, detailLoading, detailError } = useSelector(
//     (state) => state.warehouse,
//   );

//   useEffect(() => {
//     if (id === undefined || id === null || id === "") {
//       return;
//     }

//     dispatch(fetchWarehouseById(id));
//   }, [dispatch, id]);

//   const warehouse = useMemo(() => {
//     const data = warehouseDetail || {};

//     const manager =
//       data?.manager_name ||
//       data?.manager?.name ||
//       data?.manager?.full_name ||
//       data?.manager?.username ||
//       (typeof data?.manager === "string" ? data.manager : "-");

//     return {
//       name: data.warehouse_name || data.name || "Warehouse",

//       date: data.operating_since || data.created_at || "-",

//       type: data.warehouse_type || "-",

//       totalProducts: data.total_products ?? 0,

//       stockQuantity: data.stock_quantity ?? 0,

//       lowStockProducts: data.low_stock_products ?? 0,

//       outOfStockProducts: data.out_of_stock_products ?? 0,

//       manager,

//       phoneNumber: data.phone_number || "-",

//       email: data.email || "-",

//       storageCapacity: data.storage_capacity ?? "-",

//       companyName: data.company_name || data.company?.name || "-",

//       addressLine1: data.address_line_1 || data.address || "-",

//       addressLine2: data.address_line_2 || "-",

//       city: data.city || "-",
//     };
//   }, [warehouseDetail]);

//   const warehouseCards = useMemo(
//     () => [
//       {
//         count: String(warehouse.type || "-"),

//         title: "Warehouses Type",

//         icon: <FiBox size={20} />,

//         backgroundColor: "#E8EDFF",

//         iconColor: "#3454B9",
//       },

//       {
//         count: String(warehouse.totalProducts ?? 0),

//         title: "Total Products",

//         icon: <FiArchive size={20} />,

//         backgroundColor: "#E4F7FB",

//         iconColor: "#22A6C7",
//       },

//       {
//         count: String(warehouse.stockQuantity ?? 0),

//         title: "Total Stock Quantity",

//         icon: <FiPackage size={20} />,

//         backgroundColor: "#E9F8ED",

//         iconColor: "#16A34A",
//       },

//       {
//         count: String(warehouse.lowStockProducts ?? 0),

//         title: "Low Stock Products",

//         icon: <FiPackage size={20} />,

//         backgroundColor: "#FFF2E5",

//         iconColor: "#FF8500",
//       },

//       {
//         count: String(warehouse.outOfStockProducts ?? 0),

//         title: "Out of Stock Products",

//         icon: <FiAlertTriangle size={20} />,

//         backgroundColor: "#FFECEC",

//         iconColor: "#FF2D2D",
//       },
//     ],
//     [warehouse],
//   );

//   const handleEditWarehouse = () => {
//     console.log("Edit warehouse:", warehouse);
//   };

//   const handleDeleteWarehouse = () => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${warehouse.name}"?`,
//     );

//     if (!confirmed) {
//       return;
//     }

//     console.log("Delete warehouse:", warehouse);
//   };

//   return (
//     <Page>
//       <ReusableHeader
//         title={`${warehouse.name} - ${warehouse.date}`}
//         breadcrumbs={["Dashboard", "Products", "Warehouse"]}
//       >
//         <HeaderButton onClick={handleEditWarehouse}>
//           <FiEdit2 />
//           EDIT
//         </HeaderButton>

//         <HeaderButton $variant="delete" onClick={handleDeleteWarehouse}>
//           <FiTrash2 />
//           DELETE
//         </HeaderButton>
//       </ReusableHeader>

//       {detailError && (
//         <div
//           style={{
//             color: "#c0392b",
//             margin: "14px 0",
//           }}
//         >
//           {typeof detailError === "string"
//             ? detailError
//             : detailError?.detail ||
//               detailError?.message ||
//               "Failed to fetch warehouse detail"}
//         </div>
//       )}

//       <StatsCards cards={warehouseCards} loading={detailLoading} />

//       <DetailsGrid>
//         <WarehouseInfoCard
//           image="/warehouse-logo.png"
//           warehouseName={warehouse.name}
//           companyName={warehouse.companyName}
//           addressLine1={warehouse.addressLine1}
//           addressLine2={warehouse.addressLine2}
//           city={warehouse.city}
//         />

//         <WarehouseContactCard
//           manager={warehouse.manager}
//           phoneNumber={warehouse.phoneNumber}
//           email={warehouse.email}
//           storageCapacity={warehouse.storageCapacity}
//         />
//       </DetailsGrid>
//     </Page>
//   );
// };

// export default WarehouseDetails;

import React, { useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";

import {
  FiEdit2,
  FiTrash2,
  FiBox,
  FiArchive,
  FiPackage,
  FiAlertTriangle,
} from "react-icons/fi";

import WarehouseInfoCard from "../../../../Components/WarehouseDetails/WarehouseInfoCard";

import WarehouseContactCard from "../../../../Components/WarehouseDetails/WarehouseContactCard";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

import StatsCards from "../../../../Components/StatsCards/StatsCards";

import {
  fetchWarehouseById,
  clearWarehouseDetail,
} from "../../../../Redux/warehouseSlice";

import { Page, DetailsGrid } from "./WarehouseDetails.styles";

const WarehouseDetails = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  console.log("=================================");
  console.log("WarehouseDetails URL:", window.location.href);
  console.log("WarehouseDetails ID:", id);
  console.log("=================================");

  const { warehouseDetail, detailLoading, detailError } = useSelector(
    (state) => state.warehouse,
  );

  /* =====================================================
       FETCH WAREHOUSE DETAILS
    ===================================================== */

  useEffect(() => {
    if (id === undefined || id === null || id === "") {
      return;
    }

    dispatch(fetchWarehouseById(id));

    return () => {
      dispatch(clearWarehouseDetail());
    };
  }, [dispatch, id]);

  /* =====================================================
       API DATA
    ===================================================== */

  const warehouse = useMemo(() => {
    const data = warehouseDetail || {};

    const manager =
      data?.manager_name ||
      data?.manager?.name ||
      data?.manager?.full_name ||
      data?.manager?.username ||
      (typeof data?.manager === "string" ? data.manager : "-");

    return {
      name: data?.warehouse_name || "Warehouse",

      date: data?.operating_since || data?.created_at || "-",

      type: data?.warehouse_type || "-",

      totalProducts: data?.total_products ?? 0,

      stockQuantity: data?.stock_quantity ?? 0,

      lowStockProducts: data?.low_stock_products ?? 0,

      outOfStockProducts: data?.out_of_stock_products ?? 0,

      manager,

      phoneNumber: data?.phone_number || "-",

      email: data?.email || "-",

      storageCapacity: data?.storage_capacity ?? "-",

      companyName: data?.company_name || data?.company?.name || "-",

      addressLine1: data?.address_line_1 || data?.address || "-",

      addressLine2: data?.address_line_2 || "-",

      city: data?.city || "-",
    };
  }, [warehouseDetail]);

  /* =====================================================
       KPI CARDS
    ===================================================== */

  const warehouseCards = useMemo(
    () => [
      {
        count: String(warehouse.type || "-"),

        title: "Warehouses Type",

        icon: <FiBox size={20} />,

        backgroundColor: "#E8EDFF",

        iconColor: "#3454B9",
      },

      {
        count: String(warehouse.totalProducts ?? 0),

        title: "Total Products",

        icon: <FiArchive size={20} />,

        backgroundColor: "#E4F7FB",

        iconColor: "#22A6C7",
      },

      {
        count: String(warehouse.stockQuantity ?? 0),

        title: "Total Stock Quantity",

        icon: <FiPackage size={20} />,

        backgroundColor: "#E9F8ED",

        iconColor: "#16A34A",
      },

      {
        count: String(warehouse.lowStockProducts ?? 0),

        title: "Low Stock Products",

        icon: <FiPackage size={20} />,

        backgroundColor: "#FFF2E5",

        iconColor: "#FF8500",
      },

      {
        count: String(warehouse.outOfStockProducts ?? 0),

        title: "Out of Stock Products",

        icon: <FiAlertTriangle size={20} />,

        backgroundColor: "#FFECEC",

        iconColor: "#FF2D2D",
      },
    ],
    [warehouse],
  );

  /* =====================================================
       EDIT
    ===================================================== */

  const handleEditWarehouse = () => {
    console.log("Edit warehouse:", warehouseDetail);
  };

  /* =====================================================
       DELETE
    ===================================================== */

  const handleDeleteWarehouse = () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${warehouse.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    console.log("Delete warehouse:", warehouseDetail);
  };

  /* =====================================================
       INVALID ID
    ===================================================== */

  if (id === undefined || id === null || id === "") {
    return (
      <Page>
        <ReusableHeader
          title="Warehouse"
          breadcrumbs={["Dashboard", "Products", "Warehouse"]}
        />

        <div
          style={{
            color: "#c0392b",
            marginTop: 20,
          }}
        >
          Invalid warehouse ID.
        </div>
      </Page>
    );
  }

  /* =====================================================
       API ERROR / 404
    ===================================================== */

  if (!detailLoading && detailError && !warehouseDetail) {
    const errorMessage =
      typeof detailError === "string"
        ? detailError
        : detailError?.detail || detailError?.message || "Warehouse not found.";

    return (
      <Page>
        <ReusableHeader
          title="Warehouse"
          breadcrumbs={["Dashboard", "Products", "Warehouse"]}
        />

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

  /* =====================================================
       RENDER
    ===================================================== */

  return (
    <Page>
      <ReusableHeader
        title={`${warehouse.name} - ${warehouse.date}`}
        breadcrumbs={["Dashboard", "Products", "Warehouse"]}
      >
        <HeaderButton onClick={handleEditWarehouse}>
          <FiEdit2 />
          EDIT
        </HeaderButton>

        <HeaderButton $variant="delete" onClick={handleDeleteWarehouse}>
          <FiTrash2 />
          DELETE
        </HeaderButton>
      </ReusableHeader>

      {detailError && (
        <div
          style={{
            color: "#c0392b",
            margin: "14px 0",
          }}
        >
          {typeof detailError === "string"
            ? detailError
            : detailError?.detail ||
              detailError?.message ||
              "Failed to fetch warehouse detail"}
        </div>
      )}

      <StatsCards cards={warehouseCards} loading={detailLoading} />

      <DetailsGrid>
        <WarehouseInfoCard
          image="/warehouse-logo.png"
          warehouseName={warehouse.name}
          companyName={warehouse.companyName}
          addressLine1={warehouse.addressLine1}
          addressLine2={warehouse.addressLine2}
          city={warehouse.city}
        />

        <WarehouseContactCard
          manager={warehouse.manager}
          phoneNumber={warehouse.phoneNumber}
          email={warehouse.email}
          storageCapacity={warehouse.storageCapacity}
        />
      </DetailsGrid>
    </Page>
  );
};

export default WarehouseDetails;
