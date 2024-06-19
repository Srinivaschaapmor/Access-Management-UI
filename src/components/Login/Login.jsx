import {
  Box,
  Button,
  CircularProgress,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Logo from "../../assets/AapmorLogo.png";
import Logo from "../../assets/AuthXLogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginEmail, verifyOtp } from "../../apiCalls/Apicalls";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [getOtp, setGetOtp] = useState(false);
  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [submittingOTP, setSubmittingOTP] = useState(false);
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const otpFields = useRef([]);

  const validateEmail = (email) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      errors.email = "Field is required";
    } else if (!regex.test(email)) {
      errors.email = "Invalid email format";
    }
    return errors;
  };

  const validateOtp = (otp) => {
    const errors = {};
    if (!otp) {
      errors.otp = "* Field is required";
    } else if (!/^\d+$/.test(otp)) {
      errors.otp = "OTP must contain only digits";
    } else if (otp.length !== 6) {
      errors.otp = "OTP must be 6 digits long";
    }
    return errors;
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleOtpChange = (index, event) => {
    const { value } = event.target;
    if (isNaN(value)) return;
    const newOtpArray = [...otpArray];
    newOtpArray[index] = value;
    setOtpArray(newOtpArray);
    setOtp(newOtpArray.join(""));

    if (value !== "" && index < 5) {
      otpFields.current[index + 1].focus();
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

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && index > 0 && otpArray[index] === "") {
      otpFields.current[index - 1].focus();
    }
  };

  const handleGetOTP = async () => {
    const errors = validateEmail(email);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(`${loginEmail}`, { email });
        setGetOtp(true);
        setCanResend(false);
        setTimer(30);
        toast.success("OTP sent successfully!");
      } catch (error) {
        toast.error("Error sending OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please enter a valid email.");
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${loginEmail}`, { email });
      setCanResend(false);
      setTimer(30);
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error("Error resending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async () => {
    if (submittingOTP) return;
    const errors = validateOtp(otp);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setSubmittingOTP(true);
      try {
        const response = await axios.post(
          `${verifyOtp}`,
          {
            otp: otp,
            email: email,
          },
          {
            withCredentials: true,
          }
        );
        if (response.data.jwt_token) {
          const useremail = response.data.userEmail;
          const jwtToken = response.data.jwt_token;
          const redirect_uri = queryParameters.get("redirect_uri");
          const access = response.data.access;
          Cookies.set("jwtToken", jwtToken, {
            expires: 1 / 12,
            domain: "192.168.0.122",
            path: "/",
          });
          Cookies.set("userEmail", useremail, {
            domain: "192.168.0.122",
            path: "/",
          });
          Cookies.set("access", JSON.stringify(access), {
            domain: "192.168.0.122",
            path: "/",
          });
          if (redirect_uri) {
            window.location.href = decodeURIComponent(redirect_uri);
          } else {
            navigate("/dashboard/home");
            toast.success("Login successful!");
          }
        } else {
          toast.error("Invalid OTP.");
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error("Access denied for this email address.");
        } else {
          toast.error(
            "An error occurred while verifying OTP. Please try again."
          );
        }
      } finally {
        setSubmittingOTP(false);
      }
    }
  };

  useEffect(() => {
    if (email.length > 0) {
      setFormErrors(validateEmail(email));
    }
    if (otp.length > 0) {
      setFormErrors(validateOtp(otp));
    }
  }, [email, otp]);

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    if (token !== undefined && !queryParameters.get("redirect_uri")) {
      navigate("/dashboard/home");
    }
  });

  useEffect(() => {
    if (getOtp && !canResend) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [getOtp, canResend]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          bgcolor: "rgb(224, 227, 234)",
          height: "100vh",
          "& > :not(style)": {
            m: "auto",
            width: 1000,
            height: 500,
          },
        }}
      >
        <Paper sx={{ borderRadius: 5 }}>
          <Stack direction={"row"} sx={{ height: "84%" }}>
            <Box
              width={"60%"}
              height={"100%"}
              p={5}
              bgcolor={"#FCFCFC"}
              borderRadius={5}
            >
              <Stack>
                <img src={Logo} width={150} alt="Logo"></img>
              </Stack>
              <Stack mt={10}>
                <Typography variant="h2" color={"rgb(82, 119, 250)"}>
                  Hello,
                </Typography>
                <Typography variant="h3" color={"rgb(82, 119, 250)"}>
                  Welcome !
                </Typography>
                <Typography fontSize={20} mt={5} color={"#888888"}>
                  Unlocking Possibilities, Empowering Journeys
                </Typography>
              </Stack>
            </Box>
            <Box width={"50%"} p={5} pt={12}>
              <Stack>
                <Typography variant="h6" fontWeight={600} m={"auto"}>
                  AuthX AUTHENTICATION
                </Typography>
                {!getOtp ? (
                  <>
                    <Typography m={"auto"} pt={5}>
                      Login with your email
                    </Typography>
                    <TextField
                      type="email"
                      value={email}
                      helperText={formErrors.email}
                      FormHelperTextProps={{ style: { color: "red" } }}
                      onChange={handleEmailChange}
                      placeholder="Enter your email"
                      size="small"
                      sx={{ width: 300, m: "auto", pt: 5 }}
                    ></TextField>
                    <Button
                      variant="contained"
                      disabled={email.length === 0}
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
                  </>
                ) : (
                  <>
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
                          onClick={() => setGetOtp(false)}
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
                  </>
                )}
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>
      <ToastContainer />
    </>
  );
}

export default Login;
