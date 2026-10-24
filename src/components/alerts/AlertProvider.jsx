import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const AlertContext = createContext(null);

const ALERT_TIMEOUT_MS = 5_000;

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const show = useCallback((type, message) => {
    if (!message) return;

    window.clearTimeout(timeoutRef.current);
    setAlert({ type, message: String(message) });
    timeoutRef.current = window.setTimeout(() => setAlert(null), ALERT_TIMEOUT_MS);
  }, []);

  const value = useMemo(
    () => ({
      error: (message) => show("danger", message),
      success: (message) => show("success", message),
      info: (message) => show("info", message),
      dismiss: () => setAlert(null),
    }),
    [show]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alert && (
        <div
          className={`alert alert-${alert.type} app-alert`}
          role="alert"
          aria-live="assertive"
        >
          <span>{alert.message}</span>
          <button
            type="button"
            className="btn-close ms-3"
            aria-label="إغلاق التنبيه"
            onClick={() => setAlert(null)}
          />
        </div>
      )}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used within AlertProvider.");
  }

  return context;
};
