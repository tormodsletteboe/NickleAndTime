import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { useSlider } from "@mui/base";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNnumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verifyClicked, setVerifyClicked] = useState(false);

  const errors = useSelector((store) => store.errors);
  const statusCode = useSelector((store) => store.validationCode);

  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();
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

    dispatch({
      type: 'CLEAR_STATUS_SMSCODE'
    });
  }; // end registerUser

  const handleCode = () => {
    //TODO: THIS IS WHERE I AM, clean up this stuff all the way tru, get rid of the phone call version.
    dispatch({
      type: "VERIFY_CODE_SMS",
      payload: { phoneNumber: phoneNnumber, code: code },
    });
  };
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
    dispatch({
      type: "VERIFY_NUMBER_SMS",
      payload: { phoneNumber: phoneNnumber },
    });

    
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
            <div className="">
              <TextField
                variant="outlined"
                size="small"
                label="Code"
                type="text"
                name="code"
                required
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                }}
              />
              <Button onClick={handleCode}>Check Code</Button>
            </div>
          </div>
        </div>
        {statusCode && (
          <Button
            variant="contained"
            className="btn"
            type="submit"
            name="submit"
            value="Register"
          >
            Register
          </Button>
        )}
      </Stack>
    </form>
  );
}

export default RegisterForm;
