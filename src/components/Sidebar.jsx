import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import React, { useLayoutEffect } from "react";

import Logo from "../assets/logo.png";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineIdentification } from "react-icons/hi";
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      {/* <Grid item xs={2}> */}
      <Stack sx={{ pt: 5, pb: 5 }}>
        <img src={Logo} width={130} alt="Logo"></img>
        {/* <Typography fontSize={9} fontWeight={600}>
          LOGO TECHNOLOGIES
        </Typography> */}
      </Stack>
      <Box sx={{ ml: 3 }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgb(99, 115, 129) ",
            mb: 3,
          }}
        >
          MANAGEMENT
        </Typography>
        <Stack gap={2}>
          <Stack
            onClick={() => navigate("/dashboard/users-list")}
            direction={"row"}
            alignItems={"center"}
            bgcolor={
              location?.pathname?.includes("/users-list")
                ? "rgb(214, 241, 232)"
                : "white"
            }
            p={1}
            width={200}
            borderRadius={3}
          >
            <AccountBoxOutlinedIcon
              sx={{
                color: location?.pathname?.includes("/users-list")
                  ? "rgb(0, 167, 111)"
                  : "rgb(116, 130, 143)",
              }}
            />
            <Button
              sx={{
                textTransform: "capitalize",
                color: location?.pathname?.includes("/users-list")
                  ? "rgb(0, 167, 111)"
                  : "grey",
              }}
            >
              List Of Users
            </Button>
          </Stack>{" "}
          <Stack
            onClick={() => navigate("/dashboard/access-management")}
            direction={"row"}
            alignItems={"center"}
            bgcolor={
              location?.pathname?.includes("/access-management")
                ? "rgb(214, 241, 232)"
                : "white"
            }
            p={1}
            width={200}
            borderRadius={3}
          >
            {/* <AccountBoxOutlinedIcon
              sx={{
                color: location?.pathname?.includes("/access-management")
                  ? "rgb(0, 167, 111)"
                  : "rgb(116, 130, 143)",
              }}
            /> */}
            <HiOutlineIdentification
              style={{
                fontSize: "25px",
                color: location?.pathname?.includes("/access-management")
                  ? "rgb(0, 167, 111)"
                  : "rgb(116, 130, 143)",
              }}
            />
            <Button
              sx={{
                textTransform: "capitalize",
                color: location?.pathname?.includes("/access-management")
                  ? "rgb(0, 167, 111)"
                  : "grey",
              }}
            >
              Access Management
            </Button>
          </Stack>
        </Stack>
      </Box>
      {/* </Grid> */}
    </>
  );
}

export default Sidebar;
