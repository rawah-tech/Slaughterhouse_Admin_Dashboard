import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../components/DataTable'

import Loader from '../components/layout/Loader'
import { Col, Row, Card } from '@themesberg/react-bootstrap';


import { useAlert } from '../components/alerts/AlertProvider'
import { useDispatch, useSelector } from 'react-redux'
import { allOrders, clearErrors } from '../actions/orderActions'
 
const OrdersList = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { orders,loading, error } = useSelector(state => state.allOrders);
    useEffect(() => {
        dispatch(allOrders());
    }, [dispatch])

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error])

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc'
                 },
                {
                    label: 'التاريخ',
                    field: 'numofItems',
                    sort: 'asc'
                },
                {
                    label: 'حالة الطلب',
                    field: 'status',
                    sort: 'asc'
                },
                {
                    label: 'ادارة',
                    field: 'actions',
                },
                {
                    label: 'اضافة سائق',
                    field: 'driver',
                },
            ],
            rows: []
        }

        (orders || []).forEach(order => {
            data.rows.push({
                 id: order.num,
                numofItems: order.createdAt,
                status: order.orderStatus && String(order.orderStatus).includes('Delivered')
                    ? <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    : <p style={{ color: 'red' }}>{order.orderStatus}</p>,
                actions: <div className="container">
                    <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2">
                       التفاصيل
                    </Link>
                </div>,
                  driver:
                   <div className="container">
                  <Link to={`/admin/delivery/${order._id}`} className="btn btn-primary py-1 px-2">
                     تعيين
                  </Link>
              </div>
            })
        })

        return data;
    }


    return (
        <>
        <Row>
            <Col xs={12} xl={12} className="mb-4">
        <Card border="light" className="shadow-sm">
        <Card.Body className="">
          <div className="d-block">
            <h6 className="fw-normal text-gray mb-2">الطلبات</h6>
            

                        {loading ? <Loader /> : (
                            <DataTable
                                data={setOrders()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}
            </div>
      </Card.Body>
    </Card>
    </Col>
              </Row>
              </>
    )
}

export default OrdersList
