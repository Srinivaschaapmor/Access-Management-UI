import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Logo from "../../assets/AapmorLogo.png";
import Logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { object } from "yup";
import { TroubleshootOutlined } from "@mui/icons-material";
import Cookies from "js-cookie";
import axios from "axios";
import { loginEmail } from "../../apiCalls/Apicalls";
import {
  Routes,
  Route,
  useSearchParams,
  BrowserRouter,
} from "react-router-dom";
function Login() {
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIssubmit] = useState(false);
  const [isOtpSubmit, setIsOtpsubmit] = useState(false);
  const [email, setEmail] = useState();
  const [loading, setLoading] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    otp: "",
  });
  const [queryParameters] = useSearchParams();

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleOTPChange = (otp) => {
    setLoginDetails((prevState) => ({ ...prevState, otp }));
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/; // Regex to detect special characters
    const emojiRegex =
      /[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}]/u; // Regex to detect emojis
    const leadingTrailingSpacesRegex = /^\s+|\s+$/g;

    // Validation for email
    if (!values.email) {
      errors.email = "Field is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format";
    } else if (
      values.email.startsWith(".") ||
      values.email.includes("..") ||
      values.email.startsWith("@") ||
      values.email.endsWith(".") ||
      values.email.includes(" ")
    ) {
      errors.email = "Invalid email format";
    } else if (
      !values.email.includes("@") ||
      values.email.lastIndexOf("@") !== values.email.indexOf("@")
    ) {
      errors.email = "Invalid email format";
    }

    if (!values.otp) {
      errors.otp = "* Field is required";
    } else if (!/^\d+$/.test(values.otp)) {
      errors.otp = "OTP must contain only digits";
    } else if (values.otp.length !== 6) {
      errors.otp = "OTP must be 6 digits long";
    }

    return errors;
  };

  const navigate = useNavigate();
  let length = 6;
  const [getOtp, setGetOtp] = useState(false);
  const [otp, setOTP] = useState(new Array(length).fill(""));
  const otpFields = useRef([]);
  const handleChange = (index, event) => {
    let value = event.target.value;
    // Only allow numeric input
    if (isNaN(value)) return;
    // Limit input length to 1 character
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    // Automatically move to next input box if available
    if (value !== "" && index < length - 1) {
      otpFields.current[index + 1].focus();
    }

    const newCombinedOTP = newOTP.join("");
    handleOTPChange(newCombinedOTP);
  };
  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData("text");
    if (!/^\d{6}$/.test(pasteData)) return;

    const newOTP = pasteData.split("");
    setOTP(newOTP);
    handleOTPChange(pasteData);
    otpFields.current.forEach((field, index) => {
      field.value = newOTP[index];
    });
  };
  const handleKeyDown = (index, event) => {
    // Handle backspace to move to previous input box
    if (event.key === "Backspace" && index > 0 && otp[index] === "") {
      otpFields.current[index - 1].focus();
    }
  };

  const handleGetOTP = async () => {
    setFormErrors(validate(loginDetails));
    setIssubmit(true);
    setLoading(true);
    const email = loginDetails.email;
    if (Object.entries(formErrors).length === 1) {
      try {
        const response = await axios.post(`${loginEmail}`, { email });
        setGetOtp(true);
        setLoading(false);
        toast.success("OTP sent successfully!");
      } catch (error) {
        console.error("Error sending OTP:", error);
        setLoading(false);
        toast.error("Error sending OTP. Please try again.");
      }
    } else {
      setLoading(false);
      toast.error("Please enter a valid email.");
    }
  };

  const handleSubmitOTP = async () => {
    setIsOtpsubmit(true);
    setFormErrors(validate(loginDetails));

    if (Object.entries(formErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/login/verify-otp",
          {
            otp: loginDetails.otp,
            email: loginDetails.email,
          }
        );
        if (response.data.jwt_token) {
          const useremail = response.data.userEmail;
          const jwtToken = response.data.jwt_token;
          const redirect_uri = queryParameters.get("redirect_uri");
          const access = response.data.access;
          console.log(redirect_uri);
          Cookies.set("jwtToken", jwtToken, { expires: 1 / 12 });
          Cookies.set("userEmail", useremail);
          Cookies.set("access", JSON.stringify(access));
          window.location.href = decodeURIComponent(redirect_uri);
          // navigate("/dashboard/access-management");
          // toast.success("Login successful!");
        } else {
          toast.error("Invalid OTP.");
        }
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 403) {
          toast.error("Access denied for this email address.");
        } else {
          console.error("Error verifying OTP:", error);
          toast.error(
            "An error occurred while verifying OTP. Please try again."
          );
        }
      }
    } else {
      toast.error("Please enter a valid OTP.");
    }
  };

  useEffect(() => {
    if (loginDetails.email.length > 0) {
      setFormErrors(validate(loginDetails));
    }

    if (isOtpSubmit) {
      setFormErrors(validate(loginDetails));
    }
  }, [loginDetails, formErrors]);

  useEffect(() => {
    const token = Cookies.get("jwtToken");
    if (token !== undefined && !queryParameters.get("redirect_uri")) {
      navigate("/dashboard/access-management");
    }
  });
  return (
    <>
      <Box
        sx={{
          display: "flex",
          // flexWrap: "wrap",
          mt: 5,
          "& > :not(style)": {
            m: "auto",
            width: 1000,
            height: 500,
          },
        }}
      >
        <Paper>
          <Stack direction={"row"} sx={{ height: "84%" }}>
            <Box width={"60%"} height={"100%"} p={5} bgcolor={"#FCFCFC"}>
              <Stack>
                <img src={Logo} width={150}></img>
                <Typography fontSize={12}>LOGO TECHNOLOGIES</Typography>
              </Stack>
              <Stack mt={10}>
                <Typography variant="h2" color={"rgb(49, 38, 228)"}>
                  Hello,
                </Typography>
                <Typography variant="h3" color={"rgb(49, 38, 228)"}>
                  Welcome !
                </Typography>
                <Typography fontSize={20} mt={5} color={"#888888"}>
                  Unlocking Possibilities, Empowering Journeys
                </Typography>
              </Stack>
            </Box>
            {/* <Divider
            sx={{
              height: 500,
              border: "1px solid",
              backgroundColor: "grey",
            }}
          ></Divider> */}
            <Box width={"50%"} p={5} pt={12}>
              <Stack>
                <Typography variant="h6" fontWeight={600} m={"auto"}>
                  {" "}
                  LOGO AUTHENTICATION
                </Typography>

                {!getOtp ? (
                  <>
                    {" "}
                    <Typography m={"auto"} pt={5}>
                      Login with your email
                    </Typography>
                    <TextField
                      type="email"
                      name="email"
                      value={loginDetails.email}
                      helperText={formErrors.email}
                      FormHelperTextProps={{ style: { color: "red" } }}
                      onChange={(e) => handleEmailChange(e)}
                      placeholder="Enter your email"
                      size="small"
                      sx={{ width: 300, m: "auto", pt: 5 }}
                    ></TextField>
                    <Button
                      variant="contained"
                      disabled={loginDetails.email.length === 0}
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
                      {otp.map((digit, index) => (
                        <TextField
                          key={index}
                          inputRef={(el) => (otpFields.current[index] = el)}
                          variant="outlined"
                          name="otp"
                          size="small"
                          sx={{ width: 50, height: 50 }}
                          inputProps={{ style: { textAlign: "center" } }}
                          value={digit}
                          onChange={(e) => handleChange(index, e)}
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
                      OTP sent to {loginDetails.email}
                    </Typography>
                    <Button
                      onClick={handleSubmitOTP}
                      variant="contained"
                      sx={{
                        width: 300,
                        m: "auto",
                        mt: 3,
                        bgcolor: "rgb(49, 38, 228)",
                      }}
                    >
                      submit otp
                    </Button>
                    <Typography fontSize={15} mt={5}>
                      Incorrect Email ?{" "}
                      <span
                        onClick={() => setGetOtp(false)}
                        style={{
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Click Here
                      </span>
                    </Typography>
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
