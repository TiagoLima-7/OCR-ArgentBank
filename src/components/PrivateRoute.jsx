import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoggingOut } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={isLoggingOut ? "/" : "/sign-in"} replace />;
  }

  return children;
}

export default PrivateRoute;
