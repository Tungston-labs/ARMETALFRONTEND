import countries from "world-countries";

// Build one clean, linked dataset instead of 2 hardcoded lists
export const COUNTRY_OPTIONS = countries
  .map((c) => {
    const currencyCode = Object.keys(c.currencies || {})[0] || "";
    const currencyInfo = c.currencies?.[currencyCode];
    const dialCode = c.idd?.root
      ? `${c.idd.root}${c.idd.suffixes?.[0] || ""}`
      : "";

    return {
      code: c.cca2,                     // "IN", "AE", "US"
      name: c.name.common,              // "India"
      dialCode,                         // "+91"
      currencyCode,                     // "INR"
      currencySymbol: currencyInfo?.symbol || currencyCode,
    };
  })
  .filter((c) => c.currencyCode)
  .sort((a, b) => a.name.localeCompare(b.name));

export const getCountryByCode = (code) =>
  COUNTRY_OPTIONS.find((c) => c.code === code);