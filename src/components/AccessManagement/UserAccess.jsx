import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Autocomplete,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { CheckBox } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { editAccess } from "../../apiCalls/Apicalls";

function UserAccess({
  open,
  onClose,
  selectedRow,
  areas,
  setAreas,
  selectedAreas,
  setSelectedAreas,
  data,
  filteredOptions,
  setFilteredOptions,
  fetchEndUsersWithAccess,
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
    if (selectedRow?.Access) {
      setAreas(selectedRow.Access);
    }
  }, [selectedRow]);

  useEffect(() => {
    const filteredOptions = accessData.filter(
      (option) => !areas.includes(option)
    );
    setFilteredOptions(filteredOptions);
  }, [areas]);

  const handleCheckboxChange = (event, value) => {
    setSelectedAreas(value);
  };

  const handleAddAreas = async () => {
    try {
      // Make sure to replace 'empid' with the actual EmpId of the user
      const empid = selectedRow?.EmpId; // Assuming userData contains EmpId of the user
      if (!empid) {
        console.error("EmpId is missing.");
        return;
      }
      // console.log("COOKIE: ", Cookies.get("jwtToken"));
      let config = {
        headers: {
          Authorization: Cookies.get("jwtToken"),
          "Content-Type": "application/json",
        },
      };

      const response = await axios.put(
        `${editAccess}/${empid}`,
        { Access: selectedAreas },
        config
      );
      // refresh table rows
      fetchEndUsersWithAccess();
      toast.success("Access Updated Succesfully");
    } catch (error) {
      toast.error("Error updating access areas");
      // Handle error, if needed
    }
  };

  const handleDeleteArea = (area) => {
    setAreas((prevAreas) => prevAreas.filter((a) => a !== area));
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box width={500} height={"100vh"}>
        <Stack
          direction={"row"}
          alignContent={"center"}
          gap={1}
          pt={4}
          pl={3}
          pr={5}
        >
          <IconButton onClick={onClose}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <Typography
            variant="h6"
            mt={0.5}
            ml={10}
            sx={{ fontWeight: "600" }}
            textAlign={"center"}
          >
            User Access Settings
          </Typography>
        </Stack>

        <Box>
          <Grid container mt={3} mb={3}>
            <Grid item xs={4}>
              <Stack>
                <Typography textAlign={"center"} color={"grey"}>
                  Employee ID
                </Typography>
                <Typography textAlign={"center"} fontWeight={600}>
                  {selectedRow?.EmpId}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack>
                <Typography textAlign={"center"} color={"grey"}>
                  First Name
                </Typography>
                <Typography textAlign={"center"} fontWeight={600}>
                  {selectedRow?.FirstName}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={4}>
              <Stack>
                <Typography textAlign={"center"} color={"grey"}>
                  Last Name
                </Typography>
                <Typography textAlign={"center"} fontWeight={600}>
                  {selectedRow?.LastName}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          {filteredOptions.length === 0 ? null : (
            <Box px={3} py={2}>
              <Autocomplete
                multiple
                options={filteredOptions}
                value={selectedAreas}
                onChange={handleCheckboxChange}
                disableCloseOnSelect
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox style={{ marginRight: 8 }} />
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
                    bgcolor: "rgb(207, 237, 231)",
                    color: "rgb(67, 167, 111)",
                  }}
                >
                  Add Areas
                </Button>
              </Stack>
            </Box>
          )}
          <Box sx={{ px: 3, maxHeight: 400, overflowY: "auto" }}>
            <Table
              sx={{
                mt: 1,
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                borderRadius: 2,
                ".css-xn32gr-MuiTableCell-root": { textAlign: "center" },
                ".css-1ex1afd-MuiTableCell-root": { textAlign: "center" },
                ".css-k2imy0-MuiSvgIcon-root": { margin: "auto" },
                maxHeight: 20,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Area</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {areas?.length > 0 ? (
                  areas?.map((area, index) => (
                    <TableRow key={index}>
                      <TableCell>{area}</TableCell>
                      <TableCell>
                        <Stack direction={"row"} alignItems={"center"} gap={1}>
                          <DeleteOutlineOutlinedIcon
                            sx={{
                              fontSize: "19px",
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => handleDeleteArea(area)}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}

export default UserAccess;
