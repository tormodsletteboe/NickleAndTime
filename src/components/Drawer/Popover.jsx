import * as React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
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
        <Typography sx={{ p: 2 }}><span className='highlight'>Deactivate:</span> Allows you to visit a place without increasing the number of visits. Also, no text message is sent out.</Typography>
        <Typography sx={{ p: 2 }}><span className='highlight'>Delete:</span> Permanently removes the place. You can always add it back.</Typography>
        <Typography sx={{ p: 2 }}><span className='highlight'></span>#visits is reset every 7 days,from when it was added.</Typography>
      </Popover>
    </div>
  );
}