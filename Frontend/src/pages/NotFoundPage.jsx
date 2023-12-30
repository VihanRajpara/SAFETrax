import React from "react";
import { Link } from "react-router-dom";
import { Box, Container, Typography, Button } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <Container>
        <Typography variant="h1" align="center" color="textSecondary">
          404 - Page Not Found
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          Sorry, the page you are looking for might be in another castle.
        </Typography>
        <Box mt={3} display="flex" justifyContent="center">
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
          >
            Back to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFoundPage;


