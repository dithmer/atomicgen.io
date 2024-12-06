import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { basic, moderate, complex } from './SampleTests';
import { Typography } from '@mui/material';



export default function InputButtons({ setInputs, setChanged, changed }) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    const loadSample = async (level) => {
        if (changed) {
            const confirm = window.confirm('Are you sure you want to load this sample? Your current inputs will be overwritten.');
            if (!confirm) return;
        }
        await setInputs(level);
        await setChanged(false);
        handleToggle(null);
    }

    return (
        <React.Fragment>
            <ButtonGroup
                variant="outlined"
                ref={anchorRef}
                aria-label="Button group with a nested menu"
            >
                <Button
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                    endIcon={<ArrowDropDownIcon />}
                >
                    Load Sample
                </Button>
            </ButtonGroup>
            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                placement='bottom-end'
                transition
            >
                {({ TransitionProps }) => (
                    <Grow
                        {...TransitionProps}

                    >
                        <Paper elevation={6}>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    <MenuItem onClick={() => loadSample(basic)}>
                                        <Chip sx={{mr: 1}} label="Basic" variant='outlined' color="warning" size='small' />
                                        <Typography fontSize={15}>{basic.name}</Typography> 
                                    </MenuItem>
                                    <MenuItem onClick={() => loadSample(moderate)}>
                                        <Chip sx={{mr: 1}} label="Moderate" variant='outlined' color="warning" size='small' />
                                        <Typography fontSize={15}>{moderate.name}</Typography> 
                                    </MenuItem>
                                    <MenuItem onClick={() => loadSample(complex)}>
                                        <Chip sx={{mr: 1}} label="Complex" variant='outlined' color="warning" size='small' />
                                        <Typography fontSize={15}>{complex.name}</Typography> 
                                    </MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}
