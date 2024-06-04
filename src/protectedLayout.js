import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Divider, Grid } from "@mui/material";
import Sidebar from "./components/Sidebar";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    if (token === undefined) {
      navigate("/");
    } else if (window.location.pathname === "/login") {
      navigate("/dashboard/users-list");
    }
  }, [navigate, token]);

  return token === undefined ? null : <Content />;
};

const Content = () => {
  return (
    <Grid container>
      <Grid xs={2}>
        <Sidebar />
      </Grid>
      <Grid item xs={0.5}>
        <Divider
          orientation="vertical"
          sx={{ borderStyle: "dashed" }}
        ></Divider>
      </Grid>
      <Grid xs={9}>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default ProtectedRoute;
