import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    if (token === undefined) {
      navigate("/login");
    } else if (window.location.pathname === "/login") {
      navigate("/dashboard");
    }
  }, [navigate, token]);

  return token === undefined ? null : <Content />;
};

const Content = () => {
  return <Outlet />;
};

export default ProtectedRoute;
