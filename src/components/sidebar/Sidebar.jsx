import React, { cloneElement } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineIdentification } from "react-icons/hi";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import Logo from "../../assets/AuthXLogo.png";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
const sidebarItems = [
  { label: "Home", route: "/dashboard/home", icon: <HomeOutlinedIcon /> },
  {
    label: "List Of Users",
    route: "/dashboard/users-list",
    icon: <AccountBoxOutlinedIcon />,
  },
  {
    label: "Access Management",
    route: "/dashboard/access-management",
    icon: <BadgeOutlinedIcon />,
  },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box>
      <Stack sx={{ p: 3 }}>
        <img src={Logo} width={130} alt="Logo"></img>
      </Stack>
      <Box
        sx={{
          ml: 3,
          overflowY: "auto",
          maxHeight: "70vh",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {/* <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgb(99, 115, 129) ",
            mb: 3,
          }}
        >
          MANAGEMENT
        </Typography> */}
        <Stack gap={2}>
          {sidebarItems.map((item, index) => (
            <Stack
              key={index}
              onClick={() => navigate(item.route)}
              direction={"row"}
              alignItems={"center"}
              bgcolor={
                location.pathname.includes(item.route) && "rgb(252, 252, 252)"
              }
              p={1}
              width={200}
              borderRadius={3}
            >
              {cloneElement(item.icon, {
                sx: {
                  color: location.pathname.includes(item.route)
                    ? "rgb(114, 68, 255)"
                    : "rgb(116, 130, 143)",
                },
              })}
              <Button
                sx={{
                  textTransform: "capitalize",
                  fontWeight: location.pathname.includes(item.route) && "600",
                  color: location.pathname.includes(item.route)
                    ? "rgb(114, 68, 255)"
                    : "grey",
                }}
              >
                {item.label}
              </Button>
            </Stack>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default Sidebar;
