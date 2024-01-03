import React, { useState } from "react";
import {
  Box,
  TextField,
  useTheme,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useSnackbar } from "../../snackbar/SnackbarContext";
import { useNavigate } from "react-router-dom";


function NewPassword(props) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  console.log("email", props.email)
  const [password, setPassword] = useState("");
  const [cnfpassword, setCnfpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async () => {
    if (password !== cnfpassword) {
      showSnackbar("Passwords do not match", "error");
      return;
    }
  
    try {
  
      const url = `http://localhost:8080/auth/set-password?email=${props.email}`;
      const response = await axios.put(url, null, {
        headers: {
          "newPassword": password,
        },
      });
  
      if (response.status === 200) {
        console.log("Password successfully Changed");
        showSnackbar("Password successfully Changed", "success");
        navigate("/login");
      } else {
        console.error("Error setting password");
      }
    } catch (error) {
      console.error("Axios error:", error);
    }
  };
  
  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={"column"}
      gap={4}
      component="form"
    >
      <Typography variant={"h4"} style={{ marginBottom: "10px" }}>
        Enter the required information.
      </Typography>

      <Box width="100%" textAlign="left">
        <TextField
          required
          id="password"
          label="Enter New Password"
          placeholder="New Password"
          type={showPassword ? "text" : "password"}
          autoComplete="off"
          value={password}
          variant="outlined"
          sx={{ width: "100%" }}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleTogglePasswordVisibility} edge="start">
                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box width="100%" textAlign="left">
        <TextField
          required
          id="cnfpassword"
          label="ReEnter New Password"
          placeholder="Confirm Password"
          type="password"
          autoComplete="off"
          value={cnfpassword}
          variant="outlined"
          sx={{ width: "100%" }}
          onChange={(e) => setCnfpassword(e.target.value)}
        />
      </Box>

      <Button
        variant="contained"
        style={{
          background: "#18446B",
          marginBottom: "30px",
          padding: "10px",
          width: "100%",
          height: "100%",
        }}
        onClick={handleSubmit}
      >
        Change Password
      </Button>
    </Box>
  );
}

export default NewPassword;
