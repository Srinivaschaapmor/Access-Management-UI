import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Cookies from "js-cookie";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
function Header() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    // Implement your logout logic here
    // For example: redirect to logout page or clear session
    Cookies.remove("jwtToken");
    Cookies.remove("userEmail");
    navigate("/login");
    console.log("Logged out");
    handleClose();
  };

  const handleAccountSettings = () => {
    // Implement your account settings logic here
    console.log("Account settings");
    handleClose();
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;
  return (
    <Stack
      // direction={"row"}
      // alignItems={"center"}
      // justifyContent={"space-between"}
      sx={{ pt: 5, pb: 5 }}
    >
      <Stack>
        <img src={Logo} width={130} alt="Logo"></img>
        {/* <Typography fontSize={9} fontWeight={600}>
          LOGO TECHNOLOGIES
        </Typography> */}
      </Stack>

      {/* <Stack direction={"row"} gap={2}>
        <Box>
          <Avatar onClick={handleClick} sx={{ cursor: "pointer" }}>
            H
          </Avatar>
          <Popper id={id} open={open} anchorEl={anchorEl}>
            <Box>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
              >
                <MenuItem onClick={handleAccountSettings}>
                  Account Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Popper>
        </Box>
      </Stack> */}
    </Stack>
  );
}

export default Header;
