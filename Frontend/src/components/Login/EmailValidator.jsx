import React, { useState } from "react";
import {
  Box,
  TextField,
  useTheme,
  Button,
  Typography,
  CircularProgress
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useSnackbar } from "../../snackbar/SnackbarContext";
import { useNavigate } from "react-router-dom";

function EmailValidator({ changeBox, setEmail, email, setOtp, otp }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [emailError, setEmailError] = useState(false);
  const [loading, setLoading] = useState(false);  // State to manage loading state

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(!isValid);
  };

  const handleSubmit = () => {
    // Check if the email is valid before making the API request
    if (!emailError) {
      setLoading(true);  // Set loading to true when the request is initiated

      const apiUrl = `http://localhost:8080/auth/forgot-password?email=${email}`;

      // Make the API request using axios
      axios
        .put(apiUrl)
        .then((response) => {
          // Handle the API response here
          console.log("API Response:", response.data);
          console.log(response.data.statusCodeValue);

          if (response.data.statusCodeValue === 200) {
            // Set the Snackbar color to green for success
            showSnackbar("Please check your email for the OTP", "success");

            changeBox("otp");
            // Use the OTP for internal purposes
            const match = response.data.body.match(/OTP: (\d+)/);
            otp = match ? match[1] : null;
            // Now, 'otp' contains the extracted OTP for internal use
            setOtp(otp);
            console.log("Extracted OTP:", otp);
          }else{
            showSnackbar("Error while sending mail. Check your email address", "error" );

          }
        })
        .catch((error) => {
          console.error("Error during API request:", error);
        })
        .finally(() => {
          setLoading(false);  // Set loading to false when the request is complete
        });
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
        onClick={handleSubmit}
        disabled={loading}  
      >
        {loading ? (  
          <CircularProgress size={24} style={{ color: "white" }}  />
        ) : (
          <>
            SEND OTP <SendIcon style={{ marginLeft: "7px" }} />
          </>
        )}
      </Button>
    </Box>
  );
}

export default EmailValidator;
