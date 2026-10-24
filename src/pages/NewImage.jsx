import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "@themesberg/react-bootstrap";

import apiClient from "../api/client";
import { getApiErrorMessage } from "../api/errors";
import { useAlert } from "../components/alerts/AlertProvider";

const NewImage = () => {
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const alert = useAlert();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || !image) return;

    const form = event.currentTarget;
    const formData = new FormData();
    formData.append("testImage", image);
    setSubmitting(true);
    setError("");

    try {
      await apiClient.post("/api/v1/admin/product/new", formData);
      alert.success("تم رفع الصورة بنجاح.");
      setImage(null);
      form.reset();
    } catch (requestError) {
      const message = getApiErrorMessage(requestError);
      setError(message);
      alert.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Row className="py-4">
      <Col xs={12} xl={10}>
        <Card border="light" className="bg-white shadow-sm mb-4">
          <Card.Body>
            <h1 className="h5 mb-4">رفع صورة منتج</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="product_image" className="mb-3">
                <Form.Label>الصورة</Form.Label>
                <Form.Control
                  required
                  type="file"
                  name="testImage"
                  accept="image/*"
                  onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                />
              </Form.Group>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Button type="submit" variant="primary" disabled={submitting || !image}>
                {submitting ? "جارٍ الرفع..." : "رفع الصورة"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default NewImage;
