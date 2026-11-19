import React, { useEffect } from "react";
import {
  Overlay,
  ModalCard,
  ModalHeader,
  CloseIcon,
  RequestInfo,
  ModalBody,
  SectionTitle,
  CountBadge,
  LeaveItem,
  EmptyState,
  ModalFooter,
  CloseButton,
} from "./ConflictModal.style";

const halfLabel = (type) =>
  type === "forenoon" ? " (forenoon)" : type === "afternoon" ? " (afternoon)" : "";

function ConflictSection({ title, variant, items, formatDate }) {
  if (!items?.length) return null;

  return (
    <>
      <SectionTitle $variant={variant}>
        {title}
        <CountBadge $variant={variant}>{items.length}</CountBadge>
      </SectionTitle>

      {items.map((item) => (
        <LeaveItem key={item.leave_id} $variant={variant}>
          <div>
            <span className="name">{item.employee_name}</span>
            <span className="type">{item.leave_type}</span>
          </div>
          <div className="dates">
            {formatDate(item.from_date)}
            {halfLabel(item.from_date_type)} - {formatDate(item.to_date)}
            {halfLabel(item.to_date_type)}
          </div>
        </LeaveItem>
      ))}
    </>
  );
}

export default function ConflictModal({
  leave,
  employees,
  alsoRequested,
  loading,
  formatDate,
  onClose,
}) {
  // close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const department = leave?.employee?.department || "department";
  const nothing = !employees?.length && !alsoRequested?.length;

  return (
    <Overlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h3>Leave overlap in {department}</h3>
          <CloseIcon type="button" onClick={onClose} aria-label="Close">
            &times;
          </CloseIcon>
        </ModalHeader>

        <RequestInfo>
          <strong>{leave?.employee?.name}</strong>{" "}
          <span>
            · {formatDate(leave?.from_date)} - {formatDate(leave?.to_date)}
          </span>
        </RequestInfo>

        <ModalBody>
          {loading ? (
            <EmptyState>Loading...</EmptyState>
          ) : nothing ? (
            <EmptyState>
              No one else in this department has leave on these dates.
            </EmptyState>
          ) : (
            <>
              <ConflictSection
                title="Already on leave (approved)"
                variant="approved"
                items={employees}
                formatDate={formatDate}
              />
              <ConflictSection
                title="Also requested (pending)"
                variant="pending"
                items={alsoRequested}
                formatDate={formatDate}
              />
            </>
          )}
        </ModalBody>

        <ModalFooter>
          <CloseButton type="button" onClick={onClose}>
            Close
          </CloseButton>
        </ModalFooter>
      </ModalCard>
    </Overlay>
  );
}