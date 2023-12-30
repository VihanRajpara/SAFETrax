import { React, useState } from "react";
import { Box, Paper, useTheme, Typography } from "@mui/material";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import EmailValidator from "../../components/Login/EmailValidator";
import Otpforpassword from "../../components/Login/Otpforpassword";
import NewPasswoed from "../../components/Login/NewPasswoed";

function ForgotPassword() {
  const theme = useTheme();
  const [Emailbox, setEmailbox] = useState(true);
  const [Otpbox, setOtpbox] = useState(false);
  const [Newpassbox, setNewpassbox] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password,setPassword]=useState('');

  const disableall = () => {
    setEmailbox(false);
    setOtpbox(false);
    setNewpassbox(false);
  };
  const change = (next) => {
    disableall();
    if (next === "email") {
      setEmailbox(true);
    } else if (next === "otp") {
      setOtpbox(true);
    } else if (next === "password") {
      setNewpassbox(true);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Paper
          elevation={24}
          style={{
            width: "100%",
            maxWidth: "480px",
            textAlign: "center",
            borderRadius: "20px",
            backgroundColor: theme.palette.mode === "dark" ? "#141b2d" : "",
          }}
        >
          <Box
            p={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={3}
            marginRight={4}
            marginLeft={4}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection={"column"}
              margin={2}
              marginBottom={5}
              maxWidth="400px"
            >
              <Diversity1Icon style={{ fontSize: 30 }} />
              <Typography variant={"h2"} mt={2}>
                Let us help you
              </Typography>
            </Box>

            {Emailbox && <EmailValidator changeBox={change} setEmail={setEmail} email={email}/>}
            {Otpbox && <Otpforpassword changeBox={change} setOtp={setOtp} otp={otp} email={email}/>}
            {Newpassbox && <NewPasswoed changeBox={change} setPassword={setPassword} password={password}/>}
          </Box>
        </Paper>
      </Box>
    </>
  );
}

export default ForgotPassword;
