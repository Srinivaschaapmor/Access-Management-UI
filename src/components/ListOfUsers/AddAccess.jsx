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
  Chip,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  deleteAllAccess,
  editAccess,
  fetchMasterData,
} from "../../apiCalls/Apicalls";

import Done from "../../assets/done.png";
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
  fetchUsers,
}) {
  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const category = "Orgx";
  useEffect(() => {
    const fetchData = async () => {
      try {
        let config = {
          headers: {
            Authorization: Cookies.get("jwtToken"),
            "Content-Type": "application/json",
          },
        };
        const response = await axios.get(
          `${fetchMasterData}${category}`,
          config
        );
        setAccessData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log({ accessData });
  useEffect(() => {
    const filteredOptions = accessData?.filter(
      (option) => !userData?.Access?.includes(option)
    );
    setFilteredOptions(filteredOptions);
  }, [userData?.Access]);

  console.log(userData?.Access?.length);
  const handleCheckboxChange = (event, value) => {
    setSelectedareas(value);
  };

  const handleAddAreas = async () => {
    if (selectedareas?.length === 0) {
      toast.error("Please select at least one area.");
      return;
    }

    try {
      const empid = userData?._id;
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
      // const response = await axios.delete(
      //   `${deleteAllAccess}/${empid}`,
      //   // { Access: selectedareas },
      //   config
      // );

      fetchUsers();
      toast.success("Access Updated Successfully");
      onClose(); // Close the modal upon success
      setSelectedareas([]);
    } catch (error) {
      toast.error("Error updating access areas");
    }
  };

  const handleSelectAll = () => {
    setSelectedareas(filteredOptions);
  };

  console.log({ userData });
  console.log({ selectedareas });
  console.log({ accessData });

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 500, // Increased height
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

        {userData?.Access?.length === accessData?.length ? (
          <Stack justifyContent={"center"} alignItems={"center"} mt={10}>
            <img src={Done} style={{ height: "100px", width: "100px" }}></img>
            <Typography fontWeight={600} mt={1}>
              All Access Assigned
            </Typography>
          </Stack>
        ) : (
          <>
            {filteredOptions?.length > 0 && (
              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {" "}
                {/* Added maxHeight and overflow */}
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
                      multiline
                      maxRows={4}
                      minRows={4}
                      size="small"
                      // style={{ maxHeight: 150, overflowY: "auto" }}
                    />
                  )}
                  ChipProps={{ size: "small" }} // Set size of the chips to small
                  renderTags={(value, getTagProps) => [
                    ...value.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        {...getTagProps({ index })}
                      />
                    )),
                  ]}
                />
              </Box>
            )}

            <Stack direction={"row"} justifyContent={"space-between"} mt={2}>
              <Button variant="outlined" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button
                variant="contained"
                disabled={selectedareas?.length === 0}
                onClick={handleAddAreas}
                sx={{
                  bgcolor: "black",
                  color: "white",
                }}
              >
                Add Areas
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default AddAccess;
