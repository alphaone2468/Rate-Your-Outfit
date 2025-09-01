import React from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';   


export default function ProtectedRoute({ children }) {
  const getUser = React.useContext(UserContext);
  if (!getUser.user) {
    return <Navigate to="/login" />;
  }

  return children;
}
