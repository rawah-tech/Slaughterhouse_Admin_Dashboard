import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Container,
  Nav,
  Navbar as BootstrapNavbar,
} from "@themesberg/react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../actions/userActions";
import { useAlert } from "./alerts/AlertProvider";
import { Routes } from "../routes";

const Navbar = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { loading } = useSelector((state) => state.auth);

  const logoutHandler = async () => {
    if (loading) {
      return;
    }

    const result = await dispatch(logout());
    history.replace(Routes.Signin.path);

    if (result.success) {
      alert.success("تم تسجيل الخروج بنجاح.");
    } else {
      alert.error(result.error);
    }
  };

  return (
    <BootstrapNavbar variant="dark" expanded className="ps-0 pe-2 pb-0 bg-">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center">
            <Button
              type="button"
              variant="link"
              className="text-gray-700 p-0 text-decoration-none"
              onClick={logoutHandler}
              disabled={loading}
              aria-busy={loading}
            >
              <FontAwesomeIcon
                icon={faSignOutAlt}
                className="text-danger me-2"
              />
              تسجيل الخروج
            </Button>
          </div>
          <Nav className="align-items-center" />
        </div>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
