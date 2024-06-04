import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Popper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useState } from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
function MainHeader() {
  const navigate = useNavigate();
  const [openPopper, setOpenPopper] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenPopper((previousOpen) => !previousOpen);
  };
  const handlePopperClose = () => {
    setOpenPopper(false);
  };
  const handleLogout = () => {
    // Implement your logout logic here
    Cookies.remove("jwtToken");
    Cookies.remove("userEmail");
    navigate("/");
    console.log("Logged out");
    handlePopperClose();
  };
  const canBeOpen = openPopper && Boolean(anchorEl);
  const id = canBeOpen ? "transition-popper" : undefined;
  const userEmail = Cookies.get("userEmail");
  const username = userEmail?.split("@")[0].toUpperCase();
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };
  return (
    <Box display="flex" justifyContent="space-between" alignItems={"center"}>
      <Box>
        <IconButton onClick={toggleSearch}>
          <SearchIcon sx={{ color: "rgb(138, 138, 138)" }} />
        </IconButton>
        {showSearch && (
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            sx={{ ml: 2 }}
          />
        )}
      </Box>
      <Stack direction={"row"} gap={3} alignItems={"center"}>
        <Stack direction={"row"}>
          <Badge
            badgeContent={2}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "rgb(33, 175, 150)",
                color: "white",
              },
            }}
          >
            <NotificationsNoneOutlinedIcon color="action" />
          </Badge>
        </Stack>
        <SettingsOutlinedIcon sx={{ color: "rgb(112, 113, 114)" }} />
        <Stack direction={"row"} gap={2}>
          <Box>
            <Avatar onClick={handleClick} sx={{ cursor: "pointer" }}></Avatar>
            <Popper id={id} open={openPopper} anchorEl={anchorEl}>
              <Box>
                <Menu
                  anchorEl={anchorEl}
                  open={openPopper}
                  onClose={handlePopperClose}
                  onClick={handlePopperClose}
                  sx={{ p: 2 }}
                >
                  <MenuItem
                    sx={{
                      borderBottom: "1px solid rgb(244, 246, 248)",
                      mb: 1,
                    }}
                  >
                    <Stack direction={"row"} alignItems={"center"} gap={2}>
                      <Avatar></Avatar>
                      <Typography>{username}</Typography>
                    </Stack>
                  </MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </Popper>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
}

export default MainHeader;
