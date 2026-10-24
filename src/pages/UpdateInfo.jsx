import React, { useState, useEffect } from 'react'

import {
    Col,
    Row,
    Card,
    Form,
    Button,
  } from "@themesberg/react-bootstrap";

import { useAlert } from '../components/alerts/AlertProvider'
import { useDispatch, useSelector } from 'react-redux'
import { updateInfo, getInfoDetails, clearErrors } from '../actions/infoActions'
import { UPDATE_INFO_RESET } from '../constants/infoConstants'

const UpdateInfo = ({ match, history }) => {

    const [kssEmail, setKssEmail] = useState("");
  const [kssPhone, setKssPhone] = useState("");
  const [bokNumber, setBokNumber] = useState("");
    
   


    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, info, loading: detailsLoading } = useSelector(state => state.infoDetails)
    const { loading: updateLoading, error: updateError, isUpdated } = useSelector(state => state.info);

    const infoId = match.params.id;

    useEffect(() => {
        dispatch(getInfoDetails(infoId));
    }, [dispatch, infoId])

    useEffect(() => {
        if (info?._id !== infoId) {
            return;
        }

        setKssEmail(info.kssEmail ?? "");
        setKssPhone(info.kssPhone ?? "");
        setBokNumber(info.bokNumber ?? "");
    }, [info, infoId])

    useEffect(() => {
        const message = updateError || error;
        if (message) {
            alert.error(message);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error, updateError])

    useEffect(() => {
        if (isUpdated) {
            history.push('/infos');
            alert.success('info updated successfully');
            dispatch({ type: UPDATE_INFO_RESET })
        }
    }, [dispatch, alert, history, isUpdated])


    const submitHandler = (e) => {
        e.preventDefault();

        if (updateLoading || detailsLoading || info?._id !== infoId) {
            return;
        }

        dispatch(updateInfo(infoId, {
            kssEmail: kssEmail.trim(),
            kssPhone: kssPhone.trim(),
            bokNumber: bokNumber.trim()
        }))
    }




    return (
        <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Row>
          <Col xs={12} xl={10}>
            <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
                <h5 className="mb-4">تحديث معلومات التواصل</h5>
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>الايميل</Form.Label>
                        <Form.Control
                          required
                          type="email"
                          onChange={(e) => setKssEmail(e.target.value)}
                          id="kssEmail_field"
                          name="kssEmail"
                          value={kssEmail}
                          placeholder="ادخل البريد الالكتروني"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} className="mb-3">
                    <Form.Group>
                        <Form.Label>رقم الهاتف</Form.Label>
                        <Form.Control
                          required
                          type="tel"
                          inputMode="tel"
                          id="kssPhone_field"
                          name="kssPhone"
                          onChange={(e) => setKssPhone(e.target.value)}
                          value={kssPhone}
                          placeholder="ادخل رقم الهاتف"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4} className="mb-3">
                      <Form.Group>
                        <Form.Label>حساب البنك</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          inputMode="numeric"
                          id="bokNumber_field"
                          name="bokNumber"
                          onChange={(e) => setBokNumber(e.target.value)}
                          value={bokNumber}
                          placeholder="ادخل حساب البنك"
                        />
                      </Form.Group>
                    </Col>
                 
                  </Row>


        

                  <div className="mt-3">
                    <Button
                      variant="primary"
                      id="login_button"
                      type="submit"
                      disabled={updateLoading || detailsLoading || info?._id !== infoId}
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
    )
}

export default UpdateInfo
