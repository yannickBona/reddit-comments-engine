import { useContext } from "react";
import { IAuthContext } from "../../contexts/types";
import { AuthContext } from "../../contexts/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { MainContextProvider } from "../../contexts/MainContext";
import Navbar from "../Navbar/Navbar";
import DeletePostModal from "../DeletePostModal";

const RequireAuth = () => {
  const { user } = useContext<IAuthContext>(AuthContext);
  const location = useLocation();

  const isAuthorized = !!user;

  return isAuthorized ? (
    <MainContextProvider>
      <Navbar />
      <Outlet />
      <DeletePostModal />
    </MainContextProvider>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
