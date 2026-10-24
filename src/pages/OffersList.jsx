import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../components/DataTable'

import Loader from '../components/layout/Loader'


import { useAlert } from '../components/alerts/AlertProvider'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminOffers, deleteOffer, clearErrors } from '../actions/offerActions'
import { DELETE_OFFER_RESET } from '../constants/offerConstants'

const OffersList = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { offers ,loading, error } = useSelector(state => state.offers);
    const { error: deleteError, isDeleted, loading: deleteLoading } = useSelector(state => state.offer)

    useEffect(() => {
        dispatch(getAdminOffers());
    }, [dispatch])

    useEffect(() => {
        const message = deleteError || error;
        if (message) {
            alert.error(message);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, deleteError, error])

    useEffect(() => {
        if (isDeleted) {
            alert.success('Offer deleted successfully');
            dispatch({ type: DELETE_OFFER_RESET })
            dispatch(getAdminOffers())
        }
    }, [dispatch, alert, isDeleted])

    const setOffers = () => {
        const data = {
            columns: [
                {
                    label: 'اسم العرض',
                    field: 'off',
                    sort: 'asc'
                },
                {
                    label: 'ادارة',
                    field: 'actions',
                },
               
            ],
            rows: []
        }

        (offers || []).forEach(offer => {
            data.rows.push({
                 id: offer._id,
                off: offer.off,
              
                actions: <Fragment>
                     <Link to={`/admin/offer/${offer._id}`} className="btn btn-primary py-1 px-2 ms-4">
                       تحديث
                    </Link> 
                    <button
                      type="button"
                      className="btn btn-sm btn-danger py-1 px-2 ml-2"
                      disabled={deleteLoading}
                      onClick={() => deleteOfferHandler(offer._id)}
                    >
                        مسح
                    </button>
                </Fragment>
            })
        })

        return data;
    }

    const deleteOfferHandler = (id) => {
        dispatch(deleteOffer(id))
    }

    return (
        <Fragment>
           
            <div className="row">
                <div className="col-12 col-md-2">
                 
                </div>

                <div className="col-12 col-md-10">
                    <div className="container">
                        <h5 className="my-5">قائمة العروض</h5>

                        {loading ? <Loader /> : (
                            <DataTable
                                data={setOffers()}
                                className="px-3 bg-white pt-5 container"
                                bordered
                                striped
                                hover
                            />
                        )}

                    </div>
                </div>
            </div>

        </Fragment>
    )
}

export default OffersList
