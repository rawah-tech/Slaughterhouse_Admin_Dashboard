const DEFAULT_ERROR_MESSAGE = "تعذر إكمال الطلب. يرجى المحاولة مرة أخرى.";
const NETWORK_ERROR_MESSAGE = "تعذر الاتصال بالخادم. تحقق من الاتصال وحاول مرة أخرى.";
const TIMEOUT_ERROR_MESSAGE = "استغرق الطلب وقتًا أطول من المتوقع. حاول مرة أخرى.";

const firstNonEmptyString = (...values) =>
  values.find((value) => typeof value === "string" && value.trim())?.trim();

export const getApiErrorMessage = (error) => {
  const responseData = error?.response?.data;
  const structuredMessage = firstNonEmptyString(
    responseData?.message,
    responseData?.error,
    Array.isArray(responseData?.errors)
      ? responseData.errors
          .map((entry) => firstNonEmptyString(entry?.message, entry))
          .filter(Boolean)
          .join("، ")
      : undefined
  );

  if (structuredMessage) {
    return structuredMessage;
  }

  if (error?.code === "ECONNABORTED" || error?.code === "ETIMEDOUT") {
    return TIMEOUT_ERROR_MESSAGE;
  }

  if (error?.request && !error?.response) {
    return NETWORK_ERROR_MESSAGE;
  }

  return firstNonEmptyString(error?.message, DEFAULT_ERROR_MESSAGE);
};

export {
  DEFAULT_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
};
