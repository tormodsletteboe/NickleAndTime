import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {useSelector,useDispatch} from 'react-redux';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const severitySMS = {"1": 'success',"2": 'warning',"3":'error' }
export default function CustomizedSnackbars() {

  
  const showAlert = useSelector((store)=>store.snackbaralert);
  const smsMessage = useSelector((store)=>store.latestSMS);
  const dispatch = useDispatch();
  

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    //TODO: need to get rid of old msg before showing new, this does not do it
    dispatch({type: 'UNSET_SNACKBAR_ALERT'});
    dispatch({type: "UNSET_LATEST_SMS"});
    
  };

  return ( (smsMessage && showAlert) &&
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar open={showAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severitySMS[smsMessage.severity]} sx={{ width: '100%' }}>
          {smsMessage.username} {smsMessage.body} {smsMessage.place_name}
        </Alert>
      </Snackbar>
    </Stack>
  );
}