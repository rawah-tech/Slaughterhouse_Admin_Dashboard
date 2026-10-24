import {
    ALL_OFFERS_REQUEST,
    ALL_OFFERS_SUCCESS,
    ALL_OFFERS_FAIL,
    ADMIN_OFFERS_REQUEST,
    ADMIN_OFFERS_SUCCESS,
    ADMIN_OFFERS_FAIL,
    NEW_OFFER_REQUEST,
    NEW_OFFER_SUCCESS,
    NEW_OFFER_RESET,
    NEW_OFFER_FAIL,
    DELETE_OFFER_REQUEST,
    DELETE_OFFER_SUCCESS,
    DELETE_OFFER_RESET,
    DELETE_OFFER_FAIL,
    UPDATE_OFFER_REQUEST,
    UPDATE_OFFER_SUCCESS,
    UPDATE_OFFER_RESET,
    UPDATE_OFFER_FAIL,
    OFFER_DETAILS_REQUEST,
    OFFER_DETAILS_SUCCESS,
    OFFER_DETAILS_FAIL,
   
    CLEAR_ERRORS

} from '../constants/offerConstants'

export const offersReducer = (state = { offers: [] }, action) => {
    switch (action.type) {
        case ALL_OFFERS_REQUEST:
        case ADMIN_OFFERS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }

        case ALL_OFFERS_SUCCESS:
            return {
                loading: false,
                offers: action.payload.offers,
                offersCount: action.payload.offersCount,
                resPerPage: action.payload.resPerPage,
                filteredOffersCount: action.payload.filteredOffersCount
            }

        case ADMIN_OFFERS_SUCCESS:
            return {
                loading: false,
                offers: action.payload
            }

        case ALL_OFFERS_FAIL:
        case ADMIN_OFFERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const newOfferReducer = (state = { offer: {} }, action) => {
    switch (action.type) {

        case NEW_OFFER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }

        case NEW_OFFER_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                offer: action.payload.offer
            }

        case NEW_OFFER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case NEW_OFFER_RESET:
            return {
                ...state,
                success: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const offerReducer = (state = {}, action) => {
    switch (action.type) {

        case DELETE_OFFER_REQUEST:
        case UPDATE_OFFER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }

        case DELETE_OFFER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: action.payload
            }

        case UPDATE_OFFER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload
            }


        case DELETE_OFFER_FAIL:
        case UPDATE_OFFER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case DELETE_OFFER_RESET:
            return {
                ...state,
                isDeleted: false
            }

        case UPDATE_OFFER_RESET:
            return {
                ...state,
                isUpdated: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

export const offerDetailsReducer = (state = { offer: {} }, action) => {
    switch (action.type) {

        case OFFER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }

        case OFFER_DETAILS_SUCCESS:
            return {
                loading: false,
                offer: action.payload
            }

        case OFFER_DETAILS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state
    }
}

