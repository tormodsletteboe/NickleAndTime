import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import ToggleOnSharpIcon from '@mui/icons-material/ToggleOnSharp';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CircleIcon from '@mui/icons-material/Circle';
import CircleTwoToneIcon from '@mui/icons-material/CircleTwoTone';
import './Popover.css';
export default function BasicPopover({}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <HelpOutlineIcon aria-describedby={id} onClick={handleClick}/>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        
        <Typography sx={{ p: 2 ,display:'flex'}}><span className='highlight'><ToggleOnSharpIcon color='primary'sx={{mx: 2}}/></span> Deactivate allows you to visit a place without increasing the number of visits. Also, no text message is sent out.</Typography>
        <Typography sx={{ p: 2 ,display:'flex' }}><span className='highlight'><DeleteIcon color='error' sx={{mx: 2}}/></span> Permanently removes the place. You can always add it back.</Typography>
       <Typography sx={{ p: 2 ,display:'flex' }}><span className='highlight'><CircleTwoToneIcon sx={{mx: 2, color:'#FF0000'}}/></span>  No visits left this week.</Typography>
<Typography sx={{ p: 2 ,display:'flex' }}><span className='highlight'><CircleTwoToneIcon sx={{mx: 2, color:'#FFFF00'}}/></span>  One visit left this week.</Typography>
<Typography sx={{ p: 2 ,display:'flex' }}><span className='highlight'><CircleTwoToneIcon sx={{mx: 2, color:'#008000'}}/></span>  More than 1 visit left this week.</Typography>
        <Typography sx={{ p: 2 }}><span className='highlight'></span>#visits is reset every 7 days, from when it was added.</Typography>
      </Popover>
    </div>
  );
}