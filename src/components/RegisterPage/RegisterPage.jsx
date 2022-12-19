import React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import RegisterForm from '../RegisterForm/RegisterForm';
import Button from '@mui/material/Button';

function RegisterPage() {
  const history = useHistory();
  const dispatch = useDispatch();


  useEffect(()=>{
    dispatch({type:'CLEAR_REGISTRATION_ERROR'});
  },[])
  return (
    <div>
      <RegisterForm />

      <center>
        <Button
          type="button"
          className="btn btn_asLink"
          onClick={() => {
            history.push('/login');
          }}
        >
          Login
        </Button>
      </center>
    </div>
  );
}

export default RegisterPage;
