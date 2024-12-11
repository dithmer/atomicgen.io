import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
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
import Alert from '@mui/material/Alert';
import basic from './samples/hostname_discovery_(windows).yaml';
import moderate from './samples/scheduled_task_startup_script.yaml';
import complex from './samples/windows_push_file_using_scp.exe.yaml';
import { Typography } from '@mui/material';
import UploadButton from './UploadButton';
import transformInputArguments from './transformInputArguments';



export default function InputButtons({ base, darkMode, setInputs, setChanged, changed }) {
    const [open, setOpen] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [samples, setSamples] = useState([]);
    const anchorRef = React.useRef(null);

    useEffect(() => {
        const fetchSamples = async () => {
            const tests = []
            for (let test of [basic, moderate, complex]) {
                let response = await fetch(test);
                let yamlText = await response.text();
                let parsed = yaml.load(yamlText);
                tests.push({ ...base, ...transformInputArguments(parsed[0]) });
            }
            setSamples(tests);
        }
        fetchSamples();
    }, [base]);

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
        await setInputs({ ...base, ...samples[level] });
        setChanged(false);
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
                <UploadButton
                    base={base}
                    setInputs={setInputs}
                    darkMode={darkMode}
                    setErrorMessage={setErrorMessage}
                    errorMessage={errorMessage}
                    setChanged={setChanged}
                    changed={changed}
                />
            </ButtonGroup>
            {errorMessage &&
                <Alert sx={{ mt: 1 }} variant={darkMode ? "outlined" : "filled"} severity='error'>
                    {errorMessage}
                </Alert>
            }
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
                                    {
                                        samples.map((sample, index) => (
                                            <MenuItem key={index} onClick={() => loadSample(index)}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        sx={{ width: 80 }}
                                                        label={index === 0 ? "Basic" : index === 1 ? "Moderate" : "Complex"}
                                                        variant={darkMode ? "outlined" : "filled"}
                                                        color='warning'
                                                        size="small"
                                                    />
                                                    <Typography fontSize={15}>{sample.name}</Typography>
                                                </Box>
                                            </MenuItem>
                                        ))
                                    }
                                </MenuList>

                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}
