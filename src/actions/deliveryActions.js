import apiClient from '../api/client'
import { getApiErrorMessage } from '../api/errors'

import {
    ALL_DELIVERYS_REQUEST,
    ALL_DELIVERYS_SUCCESS,
    ALL_DELIVERYS_FAIL,
    ADMIN_DELIVERYS_REQUEST,
    ADMIN_DELIVERYS_SUCCESS,
    ADMIN_DELIVERYS_FAIL,
    NEW_DELIVERY_REQUEST,
    NEW_DELIVERY_SUCCESS,
    NEW_DELIVERY_FAIL,
    DELETE_DELIVERY_REQUEST,
    DELETE_DELIVERY_SUCCESS,
    DELETE_DELIVERY_FAIL,
    UPDATE_DELIVERY_REQUEST,
    UPDATE_DELIVERY_SUCCESS,
    UPDATE_DELIVERY_FAIL,
    DELIVERY_DETAILS_REQUEST,
    DELIVERY_DETAILS_SUCCESS,
    DELIVERY_DETAILS_FAIL,
   
    CLEAR_ERRORS

} from '../constants/deliveryConstants'

export const getDeliverys = (keyword = '', currentPage = 1, price = [], category, rating = 0) => async (dispatch) => {
    try {

        dispatch({ type: ALL_DELIVERYS_REQUEST })

        const priceQuery = price.length >= 2
            ? `&price[lte]=${encodeURIComponent(price[1])}&price[gte]=${encodeURIComponent(price[0])}`
            : ''
        let link = `/api/v1/DELIVERYs?keyword=${encodeURIComponent(keyword)}&page=${currentPage}${priceQuery}&ratings[gte]=${rating}`

        if (category) {
            link += `&category=${encodeURIComponent(category)}`
        }

        const { data } = await apiClient.get(link)

        dispatch({
            type: ALL_DELIVERYS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_DELIVERYS_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const newDelivery = (deliveryData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_DELIVERY_REQUEST })

        const { data } = await apiClient.post(`/api/v1/admin/delivery/new`, deliveryData)

        dispatch({
            type: NEW_DELIVERY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_DELIVERY_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

// Delete DELIVERY (Admin)
export const deleteDelivery = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_DELIVERY_REQUEST })

        const { data } = await apiClient.delete(`/api/v1/admin/delivery/${id}`)

        dispatch({
            type: DELETE_DELIVERY_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_DELIVERY_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

// Update DELIVERY (ADMIN)
export const updateDelivery = (id, deliveryData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_DELIVERY_REQUEST })

        const { data } = await apiClient.put(`/api/v1/admin/delivery/${id}`, deliveryData)

        dispatch({
            type: UPDATE_DELIVERY_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_DELIVERY_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const getDeliveryDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELIVERY_DETAILS_REQUEST })

        const { data } = await apiClient.get(`/api/v1/delivery/${id}`)

        dispatch({
            type: DELIVERY_DETAILS_SUCCESS,
            payload: data.delivery
        })

    } catch (error) {
        dispatch({
            type: DELIVERY_DETAILS_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}




export const getAdminDeliverys = () => async (dispatch) => {
    try {

        dispatch({ type: ADMIN_DELIVERYS_REQUEST })

        const { data } = await apiClient.get(`/api/v1/admin/deliverys`)

        dispatch({
            type: ADMIN_DELIVERYS_SUCCESS,
            payload: data.deliverys
        })

    } catch (error) {

        dispatch({
            type: ADMIN_DELIVERYS_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}





// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}
