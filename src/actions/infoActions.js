import apiClient from '../api/client'
import { getApiErrorMessage } from '../api/errors'

import {
    ALL_INFOS_REQUEST,
    ALL_INFOS_SUCCESS,
    ALL_INFOS_FAIL,
    ADMIN_INFOS_REQUEST,
    ADMIN_INFOS_SUCCESS,
    ADMIN_INFOS_FAIL,
    NEW_INFO_REQUEST,
    NEW_INFO_SUCCESS,
    NEW_INFO_FAIL,
    DELETE_INFO_REQUEST,
    DELETE_INFO_SUCCESS,
    DELETE_INFO_FAIL,
    UPDATE_INFO_REQUEST,
    UPDATE_INFO_SUCCESS,
    UPDATE_INFO_FAIL,
    INFO_DETAILS_REQUEST,
    INFO_DETAILS_SUCCESS,
    INFO_DETAILS_FAIL,
    CLEAR_ERRORS
} from '../constants/infoConstants'

export const getInfos = (keyword = '', currentPage = 1, price = [], category, rating = 0) => async (dispatch) => {
    try {
        dispatch({ type: ALL_INFOS_REQUEST })

        const priceQuery = price.length >= 2
            ? `&price[lte]=${encodeURIComponent(price[1])}&price[gte]=${encodeURIComponent(price[0])}`
            : ''

        // The backend is not included, so preserve the legacy endpoint until its contract can be verified.
        let link = `/api/v1/OFFERs?keyword=${encodeURIComponent(keyword)}&page=${currentPage}${priceQuery}&ratings[gte]=${rating}`

        if (category) {
            link += `&category=${encodeURIComponent(category)}`
        }

        const { data } = await apiClient.get(link)

        dispatch({
            type: ALL_INFOS_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: ALL_INFOS_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const newInfo = (infoData) => async (dispatch) => {
    try {
        dispatch({ type: NEW_INFO_REQUEST })

        const { data } = await apiClient.post('/api/v1/admin/info/new', infoData)

        dispatch({
            type: NEW_INFO_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: NEW_INFO_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const deleteInfo = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_INFO_REQUEST })

        const { data } = await apiClient.delete(`/api/v1/admin/info/${id}`)

        dispatch({
            type: DELETE_INFO_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_INFO_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const updateInfo = (id, infoData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_INFO_REQUEST })

        const { data } = await apiClient.put(`/api/v1/admin/info/${id}`, infoData)

        dispatch({
            type: UPDATE_INFO_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_INFO_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const getInfoDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: INFO_DETAILS_REQUEST })

        const { data } = await apiClient.get(`/api/v1/infos/${id}`)

        dispatch({
            type: INFO_DETAILS_SUCCESS,
            payload: data.info
        })
    } catch (error) {
        dispatch({
            type: INFO_DETAILS_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const getAdminInfos = () => async (dispatch) => {
    try {
        dispatch({ type: ADMIN_INFOS_REQUEST })

        const { data } = await apiClient.get('/api/v1/infos')

        dispatch({
            type: ADMIN_INFOS_SUCCESS,
            payload: data.infos
        })
    } catch (error) {
        dispatch({
            type: ADMIN_INFOS_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}
