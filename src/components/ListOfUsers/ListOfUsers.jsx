import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Modal,
  Popover,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import EmployeeModal from "./UserModal";
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
import ViewUser from "./ViewUser";

function ListOfUsers() {
  // State declarations
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentRow, setCurrentRow] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [selectedareas, setSelectedareas] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [modalOpen, setModelOpen] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [initialUserData, setInitialUserData] = useState({});
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
  const [deleteModalopen, setDeleteModalOpen] = useState(false);

  // Popover open/close handlers
  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCurrentRow(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setCurrentRow(null);
  };

  // Modal open/close handlers
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
    setFormErrors({});
  };

  // Fetch users from the API
  function fetchUsers() {
    axios
      .get(`${getUsers}`)
      .then((response) => {
        const dataWithId = response.data.map((item) => ({
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
    // Fetch data from the API on component mount
    fetchUsers();
  }, []);

  // Handle input changes for user form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  // Validate form inputs
  const validate = (values) => {
    const errors = {};
    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const specialCharsRegex = /[!@#$%^&*(),?":{}|<>]/; // Regex to detect special characters except dots
    const specialCharsRegexWithoutDot = /[!@#$%^&*(),.?":{}|<>]/; // Regex to detect special characters including dots
    const emojiRegex =
      /[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/u; // Regex to detect emojis
    const leadingTrailingSpacesRegex = /^\s+|\s+$/g; // Regex to detect leading and trailing spaces

    // Validate email
    if (!values.Email) {
      errors.Email = "Field is required";
    } else if (
      !emailRegex.test(values.Email) ||
      values.Email.startsWith(".") ||
      values.Email.includes("..") ||
      values.Email.startsWith("@") ||
      values.Email.endsWith(".") ||
      values.Email.includes(" ") ||
      values.Email.lastIndexOf("@") !== values.Email.indexOf("@")
    ) {
      errors.Email = "Invalid email format";
    }

    // Validate Contact Number
    if (!values.Contact) {
      errors.Contact = "* Field is required";
    } else if (!/^\d{10}$/.test(values.Contact)) {
      errors.Contact = "Contact number should contain 10 digits";
    }

    // Common validation function for text fields
    const validateTextField = (fieldName, value) => {
      if (!value) {
        errors[fieldName] = "* Field is required";
      } else if (
        (fieldName !== "JobTitle" && specialCharsRegexWithoutDot.test(value)) ||
        (fieldName === "JobTitle" && specialCharsRegex.test(value)) ||
        emojiRegex.test(value) ||
        leadingTrailingSpacesRegex.test(value)
      ) {
        errors[fieldName] =
          "Field should not contain special characters, emojis, or leading/trailing spaces";
      }
    };

    // List of text fields to validate
    const textFields = [
      "FirstName",
      "LastName",
      "EmpId",
      "Contact",
      "EmployeeType",
      "JobTitle",
      "SpaceName",
    ];

    // Validate each text field
    textFields.forEach((field) => validateTextField(field, values[field]));

    return errors;
  };

  useEffect(() => {
    if (isSubmit) {
      setFormErrors(validate(userData));
    }
  }, [formErrors, userData, isSubmit]);

  // Handle form submission for creating/updating user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const errors = validate(userData); // Perform validation
    setFormErrors(errors); // Update form errors

    if (Object.keys(errors).length === 0) {
      // Check if there are no errors
      try {
        let config = {
          headers: {
            Authorization: Cookies.get("jwtToken"),
            "Content-Type": "application/json",
          },
        };
        if (userData?._id) {
          // Editing an existing user
          const response = await axios.put(
            `${updateUser}/${userData._id}`,
            userData,
            config
          );
          if (response.status === 200) {
            toast.success("User Details Updated Successfully");
            setFormErrors({});
            setUserData({});
          }
        } else {
          // Adding a new user
          const response = await axios.post(`${createUser}`, userData, config);
          toast.success("User Details Created Successfully");
        }
        fetchUsers();
        handleModalClose();
      } catch (error) {
        if (error.response.data.error === "User already exists.") {
          toast.error("User already Exists");
        } else {
          toast.error(error);
        }
      }
    }
  };
  console.log(formErrors, "formErrors");
  // Delete modal open/close handlers
  const handleClickOpen = () => {
    setDeleteModalOpen(true); // Open the delete modal
  };
  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };

  // Handle user deletion
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
      toast.success("User deleted Successfully");
      fetchUsers();
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  //Hanalde viiew user model open
  const [open, setOpen] = useState(false);
  const handleOpen = (row) => {
    setOpen(true);
    setCurrentRow(row);
  };
  const handleClose = () => setOpen(false);
  // Define columns for DataGrid
  const columns = [
    {
      field: "EmpId",
      headerName: "Emp ID",
      width: 100,
      resizable: false,
      sortable: false,
    },
    {
      field: "FullName",
      resizable: false,
      headerName: "Full Name",
      width: 250,
      sortable: false,
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
    {
      field: "Contact",
      headerName: "Mobile Number",
      width: 150,
      resizable: false,
      disableColumnSorting: true,
      sortable: false,
    },
    {
      field: "AccessNote",
      headerName: "Access Note",
      resizable: false,
      width: 200,
      sortable: false,
      renderCell: (params) => {
        const hasAccess = params.row.Access && params.row.Access.length > 0;
        return (
          <Typography color={hasAccess ? "green" : "red"} mt={3} fontSize={13}>
            {hasAccess ? "Access Granted" : "No Access Assigned"}
          </Typography>
        );
      },
    },
    {
      field: "Actions",
      headerName: "Actions",
      resizable: false,
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Stack direction={"row"} mt={2} gap={1}>
            <IconButton
              aria-label="view"
              size="small"
              onClick={() => handleOpen(params.row)}
            >
              <Tooltip title="View Details">
                {" "}
                <VisibilityOutlinedIcon sx={{ fontSize: "19px" }} />
              </Tooltip>
            </IconButton>

            <Tooltip title="More">
              <IconButton
                onClick={(event) => handlePopoverOpen(event, params.row)}
                sx={{ width: "32px" }}
              >
                {" "}
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Popover
            open={Boolean(anchorEl)}
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
            sx={{
              "& .MuiPaper-root": {
                boxShadow: "none",
              },
            }}
          >
            <Stack
              sx={{
                p: 1,
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
                  setUserData(currentRow);
                  setInitialUserData(currentRow); // Set user data
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
                  handleClickOpen();
                  setDeleteUser(currentRow);
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
    },
  ];

  return (
    <Box p={5} pt={3}>
      <Box
        sx={{
          width: "100%",
          margin: "auto",

          borderRadius: 3,
          mt: 2,
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
      <Box>
        <DataGrid
          rowHeight={80}
          disableColumnMenu
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
        formErrors={formErrors}
        setIsSubmit={setIsSubmit}
        initialUserData={initialUserData}
      />
      <AddAccess
        open={openDrawer}
        onClose={() => {
          setOpenDrawer(false);
          setCurrentRow(null);
          setSelectedareas([]);
          setUserData({});
        }}
        filteredOptions={filteredOptions}
        setFilteredOptions={setFilteredOptions}
        userData={userData}
        selectedareas={selectedareas}
        setSelectedareas={setSelectedareas}
        fetchUsers={fetchUsers}
      />
      <Modal open={deleteModalopen} onClose={handleDeleteClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            px: 4,
            py: 5,
            maxHeight: 500,
            textAlign: "center",
          }}
        >
          <Typography
            id="modal-modal-title"
            variant="body1"
            component="paragraph"
            align={"center"}
            fontWeight={"bold"}
          >
            {`  Are you sure you want to delete this user?`}
          </Typography>
          <Stack direction={"row"} mt={3} gap={3} justifyContent={"center"}>
            <Button
              variant="outlined"
              onClick={handleDeleteClose}
              sx={{ color: "black", borderColor: "black" }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              sx={{
                bgcolor: "#FF4B4B",
                borderColor: "#FF4B4B",
                color: "white",
                ":hover": {
                  bgcolor: "white",
                  color: "#FF4B4B",
                  borderColor: "#FF4B4B",
                },
              }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
      <ViewUser
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
        currentRow={currentRow}
      />
      <ToastContainer />
    </Box>
  );
}

export default ListOfUsers;
