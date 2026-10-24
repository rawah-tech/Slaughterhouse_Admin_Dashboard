import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "@themesberg/react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { clearErrors, newInfo } from "../actions/infoActions";
import { useAlert } from "../components/alerts/AlertProvider";
import { NEW_INFO_RESET } from "../constants/infoConstants";

const AddInfo = ({ history }) => {
  const [kssEmail, setKssEmail] = useState("");
  const [kssPhone, setKssPhone] = useState("");
  const [bokNumber, setBokNumber] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.newInfo);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("تمت إضافة معلومات التواصل بنجاح.");
      dispatch({ type: NEW_INFO_RESET });
      history.push("/infos");
    }
  }, [alert, dispatch, error, history, success]);

  const submitHandler = (event) => {
    event.preventDefault();
    if (loading) return;

    dispatch(
      newInfo({
        kssEmail: kssEmail.trim(),
        kssPhone: kssPhone.trim(),
        bokNumber: bokNumber.trim(),
      })
    );
  };

  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
      <Row className="w-100">
        <Col xs={12} xl={10}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <h1 className="h5 mb-4">إضافة معلومات التواصل</h1>
              <Form onSubmit={submitHandler}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="kssEmail_field">
                      <Form.Label>البريد الإلكتروني</Form.Label>
                      <Form.Control
                        required
                        type="email"
                        name="kssEmail"
                        autoComplete="email"
                        value={kssEmail}
                        placeholder="أدخل البريد الإلكتروني"
                        onChange={(event) => setKssEmail(event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="kssPhone_field">
                      <Form.Label>رقم الهاتف</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        inputMode="tel"
                        name="kssPhone"
                        autoComplete="tel"
                        value={kssPhone}
                        placeholder="أدخل رقم الهاتف"
                        onChange={(event) => setKssPhone(event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="bokNumber_field">
                      <Form.Label>الحساب البنكي</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        inputMode="numeric"
                        name="bokNumber"
                        value={bokNumber}
                        placeholder="أدخل رقم الحساب البنكي"
                        onChange={(event) => setBokNumber(event.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? "جارٍ الحفظ..." : "حفظ"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddInfo;
