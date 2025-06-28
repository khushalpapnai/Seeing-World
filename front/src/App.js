import React, { useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import MainNavigation from "./shared/element/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/auth/auth";
import { auth_context } from "./shared/context/auth_context";

const App = () => {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [userId, setuserId] = useState(false);

  const LOGIN = useCallback((uid) => {
    setisLoggedIn(true);
    setuserId(uid);
  }, []);
  const LOGOUT = useCallback(() => {
    setisLoggedIn(false);
    setuserId(null);
  }, []);

  let route;
  if (isLoggedIn) {
    route = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    route = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <auth_context.Provider
      value={{ isLoggedIn: isLoggedIn,userId:userId, LOGIN: LOGIN, LOGOUT: LOGOUT }}
    >
      <Router>
        <MainNavigation />
        <main>{route}</main>
      </Router>
    </auth_context.Provider>
  );
};

export default App;
