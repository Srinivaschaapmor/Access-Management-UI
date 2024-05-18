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
// import Logo from "../../assets/AapmorLogo.png";

import { useNavigate } from "react-router-dom";
import UserData from "./UserData";
import EmployeeModal from "./UserModal";

import Header from "../Header";
function Dashboard() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    employeeId: "",
    contactNumber: "",
    email: "",
    jobTitle: "",
    employerType: "",
    department: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to backend
    console.log(userData);
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
    <Box p={5} pt={1} sx={{ bgcolor: "rgb(232, 235, 250)" }}>
      <Header handleModalOpen={handleModalOpen} />
      <Typography variant="h5" fontWeight={700} textAlign={"center"}>
        User Access Mangaement
      </Typography>
      <Box sx={{ mt: 2 }}>
        <UserData
          handleModalOpen={handleModalOpen}
          userData={userData}
          setUserData={setUserData}
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
  );
}

export default Dashboard;
