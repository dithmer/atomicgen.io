import React from 'react';
import {
    TextField,
    FormControl,
    FormControlLabel,
    Switch,
    Typography,
    Box,
    MenuItem,
    InputLabel,
    Select,
    Checkbox,
    OutlinedInput,
    Chip
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import Arguments from './Inputs/Arguments';
import Dependency from './Inputs/Dependency';
import Editor from './Editor';
import InputButtons from './Inputs/InputButtons';

// Constants for dropdown menu properties
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

// Functional component for managing inputs
function Inputs({ darkMode, componentVariant, changed, setChanged, errors, setErrors, inputs, setInputs, executor_names, supported_platforms }) {

    // Handle changes to text fields (e.g., Atomic Name, Atomic Description)
    const handleChangeText = (e) => {
        const { name, value } = e.target;
        setInputs((prev) => ({
            ...prev,
            [name]: value.trim() === '' ? null : value,
        }));
    };

    // Handle changes to the Supported Platforms selection
    const handleChangeSupportedPlatforms = (event) => {
        const { target: { value } } = event;
        setInputs((prev) => ({
            ...prev,
            supported_platforms: typeof value === 'string' ? value.split(',') : value,
        }));
    };

    // Handle the "Elevation Required" toggle switch
    const handleChangeElevationRequired = (e) => {
        const { checked } = e.target;
        setInputs((prev) => ({
            ...prev,
            executor: {
                ...prev.executor,
                elevation_required: checked
            }
        }));
    };

    // Handle changes to the Executor Type dropdown
    const handleChangeExecutorType = (e) => {
        const name = e.target.value;
        setInputs((prev) => ({
            ...prev,
            executor: {
                ...prev.executor,
                name
            }
        }));
    };

    // Handle changes to the Attack Command input (textarea/editor)
    const handleAttackCommandChange = (newValue) => {
        setInputs((prev) => ({
            ...prev,
            executor: {
                ...prev.executor,
                command: newValue.split(/\r?\n/).join("\n")
            }
        }));
    };

    // Handle changes to the Cleanup Command input (textarea/editor)
    const handleCleanupCommandChange = (newValue) => {
        setInputs((prev) => ({
            ...prev,
            executor: {
                ...prev.executor,
                cleanup_command: newValue.split(/\r?\n/).join("\n")
            }
        }));
    };

    return (
        <Box>
            <Box sx={{ mb: 2 }}>
                <InputButtons 
                    setInputs={setInputs}
                    setChanged={setChanged}
                    changed={changed}
                    darkMode={darkMode}
                />
            </Box>
            {/* Input for Atomic Name */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    required
                    spellCheck="false"
                    fullWidth
                    label="Atomic Name"
                    id="name"
                    size='small'
                    name="name"
                    value={inputs.name || ''}
                    onChange={handleChangeText}
                />
            </Box>

            {/* Input for Atomic Description */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    required
                    spellCheck="false"
                    fullWidth
                    multiline
                    minRows={2}
                    label="Atomic Description"
                    id="description"
                    name="description"
                    value={inputs.description || ''}
                    onChange={handleChangeText}
                />
            </Box>

            {/* Supported Platforms Selector */}
            <Box sx={{ mb: 2 }}>
                <FormControl required size='small' sx={{ minWidth: '30vh', maxWidth: '50vh' }}>
                    <InputLabel id="demo-multiple-chip-label">Supported Platforms</InputLabel>
                    <Select
                        labelId="demo-multiple-chip-label"
                        id="demo-multiple-chip"
                        multiple
                        value={inputs.supported_platforms}
                        onChange={handleChangeSupportedPlatforms}
                        input={<OutlinedInput id="select-multiple-chip" label="Supported Platforms" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {supported_platforms.map((name) => (
                            <MenuItem
                                key={name}
                                value={name}
                                sx={{ height: '2.5rem' }}
                            >
                                <Checkbox color='warning' checked={inputs.supported_platforms.includes(name)} />
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Executor Type Selector and Elevation Switch */}
            <Box sx={{ mb: 2 }}>
                <FormControl required size="small" sx={{ mr: 2 }}>
                    <InputLabel id="attack_executor">Attack Executor</InputLabel>
                    <Select
                        labelId="attack_executor"
                        id="attack_executor_select"
                        style={{ width: '30vh' }}
                        value={inputs.executor.name}
                        label="Attack Executor"
                        onChange={handleChangeExecutorType}
                    >
                        <MenuItem value="">None</MenuItem>
                        {executor_names.map((executor) => (
                            <MenuItem key={executor} value={executor}>{executor}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Toggle switch for Elevation Required */}
                <FormControl component="fieldset" sx={{}}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={inputs.executor.elevation_required}
                                onChange={handleChangeElevationRequired}
                                name="Attack Elevation Required"
                                color="primary"
                            />
                        }
                        sx={{ padding: 0, margin: 0 }}
                        label="Attack Elevation Required"
                        labelPlacement='start'
                    />
                </FormControl>
            </Box>

            {/* Editor for Attack Command */}
            <Box sx={{ mb: 2 }}>
                <Typography level="h6" gutterBottom>
                    Attack Command *
                </Typography>
                <Editor
                    darkMode={darkMode}
                    mode={inputs.executor.name === "powershell" ? "powershell" : "sh"}
                    name="attack-command-editor"
                    value={inputs.executor.command || ''}
                    height="150px"
                    onChange={handleAttackCommandChange}
                    placeholder={"Write an attack command / script"}
                />
            </Box>

            {/* Editor for Cleanup Command */}
            <Box sx={{ mb: 2 }}>
                <Typography level="h6" gutterBottom>
                    Cleanup Command (Optional)
                </Typography>
                <Editor
                    darkMode={darkMode}
                    mode={inputs.executor.name === "powershell" ? "powershell" : "sh"}
                    name="cleanup-command-editor"
                    value={inputs.executor.cleanup_command || ''}
                    height="150px"
                    onChange={handleCleanupCommandChange}
                    placeholder={"Write a cleanup command / script"}
                />
            </Box>

            {/* Input Arguments and Dependencies */}
            <Box sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Dependency darkMode={darkMode} executor_names={executor_names} errors={errors} setErrors={setErrors} inputs={inputs} setInputs={setInputs} />
                    </Grid>
                    <Grid size={6}>
                        <Arguments darkMode={darkMode} errors={errors} setErrors={setErrors} inputs={inputs} setInputs={setInputs} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

// Define prop types for the Inputs component
Inputs.propTypes = {
    inputs: PropTypes.object.isRequired,
    setInputs: PropTypes.func.isRequired,
};

export default Inputs;
