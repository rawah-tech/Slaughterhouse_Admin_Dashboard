import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
} from "@themesberg/react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { newUser } from "../actions/userActions";
import { useAlert } from "../components/alerts/AlertProvider";
import { ADMIN_CREATE_USER_RESET } from "../constants/userConstants";

const INITIAL_ROLE = "user";

const NewUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [role, setRole] = useState(INITIAL_ROLE);
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();
  const { error, loading, success } = useSelector((state) => state.newUser);

  useEffect(() => {
    if (!success) {
      return;
    }

    alert.success("تم إنشاء المستخدم بنجاح.");
    setName("");
    setEmail("");
    setPhone("");
    setPhone2("");
    setRole(INITIAL_ROLE);
    setPassword("");
    setConfPassword("");
    setValidationError("");
    dispatch({ type: ADMIN_CREATE_USER_RESET });
  }, [alert, dispatch, success]);

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

    if (password !== confPassword) {
      setValidationError("كلمتا السر غير متطابقتين.");
      return;
    }

    setValidationError("");
    dispatch(
      newUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        phone2: phone2.trim(),
        role,
        password,
        confPassword,
      })
    );
  };

  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
      <Row className="w-100">
        <Col xs={12} xl={10}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h1 className="h5 mb-4">إضافة مستخدم</h1>
              <Form onSubmit={submitHandler}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="name_field">
                      <Form.Label>الاسم</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        name="name"
                        autoComplete="name"
                        onChange={(event) => setName(event.target.value)}
                        value={name}
                        placeholder="أدخل اسم المستخدم"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group controlId="email_field">
                      <Form.Label>البريد الإلكتروني</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}
                        placeholder="أدخل البريد الإلكتروني"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="phone_field">
                      <Form.Label>رقم الهاتف</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        inputMode="tel"
                        name="phone"
                        autoComplete="tel"
                        onChange={(event) => setPhone(event.target.value)}
                        value={phone}
                        placeholder="أدخل رقم الهاتف"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group controlId="phone2_field">
                      <Form.Label>رقم هاتف إضافي</Form.Label>
                      <Form.Control
                        type="tel"
                        inputMode="tel"
                        name="phone2"
                        onChange={(event) => setPhone2(event.target.value)}
                        value={phone2}
                        placeholder="أدخل رقم الهاتف الإضافي"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="role_field">
                      <Form.Label>نوع المستخدم</Form.Label>
                      <Form.Select
                        required
                        id="role_field"
                        className="form-control"
                        name="role"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                      >
                        <option value="user">مستخدم</option>
                        <option value="admin">مسؤول</option>
                        <option value="driver">سائق</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="password_field">
                      <Form.Label>كلمة السر</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        placeholder="أدخل كلمة السر"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group controlId="confPassword_field">
                      <Form.Label>تأكيد كلمة السر</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        name="confPassword"
                        autoComplete="new-password"
                        onChange={(event) =>
                          setConfPassword(event.target.value)
                        }
                        value={confPassword}
                        placeholder="أعد إدخال كلمة السر"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {(validationError || error) && (
                  <div className="alert alert-danger" role="alert">
                    {validationError || error}
                  </div>
                )}

                <div className="mt-3">
                  <Button
                    variant="primary"
                    id="create_user_button"
                    type="submit"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? "جارٍ الحفظ..." : "حفظ"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default NewUser;
