import React from "react";
import {
  Box,
  TextField,
  useTheme,
  Button,
  Typography,
} from "@mui/material";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";

function EmailValidator({changeBox ,setEmail,email}) {
  const theme = useTheme();
  const [emailError, setEmailError] = useState(false);

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(!isValid);
  };

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection={"column"}
      gap={4}
    >
      <Box width="100%" textAlign="left">
        <Typography variant={"h7"}>
          Enter your Email address to reset your password.
        </Typography>
        <TextField
          required
          id="email"
          placeholder="Email ID"
          type="Email"
          value={email}
          variant="outlined"
          sx={{ width: "100%" }}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validateEmail}
          error={emailError}
          helperText={emailError ? "Please enter a valid email address" : ""}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
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
        onClick={()=>changeBox("otp")}
      >
        SEND OTP <SendIcon style={{ marginLeft: "7px" }} />
      </Button>
    </Box>
  );
}

export default EmailValidator;
