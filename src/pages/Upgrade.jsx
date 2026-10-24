import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { allUsers, clearErrors, deleteUser } from "../actions/userActions";
import { useAlert } from "../components/alerts/AlertProvider";
import DataTable from "../components/DataTable";
import Loader from "../components/layout/Loader";
import { DELETE_USER_RESET } from "../constants/userConstants";

const UsersList = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, users = [] } = useSelector(
    (state) => state.allUsers
  );
  const {
    error: deleteError,
    isDeleted,
    loading: deleteLoading,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(allUsers());
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
      alert.success("تم حذف المستخدم بنجاح.");
      dispatch({ type: DELETE_USER_RESET });
      dispatch(allUsers());
    }
  }, [alert, dispatch, isDeleted]);

  const tableData = {
    columns: [
      { label: "الاسم", field: "name", sort: "asc" },
      { label: "البريد الإلكتروني", field: "email", sort: "asc" },
      { label: "رقم الهاتف", field: "phone", sort: "asc" },
      { label: "رقم هاتف آخر", field: "phone2", sort: "asc" },
      { label: "نوع المستخدم", field: "role", sort: "asc" },
      { label: "إدارة", field: "actions" },
    ],
    rows: users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      phone2: user.phone2,
      role: user.role,
      actions: (
        <div className="d-flex gap-2">
          <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2">
            تحديث
          </Link>
          <button
            type="button"
            className="btn btn-sm btn-danger py-1 px-2"
            disabled={deleteLoading}
            onClick={() => dispatch(deleteUser(user._id))}
          >
            مسح
          </button>
        </div>
      ),
    })),
  };

  return (
    <div className="row">
      <div className="col-12 col-md-2" />
      <div className="col-12 col-md-10">
        <h1 className="h5 my-5">المستخدمون</h1>
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            data={tableData}
            className="container bg-white pt-5"
            bordered
            striped
            hover
          />
        )}
      </div>
    </div>
  );
};

export default UsersList;
