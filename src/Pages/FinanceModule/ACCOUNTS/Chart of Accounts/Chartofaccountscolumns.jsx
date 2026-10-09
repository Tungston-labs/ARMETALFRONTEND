import React from "react";
import { CiEdit } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { GoVerified } from "react-icons/go";
import { MdAccountBalance } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import {
  Status,
  ActionWrapper,
  EditButton,
  DeleteButton,
} from "./ChartOfAccounts.styles";
import { formatAmount, padCount } from "./Usechartofaccounts";


export const getStatsCards = ({
  stats,
  showAll,
  setStatusFilter,
  setTypeFilter,
}) => [
  {
    title: "Total Accounts",
    count: stats.total,
    icon: <MdAccountBalance />,
    backgroundColor: "#E8F5E9",
    iconColor: "#2E7D32",
    onClick: showAll,
  },
  {
    title: "Active Accounts",
    count: stats.active,
    icon: <FiCalendar />,
    backgroundColor: "#EDE7F6",
    iconColor: "#6A1B9A",
    onClick: () => setStatusFilter("Active"),
  },
  {
    title: "Asset Accounts",
    count: padCount(stats.assets),
    icon: <GoVerified />,
    backgroundColor: "#E0F7EF",
    iconColor: "#00A86B",
    onClick: () => setTypeFilter("Assets"),
  },
  {
    title: "Liability Accounts",
    count: padCount(stats.liabilities),
    icon: <FiCalendar />,
    backgroundColor: "#FFF3E0",
    iconColor: "#EF6C00",
    onClick: () => setTypeFilter("Liabilities"),
  },
  {
    title: "Equity Accounts",
    count: padCount(stats.equity),
    icon: <FiCalendar />,
    backgroundColor: "#FDECEA",
    iconColor: "#D32F2F",
    onClick: () => setTypeFilter("Equity"),
  },
];
export const getAccountColumns = ({ onEdit, onDelete }) => [
  {
    key: "code",
    header: "Code",
    render: (account) => account.code,
  },
  {
    key: "name",
    header: "Account Name",
    render: (account) => account.name,
  },
  {
    key: "parent",
    header: "Parent Account",
    render: (account) => account.parent,
  },
  {
    key: "category",
    header: "Category",
    render: (account) => account.category,
  },
  {
    key: "balance",
    header: "Balance",
    render: (account) => formatAmount(account.balance),
  },
  {
    key: "status",
    header: "Status",
    render: (account) => (
      <Status className={String(account.status).toLowerCase()}>
        {account.status}
      </Status>
    ),
  },
  {
    key: "action",
    header: "Action",
    render: (account) => (
      <ActionWrapper>
        <EditButton
          type="button"
          title="Edit"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(account);
          }}
        >
          <CiEdit />
        </EditButton>

        <DeleteButton
          type="button"
          title="Delete"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(account);
          }}
        >
          <RxCross2 />
        </DeleteButton>
      </ActionWrapper>
    ),
  },
];

export default getAccountColumns;