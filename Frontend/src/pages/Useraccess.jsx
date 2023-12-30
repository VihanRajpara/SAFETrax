import React, { useState, useMemo ,lazy } from "react";
import { SafeHeader } from "../pageHeader/SafeHeader";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  Button,
 TextField,Autocomplete
} from "@mui/material";
import { tokens } from "../theme.js";
import { employee, Menus } from "../components/DATA.js";
import Menu from "../components/Access/Menu";

function Useraccess() {
  const header = "User Access";
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState(employee);
  const [defaultmenu, setDefaultmenu] = useState(Menus);


  return (
    <>
      <Paper
        style={{
          border: "1px solid #ced4da",
          borderRadius: "0.25rem",
          margin: "0.25rem",
          padding: "1rem",
          backgroundColor: "#f8f9fa",
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
              getOptionLabel={(option) => option.Mename}
              renderInput={(params) => <TextField {...params} label="Users" />}
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography>{`${option.Mename}`}</Typography>
                </li>
              )}
            />
          </Box>
          <Button
            variant="contained"
            sx={{ borderRadius: 4 }}
            onClick={() => console.log("user", user)}
          >
            GO
          </Button>
        </Box>
      </Paper>

      <Menu defaultmenu={defaultmenu} user={user}/>
    </>
  );
}

export default Useraccess;
