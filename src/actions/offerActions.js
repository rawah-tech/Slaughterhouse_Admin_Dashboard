import apiClient from '../api/client'
import { getApiErrorMessage } from '../api/errors'

import {
    ALL_OFFERS_REQUEST,
    ALL_OFFERS_SUCCESS,
    ALL_OFFERS_FAIL,
    ADMIN_OFFERS_REQUEST,
    ADMIN_OFFERS_SUCCESS,
    ADMIN_OFFERS_FAIL,
    NEW_OFFER_REQUEST,
    NEW_OFFER_SUCCESS,
    NEW_OFFER_FAIL,
    DELETE_OFFER_REQUEST,
    DELETE_OFFER_SUCCESS,
    DELETE_OFFER_FAIL,
    UPDATE_OFFER_REQUEST,
    UPDATE_OFFER_SUCCESS,
    UPDATE_OFFER_FAIL,
    OFFER_DETAILS_REQUEST,
    OFFER_DETAILS_SUCCESS,
    OFFER_DETAILS_FAIL,

    CLEAR_ERRORS

} from '../constants/offerConstants'

export const getOffers = (keyword = '', currentPage = 1, price = [], category, rating = 0) => async (dispatch) => {
    try {

        dispatch({ type: ALL_OFFERS_REQUEST })

        const priceQuery = price.length >= 2
            ? `&price[lte]=${encodeURIComponent(price[1])}&price[gte]=${encodeURIComponent(price[0])}`
            : ''
        let link = `/api/v1/OFFERs?keyword=${encodeURIComponent(keyword)}&page=${currentPage}${priceQuery}&ratings[gte]=${rating}`

        if (category) {
            link += `&category=${encodeURIComponent(category)}`
        }

        const { data } = await apiClient.get(link)

        dispatch({
            type: ALL_OFFERS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_OFFERS_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const newOffer = (offerData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_OFFER_REQUEST })

        const { data } = await apiClient.post(`/api/v1/admin/Offer/new`, offerData)

        dispatch({
            type: NEW_OFFER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_OFFER_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

// Delete OFFER (Admin)
export const deleteOffer = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_OFFER_REQUEST })

        const { data } = await apiClient.delete(`/api/v1/admin/offer/${id}`)

        dispatch({
            type: DELETE_OFFER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: DELETE_OFFER_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

// Update OFFER (ADMIN)
export const updateOffer = (id, offerData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_OFFER_REQUEST })

        const { data } = await apiClient.put(`/api/v1/admin/offer/${id}`, offerData)

        dispatch({
            type: UPDATE_OFFER_SUCCESS,
            payload: data.success
        })

    } catch (error) {
        dispatch({
            type: UPDATE_OFFER_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const getOfferDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: OFFER_DETAILS_REQUEST })

        const { data } = await apiClient.get(`/api/v1/offer/${id}`)

        dispatch({
            type: OFFER_DETAILS_SUCCESS,
            payload: data.offer
        })

    } catch (error) {
        dispatch({
            type: OFFER_DETAILS_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const getAdminOffers = () => async (dispatch) => {
    try {

        dispatch({ type: ADMIN_OFFERS_REQUEST })

        const { data } = await apiClient.get(`/api/v1/offers`)

        dispatch({
            type: ADMIN_OFFERS_SUCCESS,
            payload: data.offers
        })

    } catch (error) {

        dispatch({
            type: ADMIN_OFFERS_FAIL,
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
