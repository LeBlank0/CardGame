import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

export default function RouteWrapper({
    component: Component,
    isPrivate,
    ...rest
}) {

    if (isPrivate && (document.cookie == 'null') || (document.cookie == 'jwtcookie') ) {
        return <Redirect to="/" />;
    }

    if (!isPrivate && document.cookie != 'null') {
        if (document.cookie == 'jwtcookie') {
            return <Redirect to="/dashboard" />;
        }
    }

    return <Route {...rest} component={Component} />;
}

RouteWrapper.propTypes = {
    isPrivate: PropTypes.bool,
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired
};

RouteWrapper.defaultProps = {
    isPrivate: false
};