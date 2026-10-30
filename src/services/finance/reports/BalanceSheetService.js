import API from "../../api";

const BALANCE_SHEET_URL = "/finance/reports/balance-sheet/";

const balanceSheetService = {
  getBalanceSheet: async ({ as_of_date, company_pk } = {}) => {
    const params = {};

    if (as_of_date) {
      params.as_of_date = as_of_date;
    }

    if (company_pk !== undefined && company_pk !== null && company_pk !== "") {
      params.company_pk = company_pk;
    }

    const response = await API.get(BALANCE_SHEET_URL, { params });
    return response.data;
  },
};

export default balanceSheetService;
