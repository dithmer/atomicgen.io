import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Editor from '../Editor';

// Dependency component for managing prerequisite commands and dependencies
function Dependency({ inputs, setInputs, executor_names }) {
    // State for managing tooltip visibility
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Close the tooltip when clicking outside
    const handleTooltipClose = () => {
        setTooltipOpen(false);
    };

    // Open the tooltip when clicking the info icon
    const handleTooltipOpen = () => {
        setTooltipOpen(true);
    };

    // Handle changes to specific fields in a dependency object
    const handleDependencyChange = (index, field, value) => {
        setInputs((prev) => {
            const updatedDependencies = [...prev.dependencies];
            updatedDependencies[index] = {
                ...updatedDependencies[index],
                [field]: value.split(/\r?\n/).join("\n"), // Normalize line breaks
            };
            return { ...prev, dependencies: updatedDependencies };
        });
    };

    // Add a new dependency with default values
    const addDependency = () => {
        setInputs((prev) => ({
            ...prev,
            dependencies: [
                { description: '', prereq_command: '', get_prereq_command: '' },
                ...prev.dependencies,
            ],
        }));
    };

    // Remove a dependency by index
    const removeDependency = (index) => {
        setInputs((prev) => ({
            ...prev,
            dependencies: prev.dependencies.filter((_, i) => i !== index),
        }));
        // Reset executor name if all dependencies are removed
        if (inputs.dependencies.length === 1) {
            setInputs((prev) => ({
                ...prev,
                dependency_executor_name: ""
            }));
        }
    };

    // Change the dependency executor type
    const handleChangeDependencyExecutorType = (e) => {
        const name = e.target.value;
        setInputs((prev) => ({
            ...prev,
            dependency_executor_name: name === '' ? null : name,
        }));
    };

    return (
        <Box sx={{ mb: 2 }}>
            {/* Section title */}
            <Typography variant="subtitle1" gutterBottom>
                Dependencies
            </Typography>

            {/* Button to add a new dependency */}
            <Box sx={{ mt: 1 }}>
                <Button startIcon={<AddCircleOutlineIcon />} sx={{ mr: 2, mb: 1 }} variant="text" onClick={addDependency}>
                    Add Dependency {inputs.dependencies.length > 0 ? `(${inputs.dependencies.length})` : ''}
                </Button>
            </Box>

            {/* Tooltip and executor type selection */}
            <Box sx={{ mb: 1 }} style={{ display: inputs.dependencies.length > 0 ? "flex" : "none" }}>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                    <Tooltip
                        onClose={handleTooltipClose}
                        open={tooltipOpen}
                        slotProps={{
                            popper: {
                                disablePortal: true,
                            },
                        }}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        sx={{ mr: 1 }}
                        arrow
                        title="Dependency executor will be inherited by attack executor if not selected"
                        placement='top'
                    >
                        <InfoIcon onClick={handleTooltipOpen} />
                    </Tooltip>
                </ClickAwayListener>
                <FormControl size="small" sx={{ width: "60%" }}>
                    <InputLabel id="dependency_executor" style={{ fontSize: 14 }}>Dependency Executor</InputLabel>
                    <Select
                        labelId="dependency_executor"
                        id="dependency_executor_select"
                        value={inputs.dependency_executor_name}
                        label="Dependency Executor"
                        onChange={handleChangeDependencyExecutorType}
                    >
                        <MenuItem value="">None</MenuItem>
                        {executor_names.map((executor) => (
                            <MenuItem key={executor} value={executor}>{executor}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* Render each dependency */}
            {inputs.dependencies.map((dependency, index) => (
                <Box key={`dependency-${index}`} sx={{ mb: 2, border: '1px solid #ccc', p: 2 }}>
                    {/* Description field */}
                    <TextField
                        spellCheck="false"
                        fullWidth
                        size='small'
                        key={`description-${index}`}
                        label="Dependency Description"
                        value={dependency.description}
                        onChange={(e) =>
                            handleDependencyChange(index, 'description', e.target.value)
                        }
                    />

                    {/* Prerequisite command editor */}
                    <Typography sx={{ mt: 1 }} level="h6" gutterBottom key={`get_prereq_command_${index}`}>
                        Prerequisite Command
                    </Typography>
                    <Editor
                        mode={inputs.executor.name === "powershell" ? "powershell" : "sh"}
                        name="prerequisite-command-editor"
                        value={dependency.prereq_command || ''}
                        onChange={(e) => handleDependencyChange(index, 'prereq_command', e)}
                        key={`prerequisite-${index}`}
                        placeholder={"Command to check dependency"}
                    />

                    {/* Get prerequisite command editor */}
                    <Typography sx={{ mt: 1 }} level="h6" gutterBottom key={`prereq_command_${index}`}>
                        Get Prerequisite Command
                    </Typography>
                    <Editor
                        mode={inputs.executor.name === "powershell" ? "powershell" : "sh"}
                        name="prerequisite-command-editor"
                        value={dependency.get_prereq_command || ''}
                        onChange={(e) => handleDependencyChange(index, 'get_prereq_command', e)}
                        key={`get_prereq-${index}`}
                        placeholder={"Command to install dependency"}
                    />

                    {/* Remove dependency button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <IconButton
                            size='large'
                            color="error"
                            variant="outlined"
                            key={`remove-${index}`}
                            onClick={() => removeDependency(index)}
                        >
                            <DeleteIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                </Box>
            ))}
        </Box>
    );
}

export default Dependency;
