import React from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../redux/slices/auth";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, []);

  if (auth.initialLoad) return null;

  //   if !authenticated
  if (!auth.user._id) {
    return <Navigate to="/login" replae />;
  }

  return children;
}
