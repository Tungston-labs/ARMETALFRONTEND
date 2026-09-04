import React, { useEffect, useState } from "react";
import {
  Overlay,
  ModalWrapper,
  HeaderBar,
  BackButton,
  ContentArea,
  TwoColumnWrapper,
  LeftSide,
  RightSide,
} from "./RightSideModal.styles";

import { useDispatch, useSelector } from "react-redux";
import EmployeeDetails from "./EmployeeDetails";
import ProgressCard from "./ProgressCard";
import WeeklyTaskGraph from "./WeeklyTaskGraph";

import { fetchEmployeeDashboard } from "../../services/employeeService";
import { getEmployeeDocumentsThunk } from "../../Redux/employeeSlice";

const RightSideModal = ({ isOpen, onClose, employeeId }) => {
  const dispatch = useDispatch();

  const [empData, setEmpData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("work");

  // Documents API returns an OBJECT
  const employeeDocuments = useSelector(
    (state) => state.employee.employeeDocuments || {}
  );

  useEffect(() => {
    if (!isOpen || !employeeId) return;

    setLoading(true);
    setActiveTab("work");

    fetchEmployeeDashboard(employeeId)
      .then((res) => {
        setEmpData(res);
      })
      .catch((err) => {
        console.error("Employee dashboard error:", err);
      })
      .finally(() => setLoading(false));
  }, [isOpen, employeeId]);

  // Fetch documents when Documents tab is selected
  useEffect(() => {
    if (activeTab === "documents" && employeeId) {
      dispatch(getEmployeeDocumentsThunk(employeeId));
    }
  }, [activeTab, employeeId, dispatch]);

  if (!isOpen) return null;

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />

      <ModalWrapper isOpen={isOpen}>
        <HeaderBar>
          <BackButton onClick={onClose}>
            ← Back
          </BackButton>
        </HeaderBar>

        <ContentArea>
          {loading && <p>Loading...</p>}

          {empData && (
            <>
              <EmployeeDetails
                employee={empData}
                documents={employeeDocuments}
                onTabChange={setActiveTab}
              />

              {/* Hide charts on Documents tab */}
              {activeTab !== "documents" && (
                <TwoColumnWrapper>
                  <LeftSide>
                    <ProgressCard
                      attendanceGraph={
                        empData.attendance_graph
                      }
                    />
                  </LeftSide>

                  <RightSide>
                    <WeeklyTaskGraph
                      weeklyData={Object.entries(
                        empData.task_graph || {}
                      ).map(([day, value]) => ({
                        day,
                        tasksCompleted: value,
                      }))}
                    />
                  </RightSide>
                </TwoColumnWrapper>
              )}
            </>
          )}
        </ContentArea>
      </ModalWrapper>
    </>
  );
};

export default RightSideModal;