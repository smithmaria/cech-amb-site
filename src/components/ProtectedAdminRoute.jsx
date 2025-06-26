import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading />
  }

  if (!currentUser || !currentUser.isAdmin) {
    return <Navigate to="/" replace />
  }

  return children;
};

export default ProtectedAdminRoute;
