import React, { useEffect, useState } from "react";
import {
  ViewContainer,
  DepartmentPanel,
  MainContent,
  ToggleArrow,
  CardItem,
  EmployeeContainer,
  EmployeeItem,
  PanelContainer,
  TaskList,
  DatePickerWrapper,
  TaskHeader,
  EmployeePanelWrapper,
  StyledNoSelectionMessage, 
  TaskLeft, 
  TaskContent, 
  TaskBottom,
  Title,
  SearchInput,
  Heading
} from './DailyTask.Styles';
import TaskIcon from '../../assets/task.svg';
import { useDispatch, useSelector } from "react-redux";
import { getDepartmentsMin, getEmployeesByDepartmentMini } from "../../Redux/departmentSlice";
import { getTasks } from "../../Redux/dailyTaskSlice";
import { PiUserCirclePlusThin } from "react-icons/pi";

const Card = ({ dept, onClick, isActive }) => (
  <CardItem onClick={onClick} $isActive={isActive}>
    <strong>{dept.name}</strong>
  </CardItem>
);


const EmployeeList = ({ departmentId, onSelectEmployee, selectedEmployeeId }) => {
  const employeesData = useSelector(
    (state) => state.departments.departmentEmployeesMini || []
  );

    const [employeeSearch, setEmployeeSearch] = useState("");


  const filteredEmployees = employeesData.filter((emp) =>
    emp.name.toLowerCase().includes(employeeSearch.toLowerCase())
  );

  return (
    <EmployeeContainer>
  <Heading>Employees</Heading>
  <SearchInput
        type="text"
        placeholder="Search Employee..."
        value={employeeSearch}
        onChange={(e) => setEmployeeSearch(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
     {filteredEmployees.map((emp) => (
    <EmployeeItem
      key={emp.employee_id}
      onClick={() => onSelectEmployee(emp.id)}
      $isActive={emp.id === selectedEmployeeId}
    >
  {emp.profile_pic && emp.profile_pic.trim() !== "" ? (
      <img
        src={emp.profile_pic}
        alt={emp.name}
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          marginRight: 8,
          objectFit: "cover",
        }}
      />
    ) : (
      <PiUserCirclePlusThin
        size={26}
        color="#999"
        style={{ marginRight: 8, flexShrink: 0, }}
      />
    )}
    {emp.name}
  </EmployeeItem>
))}
  {employeesData.length === 0 && <p>No employees in this department.</p>}
</EmployeeContainer>

  );
};

const TaskPanel = ({ employeeId }) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);

  const tasks = useSelector((state) => state.dailyTask.tasks || []);
  const loading = useSelector((state) => state.dailyTask.loading);

  const employeeName = useSelector(
    (state) =>
      state.departments.departmentEmployeesMini?.find(
        (emp) => emp.id === employeeId
      )?.name
  );
  
  const formatYMDDisplay = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
  const formatDate = (d) => d?.toISOString().split("T")[0];
  useEffect(() => {
    if (employeeId) {
      dispatch(getTasks({ employeeId, date: null }));
    }
  }, [employeeId, dispatch]);
  useEffect(() => {
    if (employeeId && selectedDate) {
      dispatch(getTasks({ employeeId, date: formatDate(selectedDate) }));
    }
  }, [selectedDate, employeeId, dispatch]);

  return (
    <PanelContainer>
      <TaskHeader>
        <Heading>
          {employeeId ? `Tasks for ${employeeName}` : "Select Employee Tasks"}
        </Heading>

        <DatePickerWrapper>
          <label>Due Date:</label>
          <input
            type="date"
            value={selectedDate ? formatDate(selectedDate) : ""}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedDate(val ? new Date(val) : null);
            }}
          />
        </DatePickerWrapper>
      </TaskHeader>
      {!employeeId && (
        <StyledNoSelectionMessage $type="info">
          <p>Please select an employee.</p>
        </StyledNoSelectionMessage>
      )}

      {employeeId && loading && <p>Loading tasks...</p>}

      {employeeId && !loading && tasks.length === 0 && (
        <StyledNoSelectionMessage $type="warning">
          <p>No tasks found for this employee.</p>
        </StyledNoSelectionMessage>
      )}

      {employeeId && tasks.length > 0 && (
        <TaskList>
          {tasks.map((task) => (
            <li key={task.id}>
              

              <TaskContent>
                <TaskLeft>
                  <span className="task-title">
                    {task.task} <small>({task.project})</small>
                  </span>
                  <span className="task-desc">{task.description}</span>
                </TaskLeft>
              </TaskContent>
              <TaskBottom>
                <div className="right-block">
                  <strong>{task.time_taken} hrs</strong>
                <span>{formatYMDDisplay(task.updated_at)}</span>
                </div>
              </TaskBottom>
            </li>
          ))}
        </TaskList>
      )}
    </PanelContainer>
  );
};

export default function DailyTask() {
  const dispatch = useDispatch();

  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isDeptPanelOpen, setIsDeptPanelOpen] = useState(true);
  const [searchDept, setSearchDept] = useState("");

  const departments = useSelector((state) => state.departments.minList || []);
  useEffect(() => {
    dispatch(getDepartmentsMin()).then((res) => {
    });
  }, [dispatch]);
  useEffect(() => {
    if (selectedDeptId) {
      dispatch(getEmployeesByDepartmentMini(selectedDeptId));
      setSelectedEmployeeId(null);
    }
  }, [selectedDeptId, dispatch]);

  const handleDepartmentClick = (id) => {
    setSelectedDeptId(id === selectedDeptId ? null : id);
  };

  const handleToggle = () => setIsDeptPanelOpen(!isDeptPanelOpen);

  const isEmployeePanelVisible = selectedDeptId !== null;


  return (
    <ViewContainer>
      <DepartmentPanel $isOpen={isDeptPanelOpen}>
        <Title>
          <img src={TaskIcon} alt="Task Icon" width={28} height={28} />
          Daily Task
        </Title>
        <SearchInput
          type="text"
          placeholder="Search Department..."
          value={searchDept}
          onChange={(e) => setSearchDept(e.target.value)}
        />

        {departments
          .filter((d) => d.name.toLowerCase().includes(searchDept.toLowerCase()))
          .map((dept) => (
            <Card
              key={dept.id}
              dept={dept}
              onClick={() => handleDepartmentClick(dept.id)}
              isActive={dept.id === selectedDeptId}
            />
          ))}
      </DepartmentPanel>

      <ToggleArrow onClick={handleToggle} $isOpen={isDeptPanelOpen}>
        {isDeptPanelOpen ? '«' : '»'}
      </ToggleArrow>

      <MainContent>
        <EmployeePanelWrapper $visible={isEmployeePanelVisible}>
          <EmployeeList
            departmentId={selectedDeptId}
            onSelectEmployee={setSelectedEmployeeId}
            selectedEmployeeId={selectedEmployeeId}
          />
        </EmployeePanelWrapper>

        <TaskPanel employeeId={selectedEmployeeId} />
      </MainContent>
    </ViewContainer>
  );
}
