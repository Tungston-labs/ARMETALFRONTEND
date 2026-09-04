import React from "react";
import { formatDisplayDate } from "./AttendanceSummary.utils";

import {
    ModalOverlay,
    AttendanceModal,
    ModalHeader,
    ModalHeaderContent,
    ModalTitle,
    ModalSubtitle,
    CloseButton,
    FormGroup,
    FormLabel,
    AttendanceTypeOptions,
    AttendanceTypeOption,
    AttendanceRadio,
    AttendanceTypeCard,
    RadioCircle,
    AttendanceTypeContent,
    AttendanceTypeTitle,
    NoteWrapper,
    NoteInput,
    AttendanceUpdateBox,
    AttendanceUpdateTitle,
    UpdateItem,
    UpdateLabel,
    UpdateValue,
    ModalFooter,
    CancelButton,
    SaveButton,
} from "./AttendanceSummary.styles";

const EditAttendanceModal = ({
    selectedDay,
    editForm,
    saveError,
    updateLoading,
    onFormChange,
    onSave,
    onClose,
}) => {
    const hasEditHistory = Boolean(selectedDay?.updated_by);
    const isNoteEmpty = !editForm.note?.trim();

    return (
        <ModalOverlay onClick={onClose}>
            <AttendanceModal onClick={(e) => e.stopPropagation()}>
                {/* ================= HEADER ================= */}
                <ModalHeader>
                    <ModalHeaderContent>
                        <ModalTitle>Edit Attendance</ModalTitle>
                        <ModalSubtitle>
                            {formatDisplayDate(selectedDay?.date)}
                        </ModalSubtitle>
                    </ModalHeaderContent>

                    <CloseButton type="button" onClick={onClose}>
                        ×
                    </CloseButton>
                </ModalHeader>
              
                {/* ================= ATTENDANCE TYPE ================= */}
                <FormGroup>
                    <FormLabel>Attendance Type</FormLabel>

                    <AttendanceTypeOptions>
                        {/* PAID */}
                        <AttendanceTypeOption>
                            <AttendanceRadio
                                type="radio"
                                name="attendanceType"
                                value="Paid"
                                checked={editForm.attendanceType === "Paid"}
                                onChange={onFormChange}
                            />

                            <AttendanceTypeCard
                                type="Paid"
                                selected={editForm.attendanceType === "Paid"}
                            >
                                <RadioCircle
                                    type="Paid"
                                    selected={editForm.attendanceType === "Paid"}
                                />

                                <AttendanceTypeContent>
                                    <AttendanceTypeTitle type="Paid">
                                        Paid
                                    </AttendanceTypeTitle>
                                </AttendanceTypeContent>
                            </AttendanceTypeCard>
                        </AttendanceTypeOption>

                        {/* UNPAID */}
                        <AttendanceTypeOption>
                            <AttendanceRadio
                                type="radio"
                                name="attendanceType"
                                value="Unpaid"
                                checked={editForm.attendanceType === "Unpaid"}
                                onChange={onFormChange}
                            />

                            <AttendanceTypeCard
                                type="Unpaid"
                                selected={editForm.attendanceType === "Unpaid"}
                            >
                                <RadioCircle
                                    type="Unpaid"
                                    selected={editForm.attendanceType === "Unpaid"}
                                />

                                <AttendanceTypeContent>
                                    <AttendanceTypeTitle type="Unpaid">
                                        Unpaid
                                    </AttendanceTypeTitle>
                                </AttendanceTypeContent>
                            </AttendanceTypeCard>
                        </AttendanceTypeOption>
                    </AttendanceTypeOptions>
                </FormGroup>

                {/* ================= NOTE / REASON ================= */}
                <FormGroup>
                    <FormLabel>
                        Note / Reason <span style={{ color: "#dc2626" }}>*</span>
                    </FormLabel>

                    <NoteWrapper>
                        <NoteInput
                            name="note"
                            value={editForm.note}
                            onChange={onFormChange}
                            placeholder="Enter note or reason..."
                            rows={4}
                            maxLength={500}
                            required
                        />
                    </NoteWrapper>

                    {isNoteEmpty && (
                        <div
                            style={{
                                color: "#dc2626",
                                fontSize: "12px",
                                marginTop: "4px",
                            }}
                        >
                            Note is required.
                        </div>
                    )}
                </FormGroup>

                {/* ================= ATTENDANCE UPDATE PREVIEW ================= */}
                <AttendanceUpdateBox>
                    <AttendanceUpdateTitle>Attendance Update</AttendanceUpdateTitle>

                    <UpdateItem>
                        <UpdateLabel>Attendance Type:</UpdateLabel>
                        <UpdateValue>{editForm.attendanceType}</UpdateValue>
                    </UpdateItem>

                    <UpdateItem>
                        <UpdateLabel>Note:</UpdateLabel>
                        <UpdateValue>{editForm.note || "No note added"}</UpdateValue>
                    </UpdateItem>
                    <UpdateItem>
                            <UpdateLabel>Updated By:</UpdateLabel>
                            <UpdateValue>
                                {selectedDay.updated_by}
                                {selectedDay.updated_by_role
                                    ? ` (${selectedDay.updated_by_role})`
                                    : ""}
                            </UpdateValue>
                        </UpdateItem>

                        <UpdateItem>
                            <UpdateLabel>Updated At:</UpdateLabel>
                            <UpdateValue>
                                {selectedDay.updated_at || "-"}
                            </UpdateValue>
                        </UpdateItem>
                </AttendanceUpdateBox>

                {saveError && (
                    <div
                        style={{
                            color: "#dc2626",
                            fontSize: "13px",
                            marginTop: "10px",
                        }}
                    >
                        {saveError}
                    </div>
                )}

                {/* ================= FOOTER ================= */}
                <ModalFooter>
                    <CancelButton type="button" onClick={onClose}>
                        Cancel
                    </CancelButton>

                    <SaveButton
                        type="button"
                        onClick={onSave}
                        disabled={updateLoading || isNoteEmpty}
                    >
                        {updateLoading ? "Saving..." : "Save Changes"}
                    </SaveButton>
                </ModalFooter>
            </AttendanceModal>
        </ModalOverlay>
    );
};

export default EditAttendanceModal;