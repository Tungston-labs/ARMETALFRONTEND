import React, { useEffect, useState, Suspense } from "react";
import { Container } from "./DashboardNew.Styles";
import { Badge } from "antd";
import { useNavigate } from "react-router-dom";
import "antd/dist/reset.css";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardSummary } from "../../Redux/dashboardSlice";
import Navbar from "../../Components/Navbar/SuperAdmin/Navbar";
import Loader from "../../Components/Loader/Loader";


const CardsOnly = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);
  const [holidays, setHolidays] = useState([]);

  // Fetch dashboard summary (async)
  useEffect(() => {
    dispatch(getDashboardSummary());
  }, [dispatch]);

  // Fetch & cache holidays
  useEffect(() => {
    const cached = localStorage.getItem("publicHolidays2025");
    if (cached) {
      setHolidays(JSON.parse(cached));
      return;
    }

    (async () => {
      try {
        const res = await fetch("https://date.nager.at/api/v3/PublicHolidays/2025/IN");
        const data = await res.json();
        const formatted = data.map((holiday) => ({
          date: holiday.date,
          name: holiday.localName,
          type: "Public Holiday",
        }));
        setHolidays(formatted);
        localStorage.setItem("publicHolidays2025", JSON.stringify(formatted));
      } catch (error) {
      }
    })();
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <Navbar />
      <Container>
        <Suspense
          fallback={
            <div style={{ padding: "2rem", textAlign: "center" }}>
              <Loader size="small" />
              <p style={{ color: "#888" }}>Loading dashboard cards...</p>
            </div>
          }
        >
          {/* <Cards summary={summary} loading={loading} /> */}
        </Suspense>

        <Suspense
          fallback={
            <div style={{ padding: "1rem", textAlign: "center" }}>
              <Loader size="small" />
              <p style={{ color: "#888" }}>Loading calendar...</p>
            </div>
          }
        >
          {/* <DepartmentCalendar holidays={holidays} /> */}
        </Suspense>
      </Container>
    </>
  );
};

export default CardsOnly;
