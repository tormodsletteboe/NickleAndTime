import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNnumber, setPhoneNumber] = useState('');
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();
    // console.log('asdfasfasdfasf',phoneNnumber);
    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
        phoneNumber: phoneNnumber,
      },
    });
  }; // end registerUser

  return (
    <form className="formPanel" onSubmit={registerUser}>
      <h2>Register User</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <div>
        {/* <label htmlFor="username"> */}
          {/* Username: */}
          <TextField
            variant="outlined"
            size='small'
            label='Username'
            type="text"
            name="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
        {/* </label> */}
      </div>
      <div>
        {/* <label htmlFor="password"> */}
          {/* Password: */}
          <TextField
            variant="outlined"
            size='small'
            label='Password'
            type="password"
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
        {/* </label> */}
      </div>
      <div>
        <div>
          {/* <label htmlFor="phone_number"> */}
          {/* Phone #: */}
          <TextField
            variant="outlined"
            size='small'
            label='Phone Number'
            type="text"
            name="phone_number"
            required
            value={phoneNnumber}
            onChange={(event) => {
              setPhoneNumber(event.target.value);
            }}
          />
          {/* </label> */}
        </div>
        <Button variant='contained' className="btn" type="submit" name="submit" value="Register" >Register</Button>
      </div>
    </form>
  );
}

export default RegisterForm;
