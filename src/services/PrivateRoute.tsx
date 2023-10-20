import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAuthenticated } from "./Auth";

/**
 * Determine if the user is authenticated render requested page otherwise login page
 * @param IBasicChild
 * @returns JSX.Element
 */
function PrivateRoute() {
  const auth = useAuth();
  const location = useLocation();
  const _isAuthenticated = isAuthenticated();

  if (!auth?.user && !_isAuthenticated) {
    /** Redirect them to the /login page, but save the current location they were
    trying to go to when they were redirected. This allows us to send them
    along to that page after they login, which is a nicer user experience
    than dropping them off on the home page. */
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default PrivateRoute;
