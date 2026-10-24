import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { allUsers, clearErrors } from "../actions/userActions";
import { useAlert } from "../components/alerts/AlertProvider";

const SelectDriver = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { error, loading, users = [] } = useSelector((state) => state.allUsers);

  useEffect(() => {
    dispatch(allUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [alert, dispatch, error]);

  if (loading) {
    return <option disabled>جاري تحميل السائقين...</option>;
  }

  return (
    <>
      {users
        .filter((user) => user.role === "driver")
        .map((user) => (
          <option key={user._id} value={user._id}>
            {user.name}
          </option>
        ))}
    </>
  );
};

export default SelectDriver;
