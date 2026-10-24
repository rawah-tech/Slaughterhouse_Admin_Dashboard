import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Button,
  Form,
} from "@themesberg/react-bootstrap";

import { useAlert } from "../components/alerts/AlertProvider";

import { getOrderDetails } from "../actions/orderActions";

import { useDispatch, useSelector } from "react-redux";
import { newDelivery, clearErrors } from "../actions/deliveryActions";
import { NEW_DELIVERY_RESET } from "../constants/deliveryConstants";
import SelectDriver from "./selectDeriver";

const NewDelivery = ({ match }) => {
  const [user, setUser] = useState("");

  const alert = useAlert();
  const dispatch = useDispatch();

  const {
    order = {},
    error: orderError,
    loading: orderLoading,
  } = useSelector((state) => state.orderDetails);

  useEffect(() => {
    dispatch(getOrderDetails(match.params.id));
  }, [dispatch, match.params.id]);

  const { loading, error, success } = useSelector((state) => state.newDelivery);

  useEffect(() => {
    const message = error || orderError;
    if (message) {
      alert.error(message);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Delivery created successfully");
      setUser("");
      dispatch({ type: NEW_DELIVERY_RESET });
    }
  }, [dispatch, alert, error, orderError, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (loading || orderLoading) {
      return;
    }

    if (!order._id || !user) {
      alert.error("يرجى اختيار السائق بعد تحميل بيانات الطلب.");
      return;
    }

    dispatch(newDelivery({ orderid: order._id, user }));
  };

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Row>
          <Col xs={12} xl={10}>
            <Card border="light" className="bg-white shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-4">تحديد السائق</h5>
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>رقم الطلب</Form.Label>
                        <Form.Control
                          required
                          readOnly
                          type="text"
                          id="orderid_field"
                          name="orderid"
                          value={order._id || ""}
                          placeholder="أدخل رقم الطلب"
                          
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>اسم السائق</Form.Label>
                        <Form.Select
                          required
                          onChange={(e) => setUser(e.target.value)}
                          id="user_field"
                          name="user"
                          value={user}
                          placeholder="أدخل اسم المنتج"
                        >
                          <option value="" disabled>اختر السائق</option>
                          <SelectDriver />
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="mt-3">
                    <Button
                      variant="primary"
                      id="login_button"
                      type="submit"
                      disabled={loading || orderLoading || !order._id || !user}
                      aria-busy={loading || orderLoading}
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

export default NewDelivery;
