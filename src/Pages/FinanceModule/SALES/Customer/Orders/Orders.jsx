import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FiFileText, FiCheckCircle, FiXCircle, FiDollarSign } from "react-icons/fi";

import { ordersColumns } from "./ordersColumns";
import ReusableFilter from "../../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../../Components/StatsCards/StatsCards";

import {
  getCustomerOrders,
  getCustomerOrdersSummary,
} from "../../../../../Redux/finance/Sales/CustomerSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { customerId } = useParams();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    orders,
    ordersTotalPages,
    ordersLoading,
    ordersSummary,
    ordersSummaryLoading,
  } = useSelector((state) => state.customer);

  /* =========================================================
     FETCH ORDERS
  ========================================================= */

  useEffect(() => {
    if (!customerId) return;

    dispatch(
      getCustomerOrders({
        customerId,
        params: {
          page: currentPage,
          search: search || undefined,
        },
      })
    );
  }, [dispatch, customerId, currentPage, search]);

  /* =========================================================
     FETCH ORDERS SUMMARY
  ========================================================= */

  useEffect(() => {
    if (!customerId) return;

    dispatch(getCustomerOrdersSummary(customerId));
  }, [dispatch, customerId]);

  /* =========================================================
     STATS
  ========================================================= */

  const orderStats = [
    {
      title: "Total Orders",
      count: ordersSummary?.total_orders ?? 0,
      icon: <FiFileText />,
      backgroundColor: "#E8F1FF",
      iconColor: "#3478F6",
    },
    {
      title: "Open Orders",
      count: ordersSummary?.open_orders ?? 0,
      icon: <FiDollarSign />,
      backgroundColor: "#FFF4E5",
      iconColor: "#F59E0B",
    },
    {
      title: "Completed Orders",
      count: ordersSummary?.completed_orders ?? 0,
      icon: <FiCheckCircle />,
      backgroundColor: "#E8F8EF",
      iconColor: "#22A06B",
    },
    {
      title: "Order Value",
      count: Number(ordersSummary?.total_order_amount ?? 0).toLocaleString(
        "en-US",
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      ),
      icon: <FiXCircle />,
      backgroundColor: "#FDECEC",
      iconColor: "#E5484D",
    },
  ];

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <>
      <StatsCards cards={orderStats} loading={ordersSummaryLoading} />

      <ReusableFilter
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setCurrentPage(1);
        }}
        showSearch
      />

      <ReusableTable
        columns={ordersColumns}
        data={orders}
        loading={ordersLoading}
      />

      <ReusablePagination
        currentPage={currentPage}
        totalPages={ordersTotalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Orders;