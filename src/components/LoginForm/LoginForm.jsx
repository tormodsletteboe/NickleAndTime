import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  return (
    <form className="formPanel" onSubmit={login}>
      <Stack spacing={2}>
      <h3>Login</h3>
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
      )}
      <div>
        {/* <label htmlFor="username">
          Username: */}
          <TextField
            variant="outlined"
            size='small'
            label='Username'
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        {/* </label> */}
      </div>
      <div>
        {/* <label htmlFor="password">
          Password: */}
          <TextField
            variant="outlined"
            size='small'
            label='Password'
            type="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        {/* </label> */}
      </div>
      
      <div>
        <Button variant='contained' className="btn" type="submit" name="submit" value="Log In">Log In</Button>
      </div>
      </Stack>
    </form>
  );
}

export default LoginForm;
