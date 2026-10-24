import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Loader from "../components/layout/Loader";
import AccessDenied from "./AccessDenied";
import { Routes } from "../routes";

const ProtectedRoute = ({ isAdmin = false, component: Component, ...rest }) => {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.auth
  );

  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return (
            <div
              className="d-flex min-vh-100 align-items-center justify-content-center"
              role="status"
              aria-label="جارٍ التحقق من جلسة المستخدم"
            >
              <Loader />
            </div>
          );
        }

        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: Routes.Signin.path,
                state: { from: props.location },
              }}
            />
          );
        }

        if (isAdmin && user?.role !== "admin") {
          return (
            <main className="content w-100">
              <Navbar />
              <AccessDenied />
            </main>
          );
        }

        return (
          <>
            <Sidebar />
            <main className="content">
              <Navbar />
              <Component {...props} />
            </main>
          </>
        );
      }}
    />
  );
};

export default ProtectedRoute;
