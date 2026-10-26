import API from "../../api";

const PAYMENT_REPORT_ENDPOINT = "/finance/reports/payment/";

export const getPaymentReport = async (params = {}) => {
  const response = await API.get(PAYMENT_REPORT_ENDPOINT, {
    params,
  });

  return response.data;
};

const paymentReportService = {
  getPaymentReport,
};

export default paymentReportService;
