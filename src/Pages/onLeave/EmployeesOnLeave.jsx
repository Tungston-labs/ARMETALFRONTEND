import React, { useEffect, useState } from "react";
import {
  Container,
} from "../leaveDetails/EmployeeList.styles";
import {
  CardContainer,
  Card,
  Initial,
  DeptTitle,
  DeptSub,
  DeptHead,
  HeadImg,
  DeptInfo,
  CardGrid,
  CardRight,
} from './EmployeesOnLeave.Style';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PiUserCirclePlusThin } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { getDepartments } from "../../Redux/departmentSlice";
import { GoArrowUpRight } from "react-icons/go";
import { IoIosArrowDown } from "react-icons/io";
import EmployeeIcon from "../../assets/employeeicon.svg";
import Loader from "../../Components/Loader/Loader"
// import Navbar from "../../Components/Navbar";
import { FiSearch } from "react-icons/fi";
import EmployeeTitle from "../../Components/Employee/Headers/EmployeeTitle";
const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: departmentList, loading, error, pagination } = useSelector(
    (state) => state.departments
  );
  
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getDepartments({ page, search: searchText }));
    console.log('departments',getDepartments);
    
  }, [dispatch, page, searchText]);
  

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  return (
    <>
        {/* <Navbar/> */}
       
    <Container>
      {loading && ( <Loader /> )}

<EmployeeTitle
  iconSrc={EmployeeIcon}
  showAddButton={false}
  showDropdown={false} 
   showBackArrow={false}  
    onSearchChange={setSearchText}     
/>
     
      <CardContainer>
        <CardGrid>
          {departmentList?.map((dept) => (
            <Card
              key={dept.id}
              onClick={() => navigate(`/employee-leave?departmentId=${dept.id}`)}
              style={{ cursor: "pointer" }}
            >
              <Initial>{dept.name?.[0] || "D"}</Initial>
              <DeptInfo>
                <DeptTitle>{dept.name || "Department"}</DeptTitle>
                <DeptSub>Department head</DeptSub>
                <DeptHead>
                  {dept.head?.profile_pic ? (
                    <HeadImg src={dept.head.profile_pic} alt="head" />
                  ) : (
                    <PiUserCirclePlusThin size={24} />
                  )}
                  <span>{dept.head?.name || "N/A"}</span>
                </DeptHead>
              </DeptInfo>
              <CardRight>
                <div className="card-value">{dept.todays_leave_employee_count || 0}</div>
                <div className="arrow-icon">
                  <GoArrowUpRight size={15} style={{ strokeWidth: 2 }} />
                </div>
              </CardRight>
            </Card>
          ))}
        </CardGrid>
      </CardContainer> 
    </Container>
     </>
  );
};

export default EmployeeList;
