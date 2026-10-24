
import React, { useEffect } from "react";

import { faCashRegister, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Col, Row} from '@themesberg/react-bootstrap';

import { CounterWidget, CircleChartWidget, SalesValueWidgetPhone } from "../../components/Widgets";

import { trafficShares } from "../../data/charts";


import { useDispatch, useSelector } from 'react-redux'

import { getAdminProducts } from '../../actions/productActions'
import { allOrders } from '../../actions/orderActions'
import { allUsers } from '../../actions/userActions'
import OrdersList from "../ListOrders";





export default () => {

  const dispatch = useDispatch();

  const { products } = useSelector(state => state.products)
  const { users } = useSelector(state => state.allUsers)
  const { orders, totalAmount } = useSelector(state => state.allOrders)



  useEffect(() => {
      dispatch(getAdminProducts())
      dispatch(allOrders())
      dispatch(allUsers())
  }, [dispatch])

  return (
    <>
      <Row className="justify-content-md-center bg-white mb-5">

        </Row>
        <Row className="justify-content-md-center">
        <Col xs={12} className="mb-4 d-sm-none">
          <SalesValueWidgetPhone
            title="Sales Value"
            value="10,567"
            percentage={10.57}
          />
        </Col>
        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="عدد العملاء"
            title={users && users.length}
            icon={faChartLine}
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          <CounterWidget
            category="عدد المنتجات"
            title={products && products.length}
            icon={faChartLine}
          />
        </Col>
        
        <Col xs={12} sm={6} xl={4} className="mb-4">
        <CounterWidget
            category="عدد الطلبات الكلي"
            title={orders && orders.length}
            icon={faChartLine}
          />
        </Col>

        <Col xs={12} sm={6} xl={4} className="mb-4">
          
        </Col>
      </Row>

      <Row>
        <Col xs={12} xl={12} className="mb-4">
          <Row>
            <Col xs={12} xl={8} className="mb-4">
              <Row>
                <Col xs={12} className="mb-4">
                  <OrdersList />
                </Col>
              </Row>
            </Col>

            <Col xs={12} xl={4}>
              <Row>
              <Col xs={12} className="px-0 mb-4">
              <CounterWidget
            category="الايرادات"
            title={Number.isFinite(totalAmount) ? totalAmount.toFixed(2) : "0.00"}
         
            icon={faCashRegister}
            
          />
                </Col>
                <Col xs={12} className="mb-4">
                <CircleChartWidget
            title="الطلبات"
            data={trafficShares} />
                </Col>

                 <Col xs={12} className="px-0 mb-4">
                </Col>

              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
