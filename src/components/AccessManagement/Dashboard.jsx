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

import Header from "../Header";
import { useLocation } from "react-router-dom/dist";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
function Dashboard() {
  const [selectedAreas, setSelectedAreas] = useState([]);
  const location = useLocation();
  const [department, setDepartment] = React.useState("");
  const [areas, setAreas] = useState([]);

  const data = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];
  const [filteredOptions, setFilteredOptions] = useState([]);

  const navigate = useNavigate();

  return (
    <>
      <Box p={5} pt={1}>
        <Box sx={{ mt: 2 }}>
          <UserData
            // handleModalOpen={handleModalOpen}
            // userData={userData}
            // setUserData={setUserData}
            areas={areas}
            setAreas={setAreas}
            selectedAreas={selectedAreas}
            setSelectedAreas={setSelectedAreas}
            data={data}
            filteredOptions={filteredOptions}
            setFilteredOptions={setFilteredOptions}
          />
        </Box>
      </Box>

      <ToastContainer />
    </>
  );
}

export default Dashboard;
