import React from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  useTheme,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";

import companylogo from "../../assets/safe-invest-logo.png";
import loginlogo from "../../assets/LoginLogo1.png";

function Login() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        component="form"
      >
        <Paper
          elevation={24}
          style={{
            display: "flex",
            flexDirection: "row",
            maxWidth: "50%",
            borderRadius: "20px",
            backgroundColor: theme.palette.mode === "dark" ? "#141b2d" : "",
          }}
        >
          
          <Grid container>
            <Grid item xs={12} md={5} lg={4} xl={5}>
              <Box
                p={2}
                display="flex"
                flexDirection="column"
                alignItems="left"
                justifyContent="center"
                gap={3}
                margin={2}
                marginBottom={5}
              >
                <img
                  src={companylogo}
                  style={{
                    width: "100%",
                    marginBottom: "15px",
                    backgroundColor: "#18446B",
                    borderRadius: "7px",
                  }}
                  alt="Company Logo"
                />
                <Box>
                  <Typography variant={"h2"} mt={2}>
                    Let's Get Started
                  </Typography>
                  <Typography variant={"h7"}>
                    Welcome back! Please enter your details.
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="center">
                  <img
                    src={loginlogo}
                    style={{
                      width: "30%",
                      marginBottom: "15px",
                      borderRadius: "7px",
                    }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={7} lg={8} xl={7}>
              <Box
                p={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={3}
                justifyContent="center"
                margin={4}
              >
                <Typography variant={"h4"}>
                  <b>ॐ श्री गणेशाय नमः</b>
                </Typography>
                <Box width="100%">
                  <Typography variant={"h6"}>Username :</Typography>
                  <TextField
                    required
                    id="username"
                    placeholder="User Name"
                    variant="outlined"
                    sx={{ width: "100%" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Box width="100%">
                  <Typography variant={"h6"}>Password :</Typography>
                  <TextField
                    required
                    id="password"
                    placeholder="Password"
                    autoComplete="off"
                    type={showPassword ? "text" : "Password"}
                    variant="outlined"
                    sx={{ width: "100%" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="start"
                          >
                            {showPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                <Typography
                  variant="body"
                  color={
                    theme.palette.mode === "dark" ? "white" : "text.primary"
                  }
                >
                  <Link
                    to="/forgot-password"
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Typography>
                <Button
                  variant="contained"
                  style={{
                    background: "#18446B",
                    padding: "10px",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  login
                </Button>
                
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
}

export default Login;
