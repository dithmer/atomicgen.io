import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { basic, moderate, complex } from './SampleTests';
import { Typography } from '@mui/material';
import UploadButton from './UploadButton';



export default function InputButtons({ darkMode, setInputs, setChanged, changed }) {
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
                variant={darkMode ? "outlined" : "contained"} 
                ref={anchorRef}
                aria-label="Load attack test sample"
            >
                <Button
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="load sample"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                    endIcon={<ArrowDropDownIcon />}
                >
                    Load Sample
                </Button>
                <UploadButton setInputs={setInputs} darkMode={darkMode}/>
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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                sx={{ width: 80 }}
                                                label="Basic"
                                                variant={darkMode ? "outlined" : "filled"}
                                                color='warning'
                                                size="small"
                                            />
                                            <Typography fontSize={15}>{basic.name}</Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem onClick={() => loadSample(moderate)}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                sx={{ width: 80 }}
                                                label="Moderate"
                                                variant={darkMode ? "outlined" : "filled"}
                                                color="warning"
                                                size="small"
                                            />
                                            <Typography fontSize={15}>{moderate.name}</Typography>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem onClick={() => loadSample(complex)}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Chip
                                                sx={{ width: 80 }}
                                                label="Complex"
                                                variant={darkMode ? "outlined" : "filled"}
                                                color="warning"
                                                size="small"
                                            />
                                            <Typography fontSize={15}>{complex.name}</Typography>
                                        </Box>
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
