import React, { useEffect } from "react";
import {
  DashboardWrapper,
  Header,
  Title,
  Subtitle,
  BlueBanner,
  BannerHeader,
  CardContainer,
  CompanyCard,
  CardTitle,
  CardSubtitle,
  TableSection,
  TableHeader,
  TableWrapper,
  StyledTable,
  CardContent,
  CompanyLogo,
  CardSlider,TopBar
} from "./Superadmin_Dashboard.Styles";
import Navbar from "../../Components/Navbar/SuperAdmin/Navbar"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyOverview } from "../../Redux/superAdminSlice";
import Loader from "../../Components/Loader/Loader"
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { overview, loading } = useSelector((state) => state.superAdmin);

  useEffect(() => {
    dispatch(getCompanyOverview());
  }, [dispatch]);

  if (loading) {
    return <Loader/>;
  }
console.log({overview});

  const companies = overview?.companies || [];
  const payments = overview?.unpaid_companies || [];
  console.log({companies});
  

  return (
    <DashboardWrapper>
        <TopBar>
        <div />
        <Navbar bgColor="#f3f3f3" />
                </TopBar>
      <Header>
        <Title>Dashboard</Title>
        <Subtitle>Unifying Teams. Simplifying Operations</Subtitle>
      </Header>

      <BlueBanner>
        <BannerHeader>
          <div>
            <h2>No of Companies</h2>
            <p>Recently added Company Details</p>
          </div>
          <span>{overview?.total_companies || 0}</span>
        </BannerHeader>

        <CardContainer>
          <CardSlider>
            {companies.map((c, i) => (
              <Link
                key={i}
                to={`/superadmin/view/${c.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <CompanyCard>
                  <CardContent>
                    <CompanyLogo src={c.logo_url || "/default-logo.png"} alt={c.name} />
                    <div>
                      <CardTitle>Company Name</CardTitle>
                      <CardSubtitle>{c.name}</CardSubtitle>
                      <CardTitle>Company ID</CardTitle>
                      <CardSubtitle>{c.company_id}</CardSubtitle>
                    </div>
                  </CardContent>
                </CompanyCard>
              </Link>
            ))}
          </CardSlider>
        </CardContainer>
      </BlueBanner>

      <TableSection>
        <TableHeader>
          <div>
            <h2>Pending payment details</h2>
          </div>
          <span>{payments.length}</span>
        </TableHeader>

        <TableWrapper>
          <StyledTable>
            <thead>
              <tr>
                <th>Company name</th>
                <th>Address</th>
                <th>Company ID</th>
                <th>Contact details</th>
                <th>No of Employees</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => navigate(`/superadmin/view/${row.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{row.name}</td>
                  <td>{row.address}</td>
                  <td>{row.company_id}</td>
                  <td>{row.contact_number}</td>
                  <td>{row.number_of_employees}</td>
                  <td>{row.next_due_date || "-----"}</td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        </TableWrapper>
      </TableSection>
    </DashboardWrapper>
  );
};

export default Dashboard;
