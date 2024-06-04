import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Popper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserAccess from "./UserAccess";
import { FaRegTrashCan } from "react-icons/fa6";
import MainHeader from "../MainHeader";
import { getUsers, getUsersWithAccess } from "../../apiCalls/Apicalls";
function UserData({
  handleModalOpen,
  userData,
  setUserData,
  areas,
  setAreas,
  selectedAreas,
  setSelectedAreas,
  data,
  filteredOptions,
  setFilteredOptions,
}) {
  const [deleteModalopen, setDeleteModalOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedSpaceName, setSelectedSpaceName] = useState("All");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  function fetchEndUsersWithAccess() {
    axios
      .get(`${getUsersWithAccess}`)
      .then((response) => {
        const dataWithId = response.data.map((item, index) => ({
          ...item,
          id: item?.EmpId, // assuming EmpId is unique for each user
        }));
        setRows(dataWithId);
        setFilteredRows(dataWithId); // Initially display all rows
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }

  // TODO: FETCH USER AREAS

  useEffect(() => {
    // Fetch data from the API
    fetchEndUsersWithAccess();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedSpaceName(newValue);
    if (newValue === "All") {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((row) => row.SpaceName === newValue);
      setFilteredRows(filtered);
    }
  };

  const handleRowClick = (rowData) => {
    const filteredData = rows.find((i) => i.id === rowData.id);
    setSelectedRow(filteredData);
    setOpenDrawer(true);
  };

  const handleClickOpen = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    // Add your delete logic here

    setDeleteModalOpen(false);
  };

  const columns = [
    { field: "EmpId", headerName: "Emp ID", width: 150 },
    {
      field: "FullName",
      headerName: "Full Name",
      width: 250,
      renderCell: (params) => {
        const { LastName, FirstName, Email } = params.row;
        return (
          <Box mt={2}>
            <Typography color={"rgb(33, 43, 54)"}>
              {FirstName} {LastName}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "rgb(163, 174, 185)" }}>
              {Email}
            </Typography>
          </Box>
        );
      },
    },
    { field: "Contact", headerName: "Mobile Number", width: 200 },
    {
      field: "access",
      headerName: "Access",
      width: 200,
      renderCell: (params) => (
        <Stack direction={"row"} alignItems={"center"} mt={2} mr={10} gap={1}>
          <Button
            onClick={() => handleRowClick(params.row)}
            sx={{
              ":hover": { backgroundColor: "none" },
              fontSize: 12,
              mt: 1,
              textTransform: "capitalize",
              color: "rgb(135, 79, 224)",
            }}
          >
            View Access
          </Button>
          <ArrowOutwardIcon sx={{ fontSize: 14, color: "rgb(135, 79, 224)" }} />
        </Stack>
      ),
    },
    // {
    //   field: "Actions",
    //   headerName: "Actions",
    //   width: 130,
    //   renderCell: (params) => (
    //     <Box>
    //       <Stack direction={"row"} mt={2} gap={1}>
    //         <IconButton
    //           aria-label="edit"
    //           size="small"
    //           onClick={() => {
    //             setUserData(params.row); // Set user data
    //             handleModalOpen(); // Open the modal
    //           }}
    //         >
    //           <EditIcon sx={{ fontSize: "19px" }} />
    //         </IconButton>
    //         <IconButton onClick={handleClickOpen} sx={{ width: "32px" }}>
    //           <FaRegTrashCan
    //             sx={{
    //               fontSize: "15px",
    //               mt: 0.5,
    //               color: "grey",
    //               cursor: "pointer",
    //               width: "31px  ",
    //             }}
    //           />
    //         </IconButton>
    //       </Stack>
    //     </Box>
    //   ),
    // },
  ];

  const spaceNames = ["All", ...new Set(rows?.map((row) => row?.SpaceName))];

  return (
    <Box>
      <MainHeader />
      <Box
        sx={{
          width: "100%",
          margin: "auto",
          p: 4,
          borderRadius: 3,
          mt: 1,
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              User Access Management
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              ":hover": { bgcolor: "rgb(69, 79, 91)" },
              fontSize: 12,
              backgroundColor: "rgb(30, 34, 40)",
              mb: 5,
              boxShadow: 0,
            }}
            onClick={handleModalOpen}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Access
          </Button>
        </Stack>
        <Box height={50} bgcolor={"white"} pl={2} mt={3}>
          <Tabs
            value={selectedSpaceName}
            onChange={handleTabChange}
            aria-label="simple tabs example"
            sx={{
              minHeight: 50,
              height: 50,
              ".css-1aquho2-MuiTabs-indicator": { bgcolor: "rgb(30, 34, 40)" },
              ".css-1p9i4sw-MuiButtonBase-root-MuiTab-root.Mui-selected ": {
                color: "black",
              },
            }}
          >
            {spaceNames?.map((space) => (
              <Tab
                key={space}
                value={space}
                sx={{
                  textTransform: "capitalize",
                }}
                label={space}
              />
            ))}
          </Tabs>
        </Box>
        <DataGrid
          rowHeight={80}
          getRowId={(row) => row.EmpId}
          sx={{
            width: "100%",
            margin: "auto",
            bgcolor: "white",
            p: 2,
            borderRadius: "0px 2px 2px 2px",
            boxShadow: "0 2px 2px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgb(227, 227, 227)",
            ".css-t89xny-MuiDataGrid-columnHeaderTitle": { fontWeight: 700 },
          }}
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 5 },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          // checkboxSelection
        />
        <UserAccess
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          selectedRow={selectedRow}
          areas={areas}
          setAreas={setAreas}
          selectedAreas={selectedAreas}
          setSelectedAreas={setSelectedAreas}
          data={data}
          filteredOptions={filteredOptions}
          setFilteredOptions={setFilteredOptions}
          fetchEndUsersWithAccess={fetchEndUsersWithAccess}
        />
        <Dialog open={deleteModalopen} onClose={handleDeleteClose}>
          <DialogTitle>{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default UserData;
