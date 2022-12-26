import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNnumber, setPhoneNumber] = useState("");
  const [verifyClicked,setVerifyClicked]=useState(false);

  const errors = useSelector((store) => store.errors);
  
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();
    // console.log('asdfasfasdfasf',phoneNnumber);
    dispatch({ type: "CLEAR_REGISTRATION_ERROR" });

    if (phoneNnumber.length != 10) {
      dispatch({ type: "NOT_A_VALID_PHONE_NUMBER" });
      return;
    }
    if (Number.isInteger(Number(phoneNnumber)) == false) {
      dispatch({ type: "NOT_A_VALID_PHONE_NUMBER" });
      return;
    }
    dispatch({
      type: "REGISTER",
      payload: {
        username: username,
        password: password,
        phoneNumber: phoneNnumber,
      },
    });
  }; // end registerUser

  const handleCode =() =>{
    dispatch({
      type: "VERIFY_CODE_SMS",
      payload:{phoneNumber: phoneNnumber,code:'762042'}
    });
  }
  const handleVerify = () => {
    //TODO: need to check number is correct format
    dispatch({ type: "CLEAR_REGISTRATION_ERROR" });
    
    if (phoneNnumber.length != 10) {
      dispatch({ type: "NOT_A_VALID_PHONE_NUMBER" });
      return;
    }
    if (Number.isInteger(Number(phoneNnumber)) == false) {
      dispatch({ type: "NOT_A_VALID_PHONE_NUMBER" });
      return;
    }
    // dispatch({
    //   type: "VERIFY_NUMBER",
    //   payload: { name: username, phoneNnumber: phoneNnumber },
    // });
    dispatch({
      type: "VERIFY_NUMBER_SMS",
      payload:{phoneNumber: phoneNnumber}
    });
    setVerifyClicked(true);
  };
  return (
    <form className="formPanel" onSubmit={registerUser}>
      <Stack spacing={2}>
        <h3>Register User</h3>
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
            size="small"
            label="Username"
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
            size="small"
            label="Password"
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
              size="small"
              label="Phone Number"
              type="text"
              name="phone_number"
              required
              value={phoneNnumber}
              helperText={"USA ONLY, ex: 9998887777"}
              onChange={(event) => {
                setPhoneNumber(event.target.value);
              }}
            />
            <Button onClick={handleVerify}>Verify</Button>
            <Button onClick={handleCode}>Check Code</Button>
            {/* </label> */}
          </div>
        </div>
        {verifyClicked &&
        <Button
          variant="contained"
          className="btn"
          type="submit"
          name="submit"
          value="Register"
        >
          Register
        </Button>
        }
      </Stack>
    </form>
  );
}

export default RegisterForm;
