import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)

  // If token exists → show the protected content (children)
  // If no token → redirect to login
  return token ? children : <Navigate to="/login" replace />
}

export default PrivateRoute