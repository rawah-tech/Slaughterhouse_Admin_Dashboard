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
import { updateOffer, getOfferDetails, clearErrors } from '../actions/offerActions'
import { UPDATE_OFFER_RESET } from '../constants/offerConstants'

const UpdateOffer = ({ match, history }) => {

    const [off, setOff] = useState("");
    
   


    const alert = useAlert();
    const dispatch = useDispatch();

    const { error, offer, loading: detailsLoading } = useSelector(state => state.offerDetails)
    const { loading: updateLoading, error: updateError, isUpdated } = useSelector(state => state.offer);

    const offerId = match.params.id;

    useEffect(() => {
        dispatch(getOfferDetails(offerId));
    }, [dispatch, offerId])

    useEffect(() => {
        if (offer?._id === offerId) {
            setOff(offer.off ?? "");
        }
    }, [offer, offerId])

    useEffect(() => {
        const message = updateError || error;
        if (message) {
            alert.error(message);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error, updateError])

    useEffect(() => {
        if (isUpdated) {
            history.push('/admin/offers');
            alert.success('offer updated successfully');
            dispatch({ type: UPDATE_OFFER_RESET })
        }
    }, [dispatch, alert, history, isUpdated])


    const submitHandler = (e) => {
        e.preventDefault();

        if (updateLoading || detailsLoading || offer?._id !== offerId) {
            return;
        }

        dispatch(updateOffer(offerId, { off: off.trim() }))
    }




    return (
        <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <Row>
          <Col xs={12} xl={10}>
            <Card border="light" className="bg-white shadow-sm mb-4">
              <Card.Body>
                <h5 className="mb-4">تحديث العرض</h5>
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>اسم العرض</Form.Label>
                        <Form.Control
                          required
                          type="text"
                          onChange={(e) => setOff(e.target.value)}
                          id="off_field"
                          name="off"
                          value={off}
                          placeholder="أدخل اسم العرض"
                        />
                      </Form.Group>
                    </Col>
                  
                  </Row>

        

                  <div className="mt-3">
                    <Button
                      variant="primary"
                      id="login_button"
                      type="submit"
                      disabled={updateLoading || detailsLoading || offer?._id !== offerId}
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

export default UpdateOffer
