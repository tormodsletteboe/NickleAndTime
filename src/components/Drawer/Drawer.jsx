import { useEffect, useState, Fragment } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TextField,Stack } from '@mui/material';

import ShareLocation from '@mui/icons-material/ShareLocation';
import { useDispatch, useSelector } from 'react-redux';


export default function PlacesToAvoidDrawer() {

    const dispatch = useDispatch();
    const placesToAvoid = useSelector((store) => store.placesToAvoid);
    // console.log('asdfasdfasdfasdfasf',placesToAvoid);
    useEffect(() => {
        dispatch({
            type: 'FETCH_PLACES_TO_AVOID'
        });

    }, []);
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
            role="presentation"
            // onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                {placesToAvoid.map((place) => (
                    <ListItem key={place.id} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <ShareLocation />
                            </ListItemIcon>
                            <ListItemText primary={place.name} />
                            <Stack
                                direction="row"
                                spacing={2}
                            >
                                <TextField
                                    variant="outlined"
                                    size='small'
                                    label='Visits'
                                    type="text"
                                    name="visitCount"
                                    value={place.visit_count}
                                    disabled
                                />
                                <TextField
                                    variant="outlined"
                                    size='small'
                                    label='Visit Limit/Week'
                                    type="text"
                                    name="visitLimit"
                                    value={place.visit_limit}
                                    disabled
                                />
                                <Button>DEACTIVATE</Button>
                                <Button>DELETE</Button>
                            </Stack>
                        </ListItemButton>

                    </ListItem>
                ))}
            </List>
            <Divider />
        </Box>
    );


    return (
        <div>
            {['bottom'].map((anchor) => (
                <Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>{"Places To Avoid"}</Button>
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

