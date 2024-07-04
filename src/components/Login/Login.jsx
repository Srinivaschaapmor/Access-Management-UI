import { Box, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Logo from "../../assets/AapmorLogo.png";
import Logo from "../../assets/AuthXLogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginEmail, verifyOtp } from "../../apiCalls/Apicalls";
import { useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import EmailForm from "./EmailForm";
import OtpForm from "./OtpForm";

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
  const otpFields = useRef([]);
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const token = Cookies.get("jwtToken");

  function handleLogin() {
    const redirect_uri = queryParameters.get("redirect_uri");
    if (!token) {
      if (!redirect_uri) {
        navigate("/");
      }
    } else {
      if (redirect_uri) {
        window.location.href = decodeURIComponent(redirect_uri);
      } else if (window.location.pathname === "/") {
        navigate("/dashboard/home");
      }
    }
  }

  useEffect(() => {
    handleLogin();
  }, []);

  const validateEmail = (email) => {
    const errors = {};
    const trimmedEmail = email.trim();
    const regex =
      /^[a-zA-Z._%+-][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})$/;

    if (!trimmedEmail) {
      errors.email = "Field is required";
    } else if (!regex.test(trimmedEmail)) {
      errors.email = "Invalid email format";
    }

    return { errors, trimmedEmail };
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

  const handleGetOTP = async () => {
    const { errors, trimmedEmail } = validateEmail(email);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(`${loginEmail}`, {
          email: trimmedEmail,
        });
        setGetOtp(true);
        setCanResend(false);
        setTimer(30);
        toast.success("OTP sent successfully!");

        // Set a timeout to show "OTP expired" toast after 2 minutes
      } catch (error) {
        toast.error("Please check your Network and try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendOTP = async () => {
    setOtpArray(new Array(6).fill(""));
    setLoading(true);
    setCanResend(false);
    setTimer(30);
    try {
      const response = await axios.post(`${loginEmail}`, { email });
      toast.success("OTP resent successfully!");

      // Set a timeout to show "OTP expired" toast after 2 minutes
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
            domain: process.env.REACT_APP_COOKIES_DOMAIN,
            path: "/",
          });
          Cookies.set("userEmail", useremail, {
            domain: process.env.REACT_APP_COOKIES_DOMAIN,
            path: "/",
            expires: 1 / 12,
          });
          Cookies.set("access", JSON.stringify(access), {
            domain: process.env.REACT_APP_COOKIES_DOMAIN,
            path: "/",
            expires: 1 / 12,
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
        console.log({ error });
        if (error.response && error.response.status === 403) {
          toast.error("Access denied for this email address.");
        } else if (error.response.status === 410) {
          toast.error(error.response.data.error);
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
    // if (otp.length > 0) {
    //   setFormErrors(validateOtp(otp));
    // }
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
                {!getOtp ? (
                  <EmailForm
                    email={email}
                    setEmail={setEmail}
                    formErrors={formErrors}
                    handleGetOTP={handleGetOTP}
                    loading={loading}
                  />
                ) : (
                  <OtpForm
                    email={email}
                    otpArray={otpArray}
                    setOtpArray={setOtpArray}
                    otp={otp}
                    setOtp={setOtp}
                    formErrors={formErrors}
                    // handlePaste={handlePaste}
                    // handleKeyDown={handleKeyDown}
                    handleSubmitOTP={handleSubmitOTP}
                    submittingOTP={submittingOTP}
                    canResend={canResend}
                    timer={timer}
                    handleResendOTP={handleResendOTP}
                    setGetOtp={setGetOtp}
                    otpFields={otpFields}
                  />
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
