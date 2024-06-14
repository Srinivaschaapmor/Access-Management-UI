import { Height } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Modal,
  Stack,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import React from "react";
import { Close } from "@mui/icons-material";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

function ViewUser({ open, handleClose, currentRow }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          sx={{ position: "absolute", top: 5, right: 1 }}
          onClick={handleClose}
        >
          <Close sx={{ fontSize: 25 }} />
        </IconButton>
        <Typography variant="h6" component="h2" gutterBottom align="center">
          Employee Details
        </Typography>
        <Divider />
        <Grid container spacing={3} mt={2}>
          <Grid item xs={6}>
            <Stack alignItems="flex-start">
              <Typography color="textSecondary">First Name</Typography>
              <Typography fontWeight={600}>{currentRow?.FirstName}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack alignItems="flex-start">
              <Typography color="textSecondary">Last Name</Typography>
              <Typography fontWeight={600}>{currentRow?.LastName}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack alignItems="flex-start">
              <Typography color="textSecondary">Employee ID</Typography>
              <Typography fontWeight={600}>{currentRow?.EmpId}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack alignItems="flex-start">
              <Typography color="textSecondary">Contact Number</Typography>
              <Typography fontWeight={600}>{currentRow?.Contact}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack alignItems="flex-start">
              <Typography color="textSecondary">Email</Typography>
              <Typography fontWeight={600}>{currentRow?.Email}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack alignItems="flex-start">
              <Typography color="textSecondary">Job Title</Typography>
              <Typography fontWeight={600}>{currentRow?.JobTitle}</Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack alignItems="flex-start">
              <Typography color="textSecondary">Employer Type</Typography>
              <Typography fontWeight={600}>
                {currentRow?.EmployeeType}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={6}>
            <Stack alignItems="flex-start">
              <Typography color="textSecondary">Department</Typography>
              <Typography fontWeight={600}>{currentRow?.SpaceName}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default ViewUser;
