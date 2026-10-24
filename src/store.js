import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { productsReducer, newProductReducer, productReducer, productDetailsReducer, newReviewReducer, productReviewsReducer, reviewReducer } from './reducers/productReducers'
import { authReducer, adminUserCreationReducer, userReducer, forgotPasswordReducer, allUsersReducer, userDetailsReducer } from './reducers/userReducers'

import { newOrderReducer, myOrdersReducer, orderDetailsReducer, allOrdersReducer, orderReducer } from './reducers/orderReducers'

import { infosReducer, newInfoReducer ,infoReducer , infoDetailsReducer} from './reducers/infoReducers'

import { offersReducer, newOfferReducer, offerReducer, offerDetailsReducer } from './reducers/offerReducers'

import { deliverysReducer, newDeliveryReducer, deliveryReducer, deliveryDetailsReducer } from './reducers/deliveryReducers'

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    newProduct: newProductReducer,
    product: productReducer,
    productReviews: productReviewsReducer,
    review: reviewReducer,

    auth: authReducer,
    newUser: adminUserCreationReducer,
    user: userReducer,
    allUsers: allUsersReducer,
    userDetails: userDetailsReducer,
    forgotPassword: forgotPasswordReducer,

    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    allOrders: allOrdersReducer,
    orderDetails: orderDetailsReducer,
    order: orderReducer,
    newReview: newReviewReducer,


    infos: infosReducer,
    newInfo: newInfoReducer,
    info:infoReducer,
    infoDetails: infoDetailsReducer,

    deliverys: deliverysReducer,
    deliveryDetails: deliveryDetailsReducer,
    newDelivery: newDeliveryReducer,
    delivery: deliveryReducer,

    offers: offersReducer,
    offerDetails: offerDetailsReducer,
    newOffer: newOfferReducer,
    offer: offerReducer,
})


const middlware = [thunk];
const composeEnhancers =
    import.meta.env.DEV && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(...middlware))
)

export default store;
