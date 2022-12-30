import * as React from 'react';
import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {useSelector,useDispatch} from 'react-redux';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const severitySMS = {"1": 'success',"2": 'warning',"3":'error' };

export default function CustomizedSnackbars() {

  
  
  const smsMessage = useSelector((store)=>store.latestSMS);
  const dispatch = useDispatch();
  const [prevMsgId, setPrevMsgId] = useState(0);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    //TODO: need to get rid of old msg before showing new, this does not do it
    setPrevMsgId(smsMessage.id);
    dispatch({type: "UNSET_LATEST_SMS"});
  };

  return ( (smsMessage.id != prevMsgId) &&
    <Stack spacing={2} sx={{ width: '100%' }}>
      {console.log('smsM ', smsMessage)}
      <Snackbar open={Object.keys(smsMessage).length === 0 ? false : true} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severitySMS[smsMessage.severity]} sx={{ width: '100%' }}>
          {smsMessage.username} {smsMessage.body} {smsMessage.place_name}
        </Alert>
      </Snackbar>
    </Stack>
  );
}