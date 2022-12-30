import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import RoomIcon from '@mui/icons-material/Room';
import { Button, Icon } from "@mui/material";
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import HelpIcon from '@mui/icons-material/Help';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./Popover.css";


export default function HelpPopover({}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <Button variant="info" onClick={handleClick}>
        {"Help"}
        <HelpIcon/>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{maxHeight:'70%'}}
      >
        {/* <span className="highlight">How to use this app:</span>  */}
        <Typography sx={{ pt: 2,px:2, display: "flex" }}>
        <span className="highlight">How to use this app:</span>
        </Typography>
        <Typography sx={{ p: 2, display: "flex" }}>
          You can add
          places that you want to avoid. If you get to close, "within
          100m/330ft", a timer is set for 60 seconds. If you have not left the
          place after 60 seconds, #visits will increase by 1 and you will get a text message (if phone number
          was succesfully registered). The text message changes based on how many visits you have left this week at the place.
        </Typography>
        <Typography sx={{ p: 2, display: "flex" }}>
          1. Search an address, or click a business icon <RoomIcon sx={{color:"#1976d2"}}/> on the map
        </Typography>
        <Typography sx={{ p: 2, display: "flex" }}>
          2. Select number of Visits/Week allowed.
        </Typography>
       
        <Typography sx={{ p: 2, display: "flex", flexWrap:"wrap",alignItems:"center" }}>
          3. Click <span 
          className="highlight" 
          style={{backgroundColor: "#1976d2",border: 'solid', borderColor: '#1976d2',borderRadius: 5,color: 'white', margin:3}}>ADD</span>
           button. The place will be added to the map with a color circle. All the places you are avoiding can be found in
            <span className="highlight" style={{backgroundColor: "white",color: '#1976d2', margin:3}} >PLACES TO AVOID</span><LocationOnIcon sx={{color:'#1976d2'}}/>
        </Typography>
        <Typography sx={{ p: 2 ,display:'flex' }}><span className='highlight'><CircleTwoToneIcon sx={{mx: 2, color:'#FF0000'}}/></span> Red circles means you have no visits left this week.</Typography>
        <Typography sx={{ p: 2 ,display:'flex' }}><span className='highlight'><CircleTwoToneIcon sx={{mx: 2, color:'#FFFF00'}}/></span> Yellow circles means you have 1 visit left this week.</Typography>
        <Typography sx={{ p: 2 ,display:'flex' }}><span className='highlight'><CircleTwoToneIcon sx={{mx: 2, color:'#008000'}}/></span> Green circles means you have more than 1 visit left this week.</Typography>
        
        <Typography sx={{ px: 2, py:0, display: "flex" }}>
          While keeping this browser open on your phone and the app in Driving Mode, drive to a location you are trying to avoid. Wait 60 seconds. You will receive a text message.
        </Typography>
        <Typography sx={{ p: 2, display: "flex", flexWrap:"wrap",alignItems:"center" }}>
        Alternativly Drag and Drop the  <Icon fontSize="large"><img src='./volvo.png' style={{marginLeft: 5,marginRight:5}} /></Icon> inside the circle of a place you are trying to 
        avoid, wait 60 seconds.
        </Typography>
        
      </Popover>
    </div>
  );
}
