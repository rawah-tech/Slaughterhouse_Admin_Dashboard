import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearErrors,
  deleteDelivery,
  getAdminDeliverys,
} from "../actions/deliveryActions";
import { useAlert } from "../components/alerts/AlertProvider";
import DataTable from "../components/DataTable";
import Loader from "../components/layout/Loader";
import { DELETE_DELIVERY_RESET } from "../constants/deliveryConstants";

const displayReference = (value) => {
  if (!value) return "—";
  if (typeof value !== "object") return String(value);
  return value.name || value.num || value._id || "—";
};

const DeliveryList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { deliverys = [], loading, error } = useSelector(
    (state) => state.deliverys
  );
  const {
    error: deleteError,
    isDeleted,
    loading: deleteLoading,
  } = useSelector((state) => state.delivery);

  useEffect(() => {
    dispatch(getAdminDeliverys());
  }, [dispatch]);

  useEffect(() => {
    const message = deleteError || error;
    if (message) {
      alert.error(message);
      dispatch(clearErrors());
    }
  }, [alert, deleteError, dispatch, error]);

  useEffect(() => {
    if (isDeleted) {
      alert.success("تم حذف مهمة التوصيل بنجاح.");
      dispatch({ type: DELETE_DELIVERY_RESET });
      dispatch(getAdminDeliverys());
    }
  }, [alert, dispatch, isDeleted]);

  const tableData = {
    columns: [
      { label: "معرّف التوصيل", field: "id", sort: "asc" },
      { label: "الطلب", field: "order", sort: "asc" },
      { label: "السائق", field: "driver", sort: "asc" },
      { label: "إدارة", field: "actions" },
    ],
    rows: deliverys.map((delivery) => ({
      id: delivery._id || "—",
      order: displayReference(delivery.orderid),
      driver: displayReference(delivery.user),
      actions: (
        <button
          type="button"
          className="btn btn-sm btn-danger py-1 px-2"
          disabled={deleteLoading}
          onClick={() => dispatch(deleteDelivery(delivery._id))}
        >
          مسح
        </button>
      ),
    })),
  };

  return (
    <div className="row">
      <div className="col-12 col-md-2" />
      <div className="col-12 col-md-10">
        <h1 className="h5 my-5">قائمة التوصيلات</h1>
        {loading ? (
          <Loader />
        ) : (
          <DataTable data={tableData} className="px-3" bordered striped hover />
        )}
      </div>
    </div>
  );
};

export default DeliveryList;
