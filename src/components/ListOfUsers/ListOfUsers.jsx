import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MainHeader from "../MainHeader";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EmployeeModal from "../AccessManagement/UserModal";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid } from "@mui/x-data-grid";
import AddAccess from "./AddAccess";
import Cookies from "js-cookie";
import {
  DeleteUser,
  createUser,
  getUsers,
  updateUser,
} from "../../apiCalls/Apicalls";

function ListOfUsers() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [selectedareas, setSelectedareas] = useState([]);
  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  const open = Boolean(anchorEl);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  function fetchUsers() {
    axios
      .get(`${getUsers}`)
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

  useEffect(() => {
    // Fetch data from the API
    fetchUsers();
  }, []);

  const [modalOpen, setModelOpen] = useState(false);
  const handleModalOpen = () => setModelOpen(true);
  const [selectedAreas, setSelectedAreas] = useState([]);
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
          `${updateUser}/${userData.EmpId}`,
          userData
        );
        // console.log("User Updated:", response.data);
        toast.success("User Details Updated Succesfully");
        fetchUsers();
      } else {
        // Adding a new user
        let config = {
          headers: {
            Authorization: Cookies.get("jwtToken"),
            "Content-Type": "application/json",
          },
        };

        const response = await axios.post(
          `${createUser}`,
          userData,
          // { withCredentials: true },
          config
        );
        // console.log("User Created:", response.data);
        toast.success("User Details Created Succesfully");
        fetchUsers();
      }
      // After successful update or creation, you might want to perform additional actions like closing the modal
      handleModalClose();
    } catch (error) {
      // console.error("Error:", error);
      toast.error(error);
      // Handle error, if needed
    }
  };

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

  const [deleteModalopen, setDeleteModalOpen] = useState(false);
  const handleClickOpen = (row) => {
    setDeleteModalOpen(true); // Open the delete modal
    setDeleteUser(row);
  };
  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };
  console.log("currentRow", deleteUser);
  const handleDelete = async () => {
    try {
      const empid = deleteUser?._id;
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

      const response = await axios.delete(`${DeleteUser}/${empid}`, config);

      toast.success("Access Updated Successfully");
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error updating access areas");
    }
  };
  const columns = [
    { field: "EmpId", headerName: "Emp ID", width: 180 },
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
      field: "Actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <Box>
          <Stack direction={"row"} mt={2} gap={1}>
            <IconButton aria-label="view" size="small">
              <VisibilityOutlinedIcon sx={{ fontSize: "19px" }} />
            </IconButton>

            <IconButton
              onClick={(event) => handlePopoverOpen(event, params.row)}
              sx={{ width: "32px" }}
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            // disableRestoreFocus

            sx={{
              "& .MuiPaper-root": {
                boxShadow: "none",
              },
            }}
          >
            <Stack
              sx={{
                p: 1,
                // bgcolor: "rgb(227, 227, 227)",s

                border: "1px solid rgb(194, 194, 194)",
                borderRadius: 4,
                pr: 2,
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "grey.200",
                  },
                }}
                onClick={() => {
                  setUserData(currentRow); // Set user data
                  setOpenDrawer(true); // Open the modal
                  handlePopoverClose(); // Close the popover
                }}
              >
                <IconButton aria-label="add" size="small">
                  <AddIcon sx={{ fontSize: "19px" }} />
                </IconButton>
                <Typography ml={1} fontSize={13} px={1}>
                  Add Access
                </Typography>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "grey.200",
                  },
                }}
                onClick={() => {
                  setUserData(currentRow); // Set user data
                  handleModalOpen(); // Open the modal
                  handlePopoverClose(); // Close the popover
                }}
              >
                <IconButton aria-label="edit" size="small">
                  <EditIcon sx={{ fontSize: "19px" }} />
                </IconButton>
                <Typography ml={1} fontSize={13} px={1}>
                  Edit User
                </Typography>
              </Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                sx={{
                  cursor: "pointer",
                  color: "red",
                  "&:hover": {
                    bgcolor: "grey.200",
                  },
                }}
                onClick={() => {
                  handleClickOpen(params.row);
                  handlePopoverClose();
                }}
              >
                <IconButton>
                  <DeleteOutlineIcon
                    sx={{ fontSize: "19px", pl: 0, color: "red" }}
                  />
                </IconButton>
                <Typography fontSize={13} px={1}>
                  Delete User
                </Typography>
              </Stack>
            </Stack>
          </Popover>
        </Box>
      ),
      // console.log(params.row, "params.row"),
    },
  ];

  console.log("userData", userData);
  return (
    <Box p={5} pt={3}>
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
              List Of Users
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
            Add User
          </Button>
        </Stack>
      </Box>
      <Box pl={2}>
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
      <AddAccess
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        filteredOptions={filteredOptions}
        setFilteredOptions={setFilteredOptions}
        userData={userData}
        selectedareas={selectedareas}
        setSelectedareas={setSelectedareas}
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
      <ToastContainer />
    </Box>
  );
}

export default ListOfUsers;
