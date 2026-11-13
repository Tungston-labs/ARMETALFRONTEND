import React from "react";

import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import CustomerModal from "./modal/CustomerModal";
import { useCustomerList } from "./Usecustomerlist ";
import { getCustomerColumns } from "./Customerlist.columns";
import TopNotification from "../../../../Components/Topnotification/Topnotification";
import ReusableConfirmModal from "../../../../Components/modals/ReusableConfirmModal";
import { ExportButton } from "./CustomerList.styles";
import { FiDownload } from "react-icons/fi";

const STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
    { label: "Archived", value: "archived" },
];

const CustomerList = () => {
    const {
        customers,
        totalPages,
        loading,
        selectedCustomer,
        cards,
        totalRecords,
        openMenuId,
        toggleActionsMenu,
        handleCreateInvoice,
        handleViewLedger,
        handleViewOverview,

        notification,
        dismissNotification,

        search,
        setSearch,
        status,
        setStatus,
        page,
        setPage,

        isCustomerModalOpen,
        modalMode,
        editingCustomer,
        deleteTarget,
        cancelDeleteCustomer,
        confirmDeleteCustomer,
        handleAddCustomer,
        handleEditCustomer,
        handleArchiveCustomer,
        handleRestoreCustomer,
        handleDeleteCustomerPermanently,
        handleSaveCustomer,
        handleCloseCustomerModal,
    } = useCustomerList();

    const customerColumns = getCustomerColumns({
         status,
        openMenuId,
        toggleActionsMenu,
        handleViewOverview,
        handleCreateInvoice,
        handleViewLedger,
        handleEditCustomer,
        handleArchiveCustomer,
        handleRestoreCustomer,
        handleDeleteCustomerPermanently,
    });

    return (
        <div style={{ padding: 20 }}>
            <TopNotification
                notification={notification}
                onClose={dismissNotification}
            />

            <ReusableHeader
                title="Customer List"
                breadcrumbs={["Sales", "Customer"]}
                buttonText="+ NEW CUSTOMER"
                onButtonClick={handleAddCustomer}
                >
            <ExportButton type="button">
                    <FiDownload />
                    Export
                </ExportButton>
            </ReusableHeader>
 
            <StatsCards cards={cards} loading={loading} />

            <ReusableFilter
                search={search}
                onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                showSearch
                searchPlaceholder="Search Customer"
                showStatus
                status={status}
                statuses={STATUS_OPTIONS}
                onStatus={(value) => {
                    setStatus(value);
                    setPage(1);
                }}
            />

            <ReusableTable
                columns={customerColumns}
                data={customers}
                loading={loading}
                autoLayout
            />

            <ReusablePagination
                currentPage={page}
                totalPages={totalPages}
                totalRecords={totalRecords || 0}
                onPageChange={setPage}
            />

            <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={handleCloseCustomerModal}
                mode={modalMode}
                customer={selectedCustomer || editingCustomer}
                onSave={handleSaveCustomer}
            />
              <ReusableConfirmModal
                show={Boolean(deleteTarget)}
                title="Delete customer permanently?"
                message={`"${deleteTarget?.customer_name ?? ""}" will be removed permanently. This cannot be undone.`}
                confirmText="Delete"
                loadingText="Deleting..."
                confirmVariant="danger"
                onConfirm={confirmDeleteCustomer}
                onClose={cancelDeleteCustomer}
            />
        </div>
    );
};

export default CustomerList;