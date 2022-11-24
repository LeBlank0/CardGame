import React from 'react';
import { Redirect, Switch } from 'react-router-dom';
import Route from "./Route"

import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Dashboard from '../components/Dashboard/Dashboard';

export default function Routes() {
    return (
        <Switch>
            <Route exact path="/login" exact component={Login} />
            <Route exact path="/register" exact component={Register} />
            <Route exact path="/dashboard" exact component={Dashboard} isPrivate />
            <Route component={Login} />
        </Switch>
    );
}