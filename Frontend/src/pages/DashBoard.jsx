import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { Container, Typography, Button, AppBar, Toolbar } from "@mui/material";
import { useTheme } from "@emotion/react";

function Dashboard() {
  const theme =useTheme();
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, display: "flex", flexDirection: "row", alignItems: "center" }}>
        <Button variant="contained" component={Link} to="/useraccess" color="primary">
          Menu
        </Button>
        <Button variant="contained" color="primary" component={Link} to="/cro" style={{ marginLeft: 10 }}>
          CRO
        </Button>
      </Container>
    </div>
  );
}

export default Dashboard;
