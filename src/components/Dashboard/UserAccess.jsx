import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Divider,
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
import { useLocation } from "react-router-dom";
import { rows } from "./UserData";
import { CheckBox } from "@mui/icons-material";

function UserAccess({ open, onClose, selectedRow }) {
  const path = useLocation();
  const pathName = path.pathname;
  const id = pathName.slice(pathName.lastIndexOf("/") + 1);
  const filteredData = rows.filter((e) => e.EmpId === id);
  const [areas, setAreas] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const data = ["Ground Floor", "First Floor", "Second Floor", "Third Floor"];
  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    if (selectedRow?.Access) {
      setAreas(selectedRow.Access);
    }
  }, [selectedRow]);

  useEffect(() => {
    const filteredOptions = data.filter((option) => !areas.includes(option));
    setFilteredOptions(filteredOptions);
  }, [areas]);

  const handleCheckboxChange = (event, value) => {
    setSelectedAreas(value);
  };

  const handleAddAreas = () => {
    setAreas((prevAreas) => [...prevAreas, ...selectedAreas]);
    setSelectedAreas([]);
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
          {/* <Divider sx={{ py: 2 }}></Divider> */}
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
                    <Checkbox
                      // icon={<CheckBox />}
                      // checkedIcon={<CheckBox checked />}
                      style={{ marginRight: 8 }}
                      // checked={selected}
                    />
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
                <Button variant="contained" onClick={handleAddAreas}>
                  Add Areas
                </Button>
              </Stack>
            </Box>
          )}
          <Box sx={{ px: 3 }}>
            <Table
              sx={{
                mt: 1,
                boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
                // border: "1px solid grey",
                borderRadius: 2,
                ".css-xn32gr-MuiTableCell-root": { textAlign: "center" },
                ".css-1ex1afd-MuiTableCell-root": { textAlign: "center" },
                ".css-k2imy0-MuiSvgIcon-root": { margin: "auto" },
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
