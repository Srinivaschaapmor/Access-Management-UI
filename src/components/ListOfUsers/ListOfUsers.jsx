import {
  Box,
  Button,
  IconButton,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import MainHeader from "../MainHeader";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EmployeeModal from "../Dashboard/UserModal";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import { FaRegTrashCan } from "react-icons/fa6";
import { DataGrid } from "@mui/x-data-grid";
import Cookies from "js-cookie";

function ListOfUsers() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handlepopperClickOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpen(false);
  };
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);

  function fetchUsers() {
    axios
      .get("http://127.0.0.1:5000/endusers")
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
          `http://127.0.0.1:5000//users/update/${userData.EmpId}`,
          userData
        );
        // console.log("User Updated:", response.data);
        toast.success("User Details Updated Succesfully");
        fetchUsers()
      } else {
        // Adding a new user
        let config = {
          headers: {
            Authorization: Cookies.get("jwtToken"),
            "Content-Type": "application/json",
          },
        };

        const response = await axios.post(
          "http://127.0.0.1:5000/create_user",
          userData,
          // { withCredentials: true },
          config
        );
        // console.log("User Created:", response.data);
        toast.success("User Details Created Succesfully");
        fetchUsers()
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
  const handleClickOpen = () => {
    setDeleteModalOpen(true);
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
    // {
    //   field: "access",
    //   headerName: "Access",
    //   width: 150,
    //   // renderCell: (params) => (
    //   //   <Stack direction={"row"} alignItems={"center"} mt={2} mr={10} gap={1}>
    //   //     <Button
    //   //       onClick={() => handleRowClick(params.row)}
    //   //       sx={{
    //   //         ":hover": { backgroundColor: "none" },
    //   //         fontSize: 12,
    //   //         mt: 1,
    //   //         textTransform: "capitalize",
    //   //         color: "rgb(135, 79, 224)",
    //   //       }}
    //   //     >
    //   //       View Access
    //   //     </Button>
    //   //     <ArrowOutwardIcon sx={{ fontSize: 14, color: "rgb(135, 79, 224)" }} />
    //   //   </Stack>
    //   // ),
    // },
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

            <IconButton onClick={handlepopperClickOpen} sx={{ width: "32px" }}>
              <MoreVertIcon />
            </IconButton>
          </Stack>

          <Popper open={open} anchorEl={anchorEl} onClose={handleClose}>
            <Box
              sx={{
                p: 1,
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "grey.500",
              }}
            >
              <IconButton
                aria-label="edit"
                size="small"
                onClick={() => {
                  setUserData(params.row); // Set user data
                  handleModalOpen(); // Open the modal
                  handleClose(); // Close the popper
                }}
              >
                <EditIcon sx={{ fontSize: "19px" }} />
              </IconButton>
              <IconButton onClick={handleClickOpen} sx={{ width: "32px" }}>
                <FaRegTrashCan
                  sx={{
                    fontSize: "15px",
                    mt: 0.5,
                    color: "grey",
                    cursor: "pointer",
                    width: "31px",
                  }}
                />
              </IconButton>
            </Box>
          </Popper>
        </Box>
      ),
    },
  ];
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
      <ToastContainer />
    </Box>
  );
}

export default ListOfUsers;
