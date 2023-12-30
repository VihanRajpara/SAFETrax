import { Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import { tokens } from "../theme.js";

export const SafeHeader = ({ headerName }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Grid
            marginBottom={2}
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
                backgroundColor: `${colors.blueAccent[600]} !important`,
            }}
            padding="3px"
            borderRadius={2} color="#fff"
        >
            <Typography fontWeight={600} variant="h6" color={"white"}>
                {headerName}
            </Typography>
        </Grid>
    );
};
