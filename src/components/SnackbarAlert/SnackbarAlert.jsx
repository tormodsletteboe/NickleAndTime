import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {useSelector,useDispatch} from 'react-redux';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars() {

  
  const showAlert = useSelector((store)=>store.snackbaralert);
  const smsMessage = useSelector((store)=>store.latestSMS);
  const dispatch = useDispatch();
  

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({type: 'UNSET_SNACKBAR_ALERT'});
    
  };

  return ( showAlert &&
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {smsMessage.username} {smsMessage.body} {smsMessage.name}
        </Alert>
      </Snackbar>
    </Stack>
  );
}