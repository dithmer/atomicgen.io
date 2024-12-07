import React, { useEffect } from 'react';
import yaml from 'js-yaml';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Editor from './Editor';

// Utility function to download a string as a file
const downloadStringAsFile = (filename, content) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Function to format inputs into atomic YAML format
const atomic_yaml = (inputs) => {
  const atomic = {};
  Object.keys(inputs).forEach((key) => {
    if (key === 'input_arguments') {
      atomic["input_arguments"] = {};
      inputs.input_arguments.forEach((input) => {
        atomic["input_arguments"][input.name] = {
          type: input["type"],
          default: input["default"],
          description: input["description"]
        };
      });
    } else {
      atomic[key] = inputs[key];
    }
  });

  return atomic;
};

// Function to clean objects by removing null, undefined, or empty values
function cleanObject(obj) {
  if (Array.isArray(obj)) {
    return obj.map(cleanObject).filter(item => item !== null && item !== undefined && !(Array.isArray(item) && item.length === 0));
  } else if (typeof obj === 'object' && obj !== null) {
    const cleanedObject = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = cleanObject(value);
      if (cleanedValue !== null && cleanedValue !== undefined && !(Array.isArray(cleanedValue) && cleanedValue.length === 0) && !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)) {
        cleanedObject[key] = cleanedValue;
      }
    }
    return cleanedObject;
  }
  return obj === '' || obj === null || obj === undefined ? undefined : obj;
}

// Main component to handle YAML content display and interactions
function YamlContent({ darkMode, buttonVariant, inputs, setInputs, updated, base, validationErrors, setChanged, changed }) {
  const [formatted_yaml, setFormattedYaml] = React.useState(null); // Stores formatted YAML content
  const [showContent, setShowContent] = React.useState(false); // Toggles YAML content display
  const [showValidationErrors, setShowValidationErrors] = React.useState(false); // Toggles validation error display
  const [copyButtonLabel, setCopyButtonLabel] = React.useState("Copy"); // Label for copy button

  // Show validation errors if they exist
  const showValidationErrorHandler = () => {
    if (validationErrors.length > 0) {
      setShowValidationErrors(true);
    }
  };

  // Effect to format YAML whenever inputs or validation errors change
  useEffect(() => {
    setFormattedYaml(
      yaml.dump([cleanObject(atomic_yaml(inputs))], { lineWidth: -1 })
    );
    if (validationErrors.length === 0) {
      setShowValidationErrors(false);
    }
  }, [inputs, validationErrors.length]);

  // Effect to determine whether YAML content should be displayed
  useEffect(() => {
    setShowContent(updated && formatted_yaml !== "{}\n");
  }, [updated, formatted_yaml]);

  // Handler to reset inputs to the base state
  const resetButtonHandle = () => {
    const confirmReset = window.confirm("Are you sure you want to reset?");
    if (confirmReset) {
      setInputs(base);
      setChanged(false);
    }
  };

  // Handler to download YAML content as a file
  const downloadButtonHandle = () => {
    setChanged(false);
    showValidationErrorHandler();
    if (inputs.name === null || inputs.name === undefined || inputs.name.trim() === "") {
      alert("Name is required to download the file.");
      return;
    }
    const filename = inputs.name.replace(/ /g, "_").toLowerCase() + ".yaml";
    downloadStringAsFile(filename, formatted_yaml);
  };

  // Handler to copy YAML content to clipboard
  const copyButtonHandler = async () => {
    showValidationErrorHandler();
    setChanged(false);
    try {
      await navigator.clipboard.writeText(formatted_yaml);
      setCopyButtonLabel("Copied!");
      setTimeout(() => {
        setCopyButtonLabel("Copy");
      }, 2000);
    } catch (error) {
      console.warn("Clipboard API failed, falling back to textarea method.", error);
      const textarea = document.createElement("textarea");
      textarea.value = formatted_yaml;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopyButtonLabel("Copied!");
        setTimeout(() => {
          setCopyButtonLabel("Copy");
        }, 2000);
      } catch (execError) {
        console.error("Failed to copy content using fallback method:", execError);
        alert("Failed to copy content. Please try manually.");
      }
      document.body.removeChild(textarea);
    }
  };

  return (
    <Box>
      {/* Button group for actions: Download, Copy, Reset */}
      <Box sx={{ mb: 2 }}>
        <ButtonGroup variant={buttonVariant} aria-label="Basic button group">
          <Button disabled={!showContent} onClick={downloadButtonHandle}>
            Download {changed ? "*" : ""}
          </Button>
          <Button disabled={!showContent} onClick={copyButtonHandler}>
            {copyButtonLabel} {changed ? "*" : ""}
          </Button>
          <Button disabled={!showContent} onClick={resetButtonHandle}>
            Reset
          </Button>
        </ButtonGroup>
      </Box>
      {/* Display validation errors */}
      <Box>
        {showValidationErrors && (
          <Box sx={{ mb: 1 }}>
            <Alert variant="outlined" severity="warning">
              <Typography component="span">Some of the required fields are missing.</Typography>
              {[...new Set(validationErrors)].map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </Alert>
          </Box>
        )}
      </Box>
      {/* YAML content display or placeholder text */}
      <Box>
        {showContent ? (
          <Editor
            darkMode={darkMode}
            name="yaml-content"
            value={formatted_yaml}
            mode="yaml"
            readOnly={true}
            highlightActiveLine={false}
            maxLines={500}
          />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography sx={{ mt: 5 }} color="textDisabled" fontSize={16}>
              Fill blanks to generate YAML content
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default YamlContent;
