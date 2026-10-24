const DEFAULT_API_BASE_URL = "http://localhost:4000";
const MAPS_KEY_PLACEHOLDER = "replace_with_a_restricted_browser_key";

const normalizeEnvironmentValue = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const normalizeBaseUrl = (value) => {
  const candidate = value || DEFAULT_API_BASE_URL;

  try {
    const url = new URL(candidate);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Unsupported protocol");
    }

    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error(
      "VITE_API_BASE_URL must be an absolute HTTP or HTTPS URL, for example http://localhost:4000."
    );
  }
};

const mapsApiKey = normalizeEnvironmentValue(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

export const environment = Object.freeze({
  apiBaseUrl: normalizeBaseUrl(normalizeEnvironmentValue(import.meta.env.VITE_API_BASE_URL)),
  googleMapsApiKey: mapsApiKey === MAPS_KEY_PLACEHOLDER ? "" : mapsApiKey,
});

export const hasGoogleMapsApiKey = Boolean(environment.googleMapsApiKey);
