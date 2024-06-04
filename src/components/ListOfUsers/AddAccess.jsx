import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  Typography,
  TextField,
  Autocomplete,
  Modal,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { CheckBox } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { editAccess } from "../../apiCalls/Apicalls";

function AddAccess({
  open,
  onClose,
  selectedRow,
  areas,
  setAreas,
  selectedareas,
  setSelectedareas,
  userData,
  filteredOptions,
  setFilteredOptions,
}) {
  const accessData = [
    "Recent_Openings_View",
    "Recent_Openings_JobOpenings_View",
    "Recent_Openings_JobOpenings_Write",
    "Events_View",
    "Policies_View",
    "Employees_View",
    "Recruitment_View",
    "New_Recruitment_View_And_Write",
    "New_Recruitment_Write",
    "Recruitment_Status_View_And_write",
    "Recruitment_Status_Write",
    "On_Boarding_View_And_Write",
    "On_Boarding_Write",
    "New_Job_View_And_Write",
    "New_Job_Write",
    "Interviewer_Board_View",
    "Interviewer_Board_write",
    "Blogs_View_And_Write",
    "Blogs_Write",
    "Write_FeedBack_View",
    "Write_FeedBack_View_And_Write",
    "View_FeedBack_View",
    "View_FeedBack_Write",
    "Projects_View_And_Write",
    "Projects_Write",
    "Reports_View_And_Write",
    "Reports_Write",
  ];

  useEffect(() => {
    const filteredOptions = accessData.filter(
      (option) => !userData?.Access.includes(option)
    );
    setFilteredOptions(filteredOptions);
  }, [userData?.access]);

  const handleCheckboxChange = (event, value) => {
    setSelectedareas(value);
  };

  const handleAddAreas = async () => {
    try {
      const empid = userData?.EmpId;
      if (!empid) {
        console.error("EmpId is missing.");
        return;
      }
      let config = {
        headers: {
          Authorization: Cookies.get("jwtToken"),
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put(
        `${editAccess}/${empid}`,
        { Access: selectedareas },
        config
      );

      toast.success("Access Updated Successfully");
      onClose(); // Close the modal upon success
    } catch (error) {
      toast.error("Error updating access areas");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflowY: "auto",
        }}
      >
        <Stack direction={"row"} alignItems={"center"} gap={1} pb={2}>
          <IconButton onClick={onClose}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ fontWeight: "600" }}
            textAlign={"center"}
            flex={1}
          >
            User Access Settings
          </Typography>
        </Stack>

        <Grid container spacing={2} mt={3} mb={3}>
          <Grid item xs={4}>
            <Stack>
              <Typography textAlign={"center"} color={"grey"}>
                Employee ID
              </Typography>
              <Typography textAlign={"center"} fontWeight={600}>
                {userData?.EmpId}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack>
              <Typography textAlign={"center"} color={"grey"}>
                First Name
              </Typography>
              <Typography textAlign={"center"} fontWeight={600}>
                {userData?.FirstName}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Stack>
              <Typography textAlign={"center"} color={"grey"}>
                Last Name
              </Typography>
              <Typography textAlign={"center"} fontWeight={600}>
                {userData?.LastName}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Box>
          <Autocomplete
            multiple
            options={filteredOptions}
            value={selectedareas}
            onChange={handleCheckboxChange}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox checked={selected} style={{ marginRight: 8 }} />
                {option}
              </li>
            )}
            style={{ width: "100%" }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Areas"
                size="small"
              />
            )}
          />
          <Stack direction={"row"} justifyContent={"flex-end"} mt={2}>
            <Button
              variant="contained"
              onClick={handleAddAreas}
              sx={{
                bgcolor: "rgb(27, 167, 111)",
                color: "white",
              }}
            >
              Add Areas
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddAccess;
