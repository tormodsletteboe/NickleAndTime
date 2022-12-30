import * as React from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function CircularProgressWithLabel(props) {
  const dispatch = useDispatch();
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        {...props}
        thickness={10}
        size={70}
        color={"error"}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          color="black"
          sx={{ fontWeight: "bold" }}
        >
          {`${Math.floor(props.clock)}`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
  clock: PropTypes.number.isRequired,
};

export default function CircularStatic() {
  const [progress, setProgress] = React.useState(1.667);
  const [clocktIncrement, setClockIncrement] = React.useState(1);
  const dispatch = useDispatch();
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (clocktIncrement <= 60) {
        setProgress((prevProgress) =>
          prevProgress >= 100 ? 0 : prevProgress + 1.667
        );
        setClockIncrement((prevProgress) => prevProgress + 1);
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  if (clocktIncrement == 60) {
    dispatch({ type: "FETCH_LATEST_SMS" });
  }
  if (clocktIncrement <= 60) {
    return (
      <CircularProgressWithLabel value={progress} clock={clocktIncrement} />
    );
  } else {
    return <></>;
  }
}
