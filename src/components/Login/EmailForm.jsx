import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const EmailForm = ({ email, setEmail, formErrors, handleGetOTP, loading }) => {
  const [validEmail, setValidEmail] = useState(false);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    // Check if "@" and a domain are present in the email
    const atIndex = value.indexOf("@");
    const domainIndex = value.indexOf(".", atIndex);
    const validEmail =
      atIndex !== -1 && domainIndex !== -1 && domainIndex > atIndex + 1;

    // Update state to enable/disable the "Get OTP" button based on email validity
    setValidEmail(validEmail);
  };

  return (
    <Stack>
      <Typography variant="h6" fontWeight={600} m={"auto"}>
        AuthX AUTHENTICATION
      </Typography>
      <Typography m={"auto"} pt={5}>
        Login with your email
      </Typography>
      <TextField
        type="email"
        value={email}
        error={!!formErrors.email}
        helperText={formErrors.email || ""}
        FormHelperTextProps={{ style: { color: "red" } }}
        onChange={handleEmailChange}
        label={
          <span>
            Email<span style={{ color: "red" }}>*</span>
          </span>
        }
        placeholder="Enter your email"
        size="small"
        sx={{ width: 300, m: "auto", mt: 5 }}
        onKeyPress={(event) => {
          if (event.key === "Enter") {
            handleGetOTP();
          }
        }}
      />

      <Button
        variant="contained"
        // disabled={!validEmail || !!formErrors.email || email.length === 0}
        sx={{
          width: 300,
          m: "auto",
          mt: 5,
          bgcolor: "rgb(49, 38, 228)",
        }}
        onClick={handleGetOTP}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "GET OTP"
        )}
      </Button>
    </Stack>
  );
};

export default EmailForm;
