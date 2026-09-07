import { Route } from "react-router-dom";

import SuperAdmin_Dashboard from "../Pages/superAdmin/Dashboard/SuperAdmin_Dashboard.jsx";
import Company from "../Pages/superAdmin/Company/Company.jsx";
import AddCompany from "../Pages/superAdmin/AddCompany/AddCompany.jsx";
import Viewpage from "../Pages/superAdmin/Infopage/Viewpage.jsx";
import PlanAndPricing from "../Pages/superAdmin/PlanAndPricing/PlanAndPricing.jsx";

const SuperAdminRoutes = () => {
  return (
    <>
      {/* ================= SUPER ADMIN DASHBOARD ================= */}

      <Route  path="dashboard"element={<SuperAdmin_Dashboard />} />

      {/* ================= COMPANY ================= */}

      <Route path="company" element={<Company />} />

      <Route path="add-company" element={<AddCompany />}/>

      <Route path="add-company/:id" element={<AddCompany />}/>

      {/* ================= COMPANY INFO ================= */}

      <Route path="superadmin/view/:id"element={<Viewpage />}/>

      {/* ================= PLAN & PRICING ================= */}

      <Route path="PlanAndPricing"element={<PlanAndPricing />} />
      
    </>
  );
};

export default SuperAdminRoutes;