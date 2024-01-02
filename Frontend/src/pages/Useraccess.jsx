import React, { useState, useMemo ,useEffect } from "react";
import { SafeHeader } from "../pageHeader/SafeHeader";
import axios from "axios";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Button,
 TextField,Autocomplete
} from "@mui/material";
import { tokens } from "../theme.js";
import Menu from "../components/Access/Menu";
import {useSnackbar} from "../snackbar/SnackbarContext.jsx"

function Useraccess() {
    const { showSnackbar } = useSnackbar();
    const header = "Employee Master";
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [user, setUser] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [selectedcheckbox, setSelectedcheckbox] = useState([]);
    const [click,setClick] = useState(false);

    const handleClick=(type)=>{
      if(type === "go"){
        setClick(true);
      }
    }
    useEffect(() => {
      try {
        axios
          .get(`http://localhost:8080/user/employees`)
          .then((response) => {
            setEmployees(() => {
              const state = response.data;
              return state;
            });
          });
      } catch (e) { console.log(e); }
  
    }, [])
  
    const handleGo = async () => {
      if (user !== null) {
        handleClick("go");
        try {
          await axios
            .get(`http://localhost:8080/user/${user.mecode}`)
            .then((response) => {
              setSelectedcheckbox(response.data);
              
            });
        } catch (e) { console.log(e); }
      }else{
        showSnackbar("Please select a user first!", "error");
      }
    };
    
  
    return (
      <>
        <Paper
          style={{
            border: "1px solid #ced4da",
            borderRadius: "0.25rem",
            margin: "0.25rem",
            padding: "1rem",
            textTransform: "uppercase",
          }}
        >
          <SafeHeader headerName={header} />
  
          <Box
            display="flex"
            gap={2}
            p={2}
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
          >
            <Typography sx={{ fontSize: 18 }}>select User : </Typography>
            <Box
              display="flex"
              sx={{ width: 400, height: 36 }}
              backgroundColor={colors.primary[400]}
              borderRadius="1px"
            >
              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                options={employees}
                value={user}
                onChange={(e, v) => setUser(v)}
                sx={{ width: 400, height: 20 }}
                getOptionLabel={(option) => option.mename}
                renderInput={(params) => <TextField {...params} label="Users" />}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Typography>{`${option.mename}`}</Typography>
                  </li>
                )}
              />
            </Box>
            <Button
              variant="contained"
              sx={{ borderRadius: 4, bgcolor: `${colors.blueAccent[600]}` }}
              onClick={() => { handleGo(); }}
            >
              GO
            </Button>
          </Box>
  
  
          <Menu selectedcheckbox={selectedcheckbox} user={user} handleGo={handleGo} handleClick={handleClick} click={click}/>
          </Paper>
      </>
    );
  }
export default Useraccess;
