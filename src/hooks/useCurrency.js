import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanySelf } from "../Redux/companySlice"; // adjust path to match your actual slice location
import { getCountryByCode } from "../utils/countryData";

/**
 * Reads the logged-in company's active currency from Redux.
 * Triggers the fetch once if company data hasn't been loaded yet
 * (e.g. on a hard refresh where the slice is empty).
 *
 * Usage:
 *   const { currencyCode } = useCurrency();
 *   formatCurrency(amount, currencyCode)
 */
export const useCurrency = () => {
  const dispatch = useDispatch();

  const company = useSelector((state) => state.company?.company);
  const loading = useSelector((state) => state.company?.loading);
  const countryCurrency = company?.country
    ? getCountryByCode(company.country)?.currencyCode
    : null;

  useEffect(() => {
    // Only fetch if we don't already have company data in the store -
    // avoids re-fetching on every component that calls this hook.
    if (!company && !loading) {
      dispatch(getCompanySelf());
    }
  }, [company, loading, dispatch]);

  return {
    currencyCode: company?.currency || countryCurrency || "INR",
    loading,
  };
};
