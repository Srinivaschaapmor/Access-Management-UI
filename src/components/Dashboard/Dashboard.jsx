import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
// import Logo from "../../assets/AapmorLogo.png";

import { useNavigate } from "react-router-dom";
import UserData from "./UserData";
import EmployeeModal from "./UserModal";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import Header from "../Header";
import { useLocation } from "react-router-dom/dist";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
function Dashboard() {
  const location = useLocation();
  const [department, setDepartment] = React.useState("");
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const data = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];
  const [filteredOptions, setFilteredOptions] = useState([]);

  const [userData, setUserData] = useState({
    FirstName: "",
    LastName: "",
    EmpId: "",
    Contact: "",
    Email: "",
    JobTitle: "",
    EmployeeType: "",
    SpaceName: "",
    Access: selectedAreas,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (userData.Id) {
        // Editing an existing user
        const response = await axios.put(
          `http://127.0.0.1:5000//users/update/${userData.EmpId}`,
          userData
        );
        // console.log("User Updated:", response.data);
        toast.success("User Details Updated Succesfully");
      } else {
        // Adding a new user
        const response = await axios.post(
          "http://127.0.0.1:5000/create_user",
          userData
        );
        // console.log("User Created:", response.data);
        toast.success("User Details Created Succesfully");
      }
      // After successful update or creation, you might want to perform additional actions like closing the modal
      handleModalClose();
    } catch (error) {
      // console.error("Error:", error);
      toast.error(error);
      // Handle error, if needed
    }
  };

  const navigate = useNavigate();
  const [modalOpen, setModelOpen] = useState(false);
  const handleModalOpen = () => setModelOpen(true);
  const handleModalClose = () => {
    setUserData({
      FirstName: "",
      LastName: "",
      EmpId: "",
      Contact: "",
      Email: "",
      JobTitle: "",
      EmployeeType: "",
      SpaceName: "",
    });

    setModelOpen(false);
  };

  return (
    <Grid container sx={{ bgcolor: "rgb(244, 246, 248)", minHeight: "100vh" }}>
      <Grid item xs={2}>
        {" "}
        <Header handleModalOpen={handleModalOpen} />
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
          <Stack
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
            <AccountBoxOutlinedIcon
              sx={{
                color: location?.pathname?.includes("/access-management")
                  ? "rgb(0, 167, 111)"
                  : "rgb(116, 130, 143)",
              }}
            />
            <Button
              sx={{ textTransform: "capitalize", color: "rgb(0, 167, 111)" }}
            >
              Access Management
            </Button>
          </Stack>
        </Box>
      </Grid>
      <Grid item xs={0.5}>
        <Divider
          orientation="vertical"
          sx={{ borderStyle: "dashed" }}
        ></Divider>
      </Grid>
      <Grid item xs={9}>
        {" "}
        <Box p={5} pt={1}>
          <Box sx={{ mt: 2 }}>
            <UserData
              handleModalOpen={handleModalOpen}
              userData={userData}
              setUserData={setUserData}
              areas={areas}
              setAreas={setAreas}
              selectedAreas={selectedAreas}
              setSelectedAreas={setSelectedAreas}
              data={data}
              filteredOptions={filteredOptions}
              setFilteredOptions={setFilteredOptions}
            />
          </Box>
          <EmployeeModal
            modalOpen={modalOpen}
            handleModalClose={handleModalClose}
            handleModalOpen={handleModalOpen}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            userData={userData}
          />
        </Box>
      </Grid>
      <ToastContainer />
    </Grid>
  );
}

export default Dashboard;
