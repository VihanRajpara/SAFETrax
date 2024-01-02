import { Routes, Route} from "react-router-dom";
import Login from "./pages/Login/Login";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import ForgotPassword from "./pages/Login/ForgotPassword";
import NotFoundPage from "./pages/NotFoundPage";
import Useraccess from "./pages/Useraccess";
import CROTab from "./pages/CROTab.jsx";
import { SnackbarProvider } from "./snackbar/SnackbarContext.jsx";
import "./App.css";
function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
        <CssBaseline />
        <div className="app">
          <main className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/useraccess" element={<Useraccess />} />
              <Route path="/forgot-password" element={<ForgotPassword/>}/>
              <Route path="/cro" element={<CROTab/>}/>
              <Route path="/*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
        </SnackbarProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
