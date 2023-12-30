import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import CROforInvestment from "../components/Access/CROforInvestment";
import CROforInsurance from "../components/Access/CROforInsurance";


const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
};

function LeaveTabs() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          backgroundColor: "#18446B",
          borderBottom: "2px solid #ccc",
          "& .MuiTabs-indicator": {
            backgroundColor: "#fff", // Change indicator color to white
          },
        }}
      >
        <Tab
          label="Investment"
          sx={{
            color: "#fff", // Default tab text color
            "&.Mui-selected": {
              color: "#fff", // Change color when selected
              fontWeight: "bold",
              fontSize:15,
            },
            fontSize: "0.90rem",
          }}
        />
        <Tab
          label="Insurance"
          sx={{
            color: "#fff", // Default tab text color
            "&.Mui-selected": {
              color: "#fff", // Change color when selected
              fontWeight: "bold",
              fontSize:15,
            },
            fontSize: "0.90rem",
          }}
        />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <CROforInvestment/>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
         <CROforInsurance/>
      </TabPanel>
    </Box>
  );
}

export default LeaveTabs;
