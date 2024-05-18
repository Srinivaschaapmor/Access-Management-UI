import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import EditIcon from "@mui/icons-material/Edit";
import { makeStyles } from "@mui/styles";
import UserAccess from "./UserAccess";
import { useNavigate } from "react-router-dom";
export const rows = [
  {
    id: 1,
    EmpId: "1001",
    FirstName: "John",
    LastName: "Doe",
    Contact: "+1234567890",
    Email: "john.doe@example.com",
    SpaceName: "Marketing",
    EmployeeType: "Full-Time",
    Access: ["Ground Floor", "First Floor"],
  },
  {
    id: 2,
    EmpId: "1002",
    FirstName: "Jane",
    LastName: "Smith",
    Contact: "+1987654321",
    Email: "jane.smith@example.com",
    SpaceName: "Human Resources",
    EmployeeType: "Part-Time",
    Access: ["Ground Floor", "First Floor", "Second Floor", "Third Floor"],
  },
  {
    id: 3,
    EmpId: "1003",
    FirstName: "Michael",
    LastName: "Johnson",
    Contact: "+1122334455",
    Email: "michael.johnson@example.com",
    SpaceName: "Finance",
    EmployeeType: "Contractor",
    Access: ["Second Floor", "Third Floor"],
  },
  {
    id: 4,
    EmpId: "1004",
    FirstName: "Emily",
    LastName: "Brown",
    Contact: "+1443322111",
    Email: "emily.brown@example.com",
    SpaceName: "IT",
    EmployeeType: "Full-Time",
    Access: [],
  },
  {
    id: 5,
    EmpId: "1005",
    FirstName: "David",
    LastName: "Wilson",
    Contact: "+1777888999",
    Email: "david.wilson@example.com",
    SpaceName: "Operations",
    EmployeeType: "Intern",
    Access: [],
  },
  {
    id: 6,
    EmpId: "1005",
    FirstName: "David",
    LastName: "Wilson",
    Contact: "+1777888999",
    Email: "david.wilson@example.com",
    SpaceName: "Operations",
    EmployeeType: "Intern",
    Access: [],
  },
  {
    id: 7,
    EmpId: "1005",
    FirstName: "David",
    LastName: "Wilson",
    Contact: "+1777888999",
    Email: "david.wilson@example.com",
    SpaceName: "Operations",
    EmployeeType: "Intern",
    Access: [],
  },
];
function UserData({ handleModalOpen, userData, setUserData }) {
  const [deleteModalopen, setDeleteModalOpen] = useState(false);

  const handleClickOpen = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = () => {
    // Add your delete logic here
    console.log("User deleted");
    setOpen(false);
  };
  const navigate = useNavigate();
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleRowClick = (rowData) => {
    const filteredData = rows.find((i) => i.id === rowData.id);

    setSelectedRow(filteredData);
    setOpenDrawer(true);
  };

  const columns = [
    {
      field: "EmpId",
      headerName: "Employee ID",

      width: 110,
    },
    {
      field: "FirstName",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "LastName",
      headerName: "Last Name",
      width: 150,
    },
    {
      field: "Contact",
      headerName: "Mobile Number",
      width: 150,
    },
    {
      field: "Email",
      headerName: "Email",
      type: "Email",
      width: 250,
    },
    {
      field: "access",
      headerName: "Access",
      width: 150,
      renderCell: (params) => {
        // Check if params.row contains the correct data

        return (
          <Stack direction={"row"} alignItems={"center"}>
            <Button
              // toggleDrawer(true);
              // onClick={() => {
              //   // handleOpen();
              //   setSelectedRow(params.row);
              //   navigate(`/user-access-settings/${params.row.EmpId}`);
              // }}
              onClick={() => handleRowClick(params.row)}
              // handleRowClick(params.row);
              // navigate(`/user-access-settings/${params.row.id}`);

              sx={{
                ":hover": { backgroundColor: "none" },
                fontSize: 12,
                mt: 1,
                textTransform: "capitalize",
              }}
            >
              View Access
            </Button>
            <ArrowOutwardIcon
              sx={{ fontSize: 14, color: "rgb(38, 126, 212)" }}
            />
          </Stack>
        );
      },
    },

    {
      field: "Actions",
      headerName: "Actions",

      width: 130,
      renderCell: (params) => (
        <Box>
          <Stack
            direction={"row"}
            // gap={1}
            // alignItems={"center"}
            // justifyContent={"center"}
            mt={1}
            gap={1}
          >
            {/* <IconButton
              aria-label="edit"
              size="small"
              onClick={handleModalOpen}
            >
              <VisibilityOutlinedIcon sx={{ fontSize: "19px" }} />
            </IconButton> */}
            <IconButton
              aria-label="edit"
              size="small"
              onClick={() => {
                setUserData(params.row); // Set user data
                handleModalOpen(); // Open the modal
              }}
            >
              <EditIcon sx={{ fontSize: "19px" }} />
            </IconButton>
            <IconButton onClick={handleClickOpen}>
              <DeleteOutlineOutlinedIcon
                sx={{
                  fontSize: "19px",
                  mt: 0.5,

                  // color: "red",
                  color: "grey",
                  cursor: "pointer",
                }}
              />
            </IconButton>
          </Stack>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "93%",
        margin: "auto",
        backgroundColor: "white",
        p: 4,
        borderRadius: 3,
        pt: 2,
      }}
    >
      <Button
        variant="contained"
        sx={{
          fontSize: 12,
          float: "right",
          backgroundColor: "rgb(5, 111, 224)",
          mb: 2,
        }}
        onClick={handleModalOpen}
      >
        Add User
      </Button>
      <DataGrid
        sx={{
          width: "100%",
          margin: "auto",
          border: "1px solid rgb(227, 227, 227)",
          ".css-t89xny-MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
          },
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        // checkboxSelection
        disableRowSelectionOnClick
      />
      <UserAccess
        // toggleDrawer={toggleDrawer}
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        selectedRow={selectedRow}
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
  );
}

export default UserData;
