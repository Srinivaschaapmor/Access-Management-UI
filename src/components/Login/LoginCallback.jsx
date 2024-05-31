import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useState } from "react";
const useStyles = makeStyles((theme) => ({
  root: {
    // marginTop: theme.spacing(8),

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    // marginTop: theme.spacing(3),
  },
  submit: {
    // margin: theme.spacing(3, 0, 2),
  },
}));

const LoginCallback = () => {
  const classes = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const callbackUrl = new URLSearchParams(window.location.search).get(
      "callback"
    );

    // Perform login logic here and obtain JWT token
    const response = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.token) {
      window.location.href = `${callbackUrl}?token=${data.token}`;
    } else {
      alert("Login failed");
    }
  };

  return (
    // <div className="login-container">
    //   <form className="login-form" onSubmit={handleSubmit}>
    //     <h2>Login</h2>
    //     <div className="form-group">
    //       <label htmlFor="username">Username</label>
    //       <input
    //         type="text"
    //         id="username"
    //         value={username}
    //         onChange={(e) => setUsername(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div className="form-group">
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         id="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     {error && <div className="error-message">{error}</div>}
    //     <button type="submit" className="login-button">
    //       Login
    //     </button>
    //   </form>
    // </div>
    <Box bgcolor={"rgb(244, 246, 248)"} minHeight={"100vh"} pt={10}>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ height: 400, bgcolor: "white", pt: 3, borderRadius: 2 }}
      >
        <div className={classes.root}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form className={classes.form} onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              sx={{ mt: 3 }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
            </Button>
          </form>
        </div>
      </Container>
    </Box>
  );
};

export default LoginCallback;
