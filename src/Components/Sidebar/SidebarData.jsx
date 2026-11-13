import getFinanceSidebarData from "./financeSidebarData";
import getHrSidebarData from "./hrSidebarData";
import getSuperAdminSidebarData from "./superAdminSidebarData";

export const isFinanceRoute = (pathname = "", user = null) => {
  if (user?.is_superadmin) return false;
  if (!pathname) return false;
  const normalized = pathname.toLowerCase();

  const financePrefixes = [
    "/sales",
    "/purchases",
    "/purchase",
    "/product",
    "/warehouse",
    "/delivery",
    "/credit-notes",
    "/sales-return",
    "/accounts",
    "/reports",
    "/finance",
    "/quotation-list",
  ];

  return financePrefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
};

const getSidebarData = (user, pathname = "") => {
  if (!user) return [];

  // Superadmin gets its own fixed menu
  if (user?.is_superadmin) {
    return getSuperAdminSidebarData();
  }

  // If navigating any Finance route, render Finance sidebar
  if (isFinanceRoute(pathname, user)) {
    return getFinanceSidebarData();
  }

  // HR admin / HR menu, gated by company_modules
  if (user?.is_hr_admin || user?.is_hr || user?.is_employee) {
    return getHrSidebarData(user);
  }

  // Default fallback to finance or hr if user has access
  const modules = user?.company_modules || {};
  if (modules.finance) {
    return getFinanceSidebarData();
  }

  return getHrSidebarData(user);
};

export default getSidebarData;
