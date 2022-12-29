import * as React from "react";

import BottomNavigation from "@mui/material/BottomNavigation";

import PlacesToAvoidDrawer from "../Drawer/Drawer";
import HelpPopover from "../Drawer/HelpPopover";
import { Paper } from "@mui/material";
export default function SimpleBottomNavigation() {
  const [value, setValue] = React.useState(0);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{justifyContent: 'space-around' }}
    >
      <PlacesToAvoidDrawer />
      <HelpPopover />
     
    </BottomNavigation>
     </Paper>
  );
}
