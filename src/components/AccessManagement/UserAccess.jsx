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
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import {
  deleteAllAccess,
  deleteUserAccess,
  editAccess,
  fetchLabelsMasterData,
  fetchMasterData,
} from "../../apiCalls/Apicalls";

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
  const [accessData, setAccessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const category = "Orgx";

  const fetchData = async () => {
    try {
      let config = {
        headers: {
          Authorization: Cookies.get("jwtToken"),
          "Content-Type": "application/json",
        },
      };
      const response = await axios.get(
        `${fetchLabelsMasterData}${category}`,
        config
      );
      setAccessData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filteredOptions = accessData?.filter(
      (option) => !areas?.includes(option)
    );
    setFilteredOptions(filteredOptions);
  }, [areas]);

  useEffect(() => {
    if (selectedRow?.Access) {
      setAreas(selectedRow.Access);
    }
  }, [selectedRow]);
  const handleCheckboxChange = (event, value) => {
    setSelectedAreas(value);
  };

  const empid = selectedRow?._id;

  const handleAddAreas = async () => {
    try {
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
        { Access: selectedAreas },
        config
      );

      fetchEndUsersWithAccess();
      toast.success("Access Updated Succesfully");
      onClose();
      setSelectedAreas([]);
    } catch (error) {
      toast.error("Error updating access areas");
    }
  };

  const handleDeleteArea = async (area) => {
    try {
      setAreas((prevAreas) => prevAreas?.filter((a) => a !== area));
      const config = {
        headers: {
          Authorization: Cookies.get("jwtToken"),
          "Content-Type": "application/json",
        },
      };

      const response = await axios.delete(
        `${deleteUserAccess}/${selectedRow._id}/${area}`,
        config
      );
      if (response.status === 200) {
        toast.success("Access Deleted Succesfully");
      }
    } catch (error) {
      console.error("Error deleting area:", error);
      toast.error("Failed to delete access");
    }
  };

  const handleDeleteAllAccess = async () => {
    try {
      const config = {
        headers: {
          Authorization: Cookies.get("jwtToken"),
          "Content-Type": "application/json",
        },
        data: {
          Access: [],
          SpaceName: "", // include any necessary properties if required
        },
      };

      const response = await axios.delete(
        `${deleteAllAccess}/${empid}`,
        config
      );

      if (response.status === 200) {
        toast.success("All Access Deleted Successfully");
        onClose();
        fetchEndUsersWithAccess();
      }
    } catch (error) {
      console.error("Error deleting access:", error);
      toast.error("Failed to delete access");
    }
  };

  console.log({ filteredOptions });
  console.log({ selectedAreas });
  console.log({ areas });

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box width={500} height={"100vh"}>
        <Stack
          direction={"row"}
          alignContent={"center"}
          justifyContent={"space-between"}
          pt={4}
          px={2}
        >
          <IconButton onClick={onClose}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <Typography
            variant="h6"
            mt={0.5}
            ml={6}
            sx={{ fontWeight: "600" }}
            textAlign={"center"}
          >
            User Access Settings
          </Typography>
          <Button
            onClick={handleDeleteAllAccess}
            sx={{
              border: "1px solid",
              color: "Red",
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: 10,
            }}
          >
            Delete All Access
          </Button>
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
          {filteredOptions?.length > 0 && (
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
                    <Checkbox style={{ marginRight: 8 }} checked={selected} />
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
                  disabled={selectedAreas?.length === 0}
                  variant="contained"
                  onClick={handleAddAreas}
                  sx={{
                    bgcolor: "black",
                    color: "white",
                  }}
                >
                  Add Access
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
