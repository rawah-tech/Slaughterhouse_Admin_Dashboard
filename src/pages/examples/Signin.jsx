import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "@themesberg/react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../actions/userActions";
import { useAlert } from "../../components/alerts/AlertProvider";
import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";

const Signin = ({ history, location }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();
  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      const destination =
        location.state?.from || Routes.DashboardOverview.path;
      history.replace(destination);
    }
  }, [history, isAuthenticated, location.state]);

  useEffect(() => {
    if (error) {
      alert.error(error);
    }
  }, [alert, error]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    dispatch(login(phone.trim(), password));
  };

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row
            className="justify-content-center form-bg-image"
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            <Col
              xs={12}
              className="d-flex align-items-center justify-content-center"
            >
              <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                <div className="text-center text-md-center mb-4 mt-md-0">
                  <h1 className="h3 mb-0">تسجيل الدخول لنظام المسلخ</h1>
                </div>

                <Form className="mt-4" onSubmit={submitHandler}>
                  <Form.Group controlId="phone_field" className="mb-4">
                    <Form.Label>رقم الهاتف</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faPhone} />
                      </InputGroup.Text>
                      <Form.Control
                        autoFocus
                        required
                        type="tel"
                        inputMode="tel"
                        autoComplete="username"
                        name="phone"
                        className="form-control"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="أدخل رقم الهاتف"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="password_field" className="mb-4">
                    <Form.Label>كلمة السر</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faUnlockAlt} />
                      </InputGroup.Text>
                      <Form.Control
                        required
                        type="password"
                        autoComplete="current-password"
                        name="password"
                        className="form-control"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="أدخل كلمة السر"
                      />
                    </InputGroup>
                  </Form.Group>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <Button
                    variant="primary"
                    id="login_button"
                    type="submit"
                    className="w-100"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? "جارٍ تسجيل الدخول..." : "تسجيل الدخول"}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};

export default Signin;
