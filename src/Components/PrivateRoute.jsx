import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h1 className="text-center mt-10">Loading...</h1>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default PrivateRoute;