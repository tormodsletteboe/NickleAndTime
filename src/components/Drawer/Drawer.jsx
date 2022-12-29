import { useEffect, useState, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Stack, ListSubheader } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import CircleTwoToneIcon from "@mui/icons-material/CircleTwoTone";
import BasicPopover from "./Popover.jsx";
import LocationOnIcon from "@mui/icons-material/LocationOn";

//color green,yellow,red, used for the icons in the drawer
const colors = { 1: "#008000", 2: "#FFFF00", 3: "#FF0000" };

export default function PlacesToAvoidDrawer() {
  const dispatch = useDispatch();
  const placesToAvoid = useSelector((store) => store.placesToAvoid);
  const map = useSelector((store)=> store.map);

  useEffect(() => {
    dispatch({
      type: "FETCH_PLACES_TO_AVOID",
    });
  }, []);
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
const handleListItemButtonClick =() =>{

  //this is where I am, thursday lunch
  //()=>map?.panTo({lat:place.latitude,lng:place.longitude})
}
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListSubheader>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {`#visits this week / #allowed visits per week`}
            <BasicPopover />
          </Box>
        </ListSubheader>
        {placesToAvoid.map((place) => (
          <ListItem
            key={place.id}
            disablePadding
            style={{ textDecoration: !place.active ? "line-through" : "none" }}
          >
            <ListItemButton onClick={handleListItemButtonClick}>
              <Stack direction="row" spacing={1}>
                <ListItemIcon>
                  <CircleTwoToneIcon
                    sx={{
                      mx: 2,
                      color:
                        colors[
                          calculateColor(place.visit_count, place.visit_limit)
                        ],
                      fontSize: 40,
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={place.name} />
                <ListItemText
                  primary={`${place.visit_count}/${place.visit_limit}`}
                />
              </Stack>
              <Tooltip title={place.active ? "Deactivate" : "Activate"}>
                <Switch
                  checked={place.active}
                  onChange={() => {
                    dispatch({
                      type: "TOGGLE_ACTIVE",
                      payload: { placeId: place.id },
                    });
                  }}
                />
              </Tooltip>
            </ListItemButton>
            <Tooltip title="Permanently delete">
              <Button
                onClick={() => {
                  dispatch({
                    type: "DELETE_USER_PLACE",
                    payload: { placeId: place.id },
                  });
                }}
                color="error"
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <div>
      {["bottom"].map((anchor) => (
        <Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            {"Places To Avoid"}
            <LocationOnIcon />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </Fragment>
      ))}
    </div>
  );
}

//calculate the severity, used in this component to set color of circles in the drawer
function calculateColor(visitCount, visitLimit) {
  //serverity is 3 if visitlimit is 0, ie users should not go there ever
  if (visitLimit == 0) {
    return 3;
  } else {
    //if less than 0.5, ie user have visited the place less than half the times allowed
    if (visitCount >= visitLimit) {
      return 3;
    } else if (visitLimit - visitCount == 1) {
      return 2;
    } else {
      return 1;
    }
  }
}
