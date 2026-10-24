import apiClient from "../api/client";
import { getApiErrorMessage } from "../api/errors";
import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    ADMIN_CREATE_USER_REQUEST,
    ADMIN_CREATE_USER_SUCCESS,
    ADMIN_CREATE_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAIL,
    UPDATE_PASSWORD_REQUEST,
    UPDATE_PASSWORD_SUCCESS,
    UPDATE_PASSWORD_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    NEW_PASSWORD_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    USER_DETAILS_REQUEST,
    USER_DETAILS_SUCCESS,
    USER_DETAILS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    CLEAR_ERRORS
} from "../constants/userConstants";

const dispatchFailure = (dispatch, type, error) => {
    const message = getApiErrorMessage(error);
    dispatch({ type, payload: message });
    return message;
};

export const login = (phone, password) => async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });

    try {
        const { data } = await apiClient.post("/api/v1/login", { phone, password });

        dispatch({
            type: LOGIN_SUCCESS,
            payload: data.user
        });

        return data.user;
    } catch (error) {
        dispatchFailure(dispatch, LOGIN_FAIL, error);
        return null;
    }
};

// Retained for the existing public/session registration contract.
export const register = (userData) => async (dispatch) => {
    dispatch({ type: REGISTER_USER_REQUEST });

    try {
        const { data } = await apiClient.post("/api/v1/register", userData);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data.user
        });

        return data.user;
    } catch (error) {
        dispatchFailure(dispatch, REGISTER_USER_FAIL, error);
        return null;
    }
};

// Administrator-created users intentionally use state separate from authReducer.
export const newUser = (userData) => async (dispatch) => {
    dispatch({ type: ADMIN_CREATE_USER_REQUEST });

    try {
        const { data } = await apiClient.post("/api/v1/register", userData);

        dispatch({
            type: ADMIN_CREATE_USER_SUCCESS,
            payload: data.user
        });

        return data.user;
    } catch (error) {
        dispatchFailure(dispatch, ADMIN_CREATE_USER_FAIL, error);
        return null;
    }
};

export const loadUser = () => async (dispatch) => {
    dispatch({ type: LOAD_USER_REQUEST });

    try {
        const { data } = await apiClient.get("/api/v1/me");

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data.user
        });

        return data.user;
    } catch (error) {
        dispatchFailure(dispatch, LOAD_USER_FAIL, error);
        return null;
    }
};

export const updateProfile = (userData) => async (dispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    try {
        const { data } = await apiClient.put("/api/v1/me/update", userData);

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatchFailure(dispatch, UPDATE_PROFILE_FAIL, error);
    }
};

export const updatePassword = (passwords) => async (dispatch) => {
    dispatch({ type: UPDATE_PASSWORD_REQUEST });

    try {
        const { data } = await apiClient.put("/api/v1/password/update", passwords);

        dispatch({
            type: UPDATE_PASSWORD_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatchFailure(dispatch, UPDATE_PASSWORD_FAIL, error);
    }
};

export const forgotPassword = (email) => async (dispatch) => {
    dispatch({ type: FORGOT_PASSWORD_REQUEST });

    try {
        const { data } = await apiClient.post("/api/v1/password/forgot", email);

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data.message
        });
    } catch (error) {
        dispatchFailure(dispatch, FORGOT_PASSWORD_FAIL, error);
    }
};

export const resetPassword = (token, passwords) => async (dispatch) => {
    dispatch({ type: NEW_PASSWORD_REQUEST });

    try {
        const { data } = await apiClient.put(
            `/api/v1/password/reset/${token}`,
            passwords
        );

        dispatch({
            type: NEW_PASSWORD_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatchFailure(dispatch, NEW_PASSWORD_FAIL, error);
    }
};

export const logout = () => async (dispatch) => {
    dispatch({ type: LOGOUT_REQUEST });

    try {
        await apiClient.get("/api/v1/logout");
        dispatch({ type: LOGOUT_SUCCESS });
        return { success: true, error: null };
    } catch (error) {
        const message = dispatchFailure(dispatch, LOGOUT_FAIL, error);

        // LOGOUT_FAIL also clears local identity so a backend outage cannot trap
        // the user in a partially authenticated UI.
        return { success: false, error: message };
    }
};

export const allUsers = () => async (dispatch) => {
    dispatch({ type: ALL_USERS_REQUEST });

    try {
        const { data } = await apiClient.get("/api/v1/admin/users");

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data.users
        });
    } catch (error) {
        dispatchFailure(dispatch, ALL_USERS_FAIL, error);
    }
};

export const updateUser = (id, userData) => async (dispatch) => {
    dispatch({ type: UPDATE_USER_REQUEST });

    try {
        const { data } = await apiClient.put(
            `/api/v1/admin/user/${id}`,
            userData
        );

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatchFailure(dispatch, UPDATE_USER_FAIL, error);
    }
};

export const getUserDetails = (id) => async (dispatch) => {
    dispatch({ type: USER_DETAILS_REQUEST });

    try {
        const { data } = await apiClient.get(`/api/v1/admin/user/${id}`);

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data.user
        });
    } catch (error) {
        dispatchFailure(dispatch, USER_DETAILS_FAIL, error);
    }
};

export const deleteUser = (id) => async (dispatch) => {
    dispatch({ type: DELETE_USER_REQUEST });

    try {
        const { data } = await apiClient.delete(`/api/v1/admin/user/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data.success
        });
    } catch (error) {
        dispatchFailure(dispatch, DELETE_USER_FAIL, error);
    }
};

export const clearErrors = () => (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};
