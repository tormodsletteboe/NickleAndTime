import React from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';

function LogOutButton(props) {
  const dispatch = useDispatch();
  return (
    <button
      // This button shows up in multiple locations and is styled differently
      // because it's styled differently depending on where it is used, the className
      // is passed to it from it's parents through React props
      //variant="contained"
      className={props.className}
      onClick={() => {
        dispatch({ type:'REMOVE_CURRENT_LOCATION' });
        dispatch({ type: 'LOGOUT' });
      }}
    >
      Log Out
    </button>
  );
}

export default LogOutButton;
