import React, { useEffect, useRef, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Routes } from "../routes";
import { loadUser } from "../actions/userActions";
import Preloader from "../components/Preloader";
import ProtectedRoute from "./ProtectedRoute";

import Upgrade from "./Upgrade";
import DashboardOverview from "./dashboard/DashboardOverview";
import ListOrders from "./ListOrders";
import ProductTable from "./ProductTable";
import UpdateUser from "./UpdateUser";
import Signin from "./examples/Signin";
import NotFoundPage from "./examples/NotFound";
import ServerError from "./examples/ServerError";
import UpdateProduct from "./UpdateProduct";
import NewProduct from "./NewProduct";
import NewUser from "./NewUser";
import ProductsList from "./ProductsList";
import AddInfo from "./AddInfo";
import InfosList from "./InfosList";
import OrderDetails from "./OrderDetails";
import NewOffer from "./NewOffer";
import OffersList from "./OffersList";
import UpdateOffer from "./UpdateOffer";
import NewDelivery from "./NewDelivery";
import UpdateInfo from "./UpdateInfo";
import NewImage from "./NewImage";

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(true), 1_000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Preloader show={!loaded} />
          <Component {...props} />
        </>
      )}
    />
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const sessionRestorationStarted = useRef(false);

  useEffect(() => {
    if (sessionRestorationStarted.current) {
      return;
    }

    sessionRestorationStarted.current = true;
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <Switch>
      <RouteWithLoader exact path={Routes.Signin.path} component={Signin} />
      <RouteWithLoader
        exact
        path={Routes.NotFound.path}
        component={NotFoundPage}
      />
      <RouteWithLoader
        exact
        path={Routes.ServerError.path}
        component={ServerError}
      />

      <ProtectedRoute
        exact
        path={Routes.DashboardOverview.path}
        isAdmin
        component={DashboardOverview}
      />
      <ProtectedRoute
        exact
        path={Routes.Upgrade.path}
        isAdmin
        component={Upgrade}
      />
      <ProtectedRoute
        exact
        path={Routes.ListOrders.path}
        isAdmin
        component={ListOrders}
      />
      <ProtectedRoute
        exact
        path={Routes.ProductTable.path}
        isAdmin
        component={ProductTable}
      />
      <ProtectedRoute
        exact
        path={Routes.UpdateUser.path}
        isAdmin
        component={UpdateUser}
      />
      <ProtectedRoute
        exact
        path={Routes.NewProduct.path}
        isAdmin
        component={NewProduct}
      />
      <ProtectedRoute
        exact
        path={Routes.NewImage.path}
        isAdmin
        component={NewImage}
      />
      <ProtectedRoute
        exact
        path={Routes.NewUser.path}
        isAdmin
        component={NewUser}
      />
      <ProtectedRoute
        exact
        path={Routes.ProductsList.path}
        isAdmin
        component={ProductsList}
      />
      <ProtectedRoute
        exact
        path={Routes.AddInfo.path}
        isAdmin
        component={AddInfo}
      />
      <ProtectedRoute
        exact
        path={Routes.InfosList.path}
        isAdmin
        component={InfosList}
      />
      <ProtectedRoute
        exact
        path={Routes.UpdateProduct.path}
        isAdmin
        component={UpdateProduct}
      />
      <ProtectedRoute
        exact
        path={Routes.OrderDetails.path}
        isAdmin
        component={OrderDetails}
      />
      <ProtectedRoute
        exact
        path={Routes.OffersList.path}
        isAdmin
        component={OffersList}
      />
      <ProtectedRoute
        exact
        path={Routes.NewOffer.path}
        isAdmin
        component={NewOffer}
      />
      <ProtectedRoute
        exact
        path={Routes.NewDelivery.path}
        isAdmin
        component={NewDelivery}
      />
      <ProtectedRoute
        exact
        path={Routes.UpdateOffer.path}
        isAdmin
        component={UpdateOffer}
      />
      <ProtectedRoute
        exact
        path={Routes.UpdateInfo.path}
        isAdmin
        component={UpdateInfo}
      />

      <Redirect to={Routes.NotFound.path} />
    </Switch>
  );
};

export default HomePage;
