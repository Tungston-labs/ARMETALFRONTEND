import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getAttendanceDetail } from "../../Redux/attendanceSlice";
import { Container,} from "./Attendance.Style";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Loader from '../../Components/Loader/Loader';
import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle";
import EmployeeHeader from "../../Components/header/EmployeeHeader";
import AttendanceDetailsContainer from "../../Components/attendance/AttendanceDetailsContainer";
import ReusableHeader from "../../Components/ReusableTable/ReusableHeader";

const TimesheetPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { attendanceDetail, detailLoading } = useSelector(
    (state) => state.attendance
  );

  const [selectedDate, setSelectedDate] = useState("");
  const previousPath = location.state?.from || '/employee-attendance';

  useEffect(() => {
    if (!id) return;
    dispatch(getAttendanceDetail({ attendanceId: id, date: selectedDate }));
  }, [id, selectedDate, dispatch]);

  useEffect(() => {
    if (!selectedDate && attendanceDetail?.date) {
      setSelectedDate(attendanceDetail.date);
    }
  }, [attendanceDetail]);

  if (detailLoading) return <Loader />;

  const employee = attendanceDetail?.employee ?? {};

  return (
    <Container>
 <ReusableHeader
  title="Employee Attendance"
   breadcrumbs={["Employees","Employee Attendance"]}
  showBack={true}
/>

      <EmployeeHeader employee={employee} editable={false} />

      <AttendanceDetailsContainer
        attendanceDetail={attendanceDetail}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
    </Container>
  );
};

export default TimesheetPage;

