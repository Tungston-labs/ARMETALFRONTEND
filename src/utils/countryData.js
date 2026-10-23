import countries from "world-countries";
import { State, City } from "country-state-city";

// Build one clean, linked dataset instead of hardcoded lists
export const COUNTRY_OPTIONS = countries
  .map((c) => {
    const currencyCode = Object.keys(c.currencies || {})[0] || "";
    const currencyInfo = c.currencies?.[currencyCode];
    const dialCode = c.idd?.root
      ? `${c.idd.root}${c.idd.suffixes?.[0] || ""}`
      : "";

    return {
      code: c.cca2, // "IN", "AE", "US"
      name: c.name.common, // "India"
      dialCode, // "+91"
      currencyCode, // "INR"
      currencySymbol: currencyInfo?.symbol || currencyCode,
    };
  })
  .filter((c) => c.currencyCode)
  .sort((a, b) => a.name.localeCompare(b.name));

export const getCountryByCode = (code) =>
  COUNTRY_OPTIONS.find((c) => c.code === code);

/**
 * States for a given country (cca2 code, e.g. "IN").
 * Returns [] for countries with no state-level subdivisions in the
 * underlying dataset — callers should fall back to a free-text input
 * in that case rather than showing an empty dropdown.
 */
export const getStatesByCountry = (countryCode) => {
  if (!countryCode) return [];
  return State.getStatesOfCountry(countryCode).map((s) => ({
    code: s.isoCode,
    name: s.name,
  }));
};

/**
 * Cities for a given state within a country.
 * Returns [] if the state has no city-level data — callers should fall
 * back to a free-text input in that case.
 */
export const getCitiesByState = (countryCode, stateCode) => {
  if (!countryCode || !stateCode) return [];
  return City.getCitiesOfState(countryCode, stateCode).map((c) => ({
    name: c.name,
  }));
};

/**
 * Looks up a state's ISO code from its display name within a country.
 * Used when hydrating edit/view forms where the backend stored a
 * free-text state name instead of a code (legacy data).
 */
export const getStateByName = (countryCode, stateName) => {
  if (!countryCode || !stateName) return null;
  const states = State.getStatesOfCountry(countryCode);
  return (
    states.find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase()
    ) || null
  );
};