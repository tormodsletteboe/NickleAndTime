import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Stack, ListSubheader } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareLocation from '@mui/icons-material/ShareLocation';
import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';

import BasicPopover from './Popover.jsx';
import HelpPopover from './HelpPopover.jsx';


export default function PlacesToAvoidDrawer() {

    const dispatch = useDispatch();
    const placesToAvoid = useSelector((store) => store.placesToAvoid);
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
            
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <List>
                <ListSubheader>
                    <Box sx={{display:'flex',justifyContent: 'space-between' }}>
                        {`#visits this week / #allowed visits per week`}
                        <BasicPopover/>
                    </Box>
                </ListSubheader>
                {placesToAvoid.map((place) => (
                    
                    <ListItem
                        key={place.id}
                        disablePadding
                        style={{ textDecoration : !place.active ? 'line-through' : 'none' }}
                    >
                        <ListItemButton  >
                        <Stack direction='row' spacing={1}>
                            <ListItemIcon>
                                <ShareLocation />
                            </ListItemIcon>
                            <ListItemText primary={place.name} />
                            <ListItemText primary={`${place.visit_count}/${place.visit_limit}`}/>
                            </Stack>
                            <Tooltip title={place.active ? "Deactivate" : "Activate"}>
                                <Switch checked={place.active} onChange={() => { dispatch({ type: 'TOGGLE_ACTIVE', payload:{placeId:place.id} }) }} />
                            </Tooltip>
                        </ListItemButton>
                        <Tooltip title="Permanently delete, you can always add it back later">
                            <Button onClick={()=>{dispatch({type: 'DELETE_USER_PLACE',payload:{placeId:place.id}})}} color="error">
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
            {['bottom'].map((anchor) => (
                <Fragment key={anchor}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Button onClick={toggleDrawer(anchor, true)}>{"Places To Avoid"}</Button>
                        <HelpPopover/>
                    </Stack>
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

