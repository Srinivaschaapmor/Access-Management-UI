import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Box, Divider, Grid } from "@mui/material";
import Sidebar from "./components/Sidebar";
import { jwtDecode } from "jwt-decode"; // Correct import
import NotAuthorised from "./NotAuthorised";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (window.location.pathname === "/login") {
      navigate("/dashboard/users-list");
    }
  }, [navigate, token]);

  return token ? <Content /> : null;
};

const Content = () => {
  const token = Cookies.get("jwtToken");
  let role;

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      role = decodedToken.Role; // Assuming the token has a 'role' field
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  if (role !== "Admin") {
    return <NotAuthorised />; // Only render for admin users
  }

  return (
    <Box>
      <Grid container>
        <Grid item xs={2}>
          <Sidebar />
        </Grid>
        <Grid item xs={0.5}>
          <Divider orientation="vertical" sx={{ borderStyle: "dashed" }} />
        </Grid>
        <Grid item xs={9}>
          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProtectedRoute;
