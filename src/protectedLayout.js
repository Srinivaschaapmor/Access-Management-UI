import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Box, Divider, Grid } from "@mui/material";
import Sidebar from "./components/sidebar/Sidebar";
import { jwtDecode } from "jwt-decode"; // Correct import
import NotAuthorised from "./NotAuthorised";

import Header from "./components/header/Header";

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const token = Cookies.get("jwtToken");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else if (window.location.pathname === "/login") {
      navigate("/dashboard/home");
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
      <Grid container sx={{ maxHeight: "100vh" }}>
        <Grid
          item
          xs={2.5}
          sx={{
            bgcolor: "rgb(245, 245, 245)",
            minHeight: "100vh",
            maxHeight: "100vh",
          }}
        >
          <Sidebar />
        </Grid>
        <Grid item>
          <Divider
            orientation="vertical"
            sx={{
              borderStyle: "dashed",
              maxHeight: "100vh",
              fontWeight: "bold",
            }}
          />
        </Grid>
        <Grid
          item
          xs={9.49}
          py={3}
          px={2}
          sx={{ overflowY: "auto", maxHeight: "100vh" }}
          bgcolor={"rgb(255, 255, 255)"}
        >
          <Header />

          <Outlet />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProtectedRoute;
