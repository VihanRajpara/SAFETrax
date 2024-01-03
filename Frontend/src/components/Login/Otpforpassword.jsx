import React, { useState } from "react";
import { Box, TextField, useTheme, Button, Typography } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SendIcon from "@mui/icons-material/Send";
import DraftsIcon from "@mui/icons-material/Drafts";
import { useSnackbar } from "../../snackbar/SnackbarContext";

function Otpforpassword({ changeBox, otp, email }) {
  const [enteredOtp, setEnteredOtp] = useState("");
  const theme = useTheme();
  const { showSnackbar } = useSnackbar(); 
  console.log("Recieved otp is", otp)

  const handleSubmit = () => {
    if (enteredOtp.trim() === otp) {
      // If the OTPs match, switch to the "password" component
      showSnackbar("OTP Verified","success")
      changeBox("password");
    } else {
      showSnackbar("OTP Verification failed","error")

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
      <Typography variant={"h4"} style={{ marginBottom: "10px" }}>
        OTP has been sent via Email to {email}
      </Typography>
      <Box width="100%" textAlign="left">
        <Typography variant={"h7"}>
          Enter the OTP below to verify it.
        </Typography>

        <TextField
          required
          id="otp"
          size="small"
          placeholder="OTP"
          variant="outlined"
          sx={{ width: "100%" }}
          inputProps={{
            maxLength: 6,
            style: {
              textAlign: 'center',
              fontSize: '25px', // Adjust font size as needed
              letterSpacing: '15px',
            },
          }}
          value={enteredOtp}
          onChange={(e) => setEnteredOtp(e.target.value)}
        />
        <Typography
          variant="h7 "
          color={theme.palette.mode === "dark" ? "white" : "text.primary"}
          style={{ cursor: 'pointer' }}
          onClick={() => changeBox("email")}
        >
          Resend?

        </Typography>
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
        onClick={() => handleSubmit()}
      >
        verify OTP <SendIcon style={{ marginLeft: "7px" }} />
      </Button>
    </Box>
  );
}

export default Otpforpassword;
