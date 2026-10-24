import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DataTable from '../components/DataTable'

import Loader from '../components/layout/Loader'


import { useAlert } from '../components/alerts/AlertProvider'
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts, deleteProduct, clearErrors } from '../actions/productActions'
import { DELETE_PRODUCT_RESET } from '../constants/productConstants'

const ProductsList = () => {

    const alert = useAlert();
    const dispatch = useDispatch();

    const { products ,loading, error } = useSelector(state => state.products);
    const { error: deleteError, isDeleted, loading: deleteLoading } = useSelector(state => state.product)

    useEffect(() => {
        dispatch(getAdminProducts());
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
            alert.success('Product deleted successfully');
            dispatch({ type: DELETE_PRODUCT_RESET })
            dispatch(getAdminProducts())
        }
    }, [dispatch, alert, isDeleted])

    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'اسم المنتج',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'نسبة الرأس',
                    field: 'headPrice',
                    sort: 'asc'
                },
                {
                    label: 'نسبة اﻷحشا',
                    field: 'bowelsPrice',
                    sort: 'asc'
                },
                {
                    label: 'الوزن الصغير',
                    field: 'smallWeight',
                },
                {
                    label: 'سعر الصغير',
                    field: 'smallPrice',
                },
                {
                    label: 'الوزن المتوسط',
                    field: 'mediumWeight',
                },
                {
                    label: 'سعر المتوسط',
                    field: 'mediumPrice',
                },
                {
                    label: 'الوزن الكبير',
                    field: 'largWeight',
                },
                {
                    label: 'سعر الكبير',
                    field: 'largPrice',
                },
                {
                    label: 'ادارة',
                    field: 'actions',
                },
            ],
            rows: []
        }

        (products || []).forEach(product => {
            data.rows.push({
                 id: product._id,
                name: product.name,
                headPrice: product.headPrice,
                bowelsPrice: product.bowelsPrice,
                smallWeight: product.smallWeight,
                smallPrice: product.smallPrice,
                mediumPrice: product.mediumPrice,
                mediumWeight: product.mediumWeight,
                largPrice: product.largPrice,
                largWeight: product.largWeight,
                actions: <Fragment>
                     <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2 ms-4">
                       تحديث
                    </Link> 
                    <button
                      type="button"
                      className="btn btn-sm btn-danger py-1 px-2 ml-2"
                      disabled={deleteLoading}
                      onClick={() => deleteProductHandler(product._id)}
                    >
                        مسح
                    </button>
                </Fragment>
            })
        })

        return data;
    }

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id))
    }

    return (
        <Fragment>
           
            <div className="row">
                <div className="col-12 col-md-2">
                 
                </div>

                <div className="col-12 col-md-10">
                    <div className="container">
                        <h5 className="my-5">قائمة المنتجات</h5>

                        {loading ? <Loader /> : (
                            <DataTable
                                data={setProducts()}
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

export default ProductsList
