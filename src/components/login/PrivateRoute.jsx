// src/components/login/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import verifyToken from '../../utils/verify';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    verifyToken().then(isValid => setIsAuthenticated(isValid));
  }, []);

  if (isAuthenticated === null) {
    // You might want to render a loading spinner here
    return null;
  }

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

export default PrivateRoute;