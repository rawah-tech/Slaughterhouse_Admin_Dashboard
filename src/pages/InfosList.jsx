import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../components/DataTable'

import Loader from '../components/layout/Loader'


import { useAlert } from '../components/alerts/AlertProvider'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminInfos, clearErrors } from '../actions/infoActions'


const InfosList = () => {

    const alert = useAlert(); 
    const dispatch = useDispatch();

    const { infos ,loading, error } = useSelector(state => state.infos);
    useEffect(() => {
        dispatch(getAdminInfos());
    }, [dispatch])

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }
    }, [dispatch, alert, error])

    const setInfos = () => {
        const data = {
            columns: [
                {
                    label: 'رقم الهاتف',
                    field: 'kssPhone',
                    sort: 'asc'
                },
                {
                    label: 'الايميل',
                    field: 'kssEmail',
                    sort: 'asc'
                },
                {
                    label: 'حساب البنك',
                    field: 'bokNumber',
                    sort: 'asc'
                },
               
                {
                    label: 'ادارة',
                    field: 'actions',
                },
            ],
            rows: []
        }

        (infos || []).forEach(info => {
            data.rows.push({
                 id: info._id,
                 kssPhone: info.kssPhone,
                 kssEmail: info.kssEmail,
                 bokNumber: info.bokNumber,
                actions: <Fragment>
                     <Link to={`/admin/info/${info._id}`} className="btn btn-primary py-1 px-2 ms-4">
                       تحديث
                    </Link> 
                </Fragment>
            })
        })

        return data;
    }

    return (
        <Fragment>
           
            <div className="row ">
                <div className="col-12 col-md-2">
                 
                </div>

                <div className="col-12 col-md-10 ">
                    <div className="container">
                        <h5 className="my-5">قائمة معلومات التواصل</h5>

                        {loading ? <Loader /> : (
                            <DataTable
                                data={setInfos()}
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

export default InfosList
