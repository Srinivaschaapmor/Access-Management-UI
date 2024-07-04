import { Box, Button, Typography } from "@mui/material";
import React from "react";
import Header from "./components/header/Header";

function NotAuthorised() {
  return (
    <Box mt={2}>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          textAlign: "center",
          // p: 3,
        }}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Eo_circle_red_not-allowed.svg/768px-Eo_circle_red_not-allowed.svg.png"
          style={{ width: "150px", height: "150px", marginBottom: "10px" }}
        ></img>
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" gutterBottom>
          You do not have the necessary permissions to view this page.
        </Typography>
      </Box>
    </Box>
  );
}

export default NotAuthorised;
