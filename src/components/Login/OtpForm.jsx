import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const OtpForm = ({
  email,
  otpArray,
  setOtpArray,
  otp,
  setOtp,
  formErrors,
  // handleOtpChange,
  // handlePaste,
  // handleKeyDown,
  handleSubmitOTP,
  submittingOTP,
  canResend,
  timer,
  handleResendOTP,
  setGetOtp,
  setCanResend,
}) => {
  const otpFields = useRef([]);

  const handleOtpChange = (index, event) => {
    const { value } = event.target;
    if (!isNaN(value) && value.length <= 1) {
      // Only allow numeric values and limit length to 1
      const newOtpArray = [...otpArray];
      newOtpArray[index] = value;
      setOtpArray(newOtpArray);
      setOtp(newOtpArray.join(""));

      // Check if there is a next OTP field to focus on
      if (value !== "" && index < 5 && otpFields.current[index + 1]) {
        otpFields.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && otpArray[index] === "") {
      otpFields.current[index - 1].focus();
    }
  };
  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOtpArray = pasteData.split("");
    setOtpArray(newOtpArray);
    setOtp(pasteData);
    otpFields.current.forEach((field, index) => {
      field.value = newOtpArray[index];
    });
  };
  const isAllDigitsEntered = otpArray.every((digit) => digit !== "");
  return (
    <Stack>
      <Typography variant="h6" fontWeight={600} m={"auto"}>
        GET STARTED HERE
      </Typography>
      <Typography m={"auto"} pt={5}>
        Enter the OTP
      </Typography>
      <Stack
        direction={"row"}
        gap={2}
        mt={4}
        textAlign={"center"}
        onPaste={handlePaste}
      >
        {otpArray.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => (otpFields.current[index] = el)}
            variant="outlined"
            size="small"
            sx={{ width: 50, height: 50 }}
            inputProps={{ style: { textAlign: "center" } }}
            value={digit}
            onChange={(e) => handleOtpChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            autoFocus={index === 0}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                handleSubmitOTP();
              }
            }}
          />
        ))}
      </Stack>
      <FormHelperText sx={{ color: "red", fontSize: 12 }}>
        {formErrors.otp}
      </FormHelperText>
      <Typography
        sx={{
          color: "green",
          textAlign: "center",
          mt: 2,
          fontSize: 12,
        }}
      >
        OTP sent to {email}
      </Typography>
      <Button
        onClick={handleSubmitOTP}
        variant="contained"
        disabled={otp.length !== 6 || submittingOTP}
        sx={{
          width: 300,
          m: "auto",
          mt: 3,
          bgcolor: "rgb(49, 38, 228)",
        }}
      >
        {submittingOTP ? (
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "Submit OTP"
        )}
      </Button>

      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography fontSize={13} mt={5}>
          Incorrect Email?{" "}
          <span
            onClick={() => {
              setGetOtp(false);
              setOtp("");
            }}
            style={{
              textDecoration: "underline",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Click Here
          </span>
        </Typography>
        <Typography fontSize={13} mt={5}>
          {canResend ? (
            <span
              onClick={handleResendOTP}
              style={{
                textDecoration: "underline",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Resend OTP
            </span>
          ) : (
            <span>Resend OTP in {timer} seconds</span>
          )}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default OtpForm;
