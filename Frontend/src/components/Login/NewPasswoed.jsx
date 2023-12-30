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
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function NewPasswoed({ changeBox, setPassword, password }) {
  const theme = useTheme();
  const [cnfpassword, setCnfpassword] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
        Enter the required innformation.
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
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  edge="start"
                >
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
        onClick={() => changeBox("email")}
      >
        Change Password
      </Button>
    </Box>
  );
}

export default NewPasswoed;
