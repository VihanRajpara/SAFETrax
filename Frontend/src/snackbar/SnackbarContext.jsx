import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import React, { createContext, useContext, useState } from "react";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("");

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const hideSnackbar = () => {
        setSnackbarOpen(false);
    };

    const contextValue = {
        showSnackbar,
        hideSnackbar,
    };

    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={2} ref={ref} variant="filled" {...props} />;
    });

    return (
        <SnackbarContext.Provider value={contextValue}>
            {children}
            {/* Global Snackbar */}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={hideSnackbar}
            >
                <Alert
                    onClose={hideSnackbar}
                    severity={snackbarSeverity}
                    sx={{ width: "100%", fontSize: "16px" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within a SnackbarProvider");
    }
    return context;
};
