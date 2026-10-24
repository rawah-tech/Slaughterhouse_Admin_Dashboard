import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Button,
} from "@themesberg/react-bootstrap";

import { useAlert } from "../components/alerts/AlertProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUser,
  getUserDetails,
  clearErrors,
} from "../actions/userActions";
import { UPDATE_USER_RESET } from "../constants/userConstants";

const UpdateUser = ({ history, match }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [role, setRole] = useState("user");

  const alert = useAlert();
  const dispatch = useDispatch();

  const { error, isUpdated, loading: updateLoading } = useSelector((state) => state.user);
  const { user, error: detailsError, loading: detailsLoading } = useSelector((state) => state.userDetails);

  const userId = match.params.id;

  useEffect(() => {
    dispatch(getUserDetails(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (user?._id !== userId) {
      return;
    }

    setName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setPhone2(user.phone2 || "");
    setRole(user.role || "user");
  }, [user, userId]);

  useEffect(() => {
    const message = error || detailsError;
    if (message) {
      alert.error(message);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, detailsError, error]);

  useEffect(() => {
    if (isUpdated) {
      alert.success("User updated successfully");
      history.push("/upgrade");
      dispatch({
        type: UPDATE_USER_RESET,
      });
    }
  }, [dispatch, alert, history, isUpdated]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (updateLoading || detailsLoading || user?._id !== userId) return;

    dispatch(updateUser(userId, {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      phone2: phone2.trim(),
      role,
    }));
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Row>
          <Col xs={12} xl={10}>
            <Card border="light" className="bg-white shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-4">تحديث المستخدم</h5>
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>الاسم</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          id="name_field"
                          name="name"
                          onChange={(e) => setName(e.target.value)}
                          value={name}
                          placeholder="ادخل اسم المستخدم"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>الايميل</Form.Label>
                        <Form.Control
                          required
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                          id="email_field"
                          name="email"
                          value={email}
                          placeholder="ادخل البريد الالكتروني"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>رقم الهاتف</Form.Label>
                        <Form.Control
                          
                          required
                          type="tel"
                          inputMode="tel"
                          id="phone_field"
                          name="phone"
                          onChange={(e) => setPhone(e.target.value)}
                          value={phone}
                          placeholder="ادخل رقم الهاتف"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>رقم هاتف اضافي</Form.Label>
                        <Form.Control
                          
                          type="tel"
                          inputMode="tel"
                          id="phone2_field"
                          name="phone2"
                          onChange={(e) => setPhone2(e.target.value)}
                          value={phone2}
                          placeholder="ادخل رقم الهاتف"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>نوع المستخدم</Form.Label>
                        <Form.Select
                          required
                          id="role_field"
                          className="form-control"
                          name="role"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="user">مستخدم</option>
                          <option value="admin">أدمن</option>
                          <option value="driver">سائق</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3"></Col>
                  </Row>

                  <div className="mt-3">
                    <Button
                      variant="primary"
                      id="login_button"
                      type="submit"
                      disabled={updateLoading || detailsLoading || user?._id !== userId}
                      aria-busy={updateLoading || detailsLoading}
                    >
                      حفظ
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default UpdateUser;
