import { Height } from "@mui/icons-material";
import {
  Box,
  Button,
  FormLabel,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: 510,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};
function EmployeeModal({
  modalOpen,
  handleModalClose,
  handleChange,
  handleSubmit,
  userData,
}) {
  return (
    <Modal
      open={modalOpen}
      onClose={handleModalClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography variant="h5" fontWeight={600} textAlign={"center"}>
          User Details
        </Typography>
        <form
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: "30px" }}
        >
          <Grid container spacing={2}>
            {/* First Name */}
            <Grid item xs={3}>
              <FormLabel
                required
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "#cd4949",
                  },
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                First Name
              </FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="FirstName"
                value={userData.FirstName}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    fontSize: "14px",
                  },
                  placeholder: "Enter first name",
                }}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={3}>
              <FormLabel
                required
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "#cd4949",
                  },
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Last Name
              </FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="LastName"
                value={userData.LastName}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    fontSize: "14px",
                  },
                  placeholder: "Enter last name",
                }}
              />
            </Grid>

            {/* Employee ID */}
            <Grid item xs={3}>
              <FormLabel
                required
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "#cd4949",
                  },
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Employee ID
              </FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="EmpId"
                value={userData.EmpId}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    fontSize: "14px",
                  },
                  placeholder: "Enter employee ID",
                }}
              />
            </Grid>

            {/* Contact Number */}
            <Grid item xs={3}>
              <FormLabel
                required
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "#cd4949",
                  },
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Contact Number
              </FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="Contact"
                value={userData.Contact}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    fontSize: "14px",
                  },
                  placeholder: "Enter contact number",
                }}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={3}>
              <FormLabel
                required
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "#cd4949",
                  },
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Email
              </FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="Email"
                value={userData.Email}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    fontSize: "14px",
                  },
                  placeholder: "Enter email",
                }}
              />
            </Grid>

            {/* Job Title */}
            <Grid item xs={3}>
              <FormLabel
                required
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "#cd4949",
                  },
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Job Title
              </FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="JobTitle"
                value={userData.JobTitle}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    fontSize: "14px",
                  },
                  placeholder: "Enter job title",
                }}
              />
            </Grid>

            {/* Employer Type */}
            <Grid item xs={3}>
              <FormLabel
                required
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "#cd4949",
                  },
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Employer Type
              </FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="EmployeeType"
                value={userData.EmployeeType}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    fontSize: "14px",
                  },
                  placeholder: "Enter employer type",
                }}
              />
            </Grid>

            {/* Department */}
            <Grid item xs={3}>
              <FormLabel
                required
                sx={{
                  "& .MuiFormLabel-asterisk": {
                    color: "#cd4949",
                  },
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Department
              </FormLabel>
            </Grid>
            <Grid item xs={9}>
              <TextField
                name="SpaceName"
                value={userData.SpaceName}
                onChange={handleChange}
                size="small"
                fullWidth
                InputProps={{
                  sx: {
                    fontSize: "14px",
                  },
                  placeholder: "Enter department",
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              // variant="contained"
              color="primary"
              onClick={handleModalClose}
              sx={{ mt: 2, textAlign: "center", fontSize: 12 }}
            >
              cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2, textAlign: "center", fontSize: 12 }}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}

export default EmployeeModal;
