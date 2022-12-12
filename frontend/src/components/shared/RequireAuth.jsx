import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RequireAuth(props) {
  const { children } = props;
  const { user } = useSelector((state) => state.userReducer);

  if (user?.token) {
    return children;
  }

  return <Navigate to="/login" />;
}
