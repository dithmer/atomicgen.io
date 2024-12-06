import React, { useState, useEffect } from 'react';
import Inputs from './components/Inputs';
import YamlContent from './components/YamlContent';
import Navbar from './components/Navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { red, grey } from '@mui/material/colors';

const executor_names = [
  "powershell",
  "command prompt",
  "bash",
  "sh",
];

const supported_platforms = [
  "Windows",
  "Macos",
  "Linux",
  "Office-365",
  "Azure-AD",
  "Google-Workspace",
  "SaaS",
  "IaaS",
  "Containers",
  "IaaS:gcp",
  "IaaS:azure",
  "IaaS:aws",
].map((name) => name.toLowerCase());

// Base Inputs
const base = {
  name: null,
  description: null,
  supported_platforms: [],
  input_arguments: [],
  dependency_executor_name: "",
  dependencies: [],
  executor: {
    command: null,
    cleanup_command: null,
    name: "",
    elevation_required: false,
  },
};

// Validation Rules
const validationRules = {
  name: { required: true, errorMessage: 'Atomic name' },
  description: { required: true, errorMessage: 'Atomic description' },
  supported_platforms: { required: true, errorMessage: 'Supported platforms' },
  input_arguments: {
    required: false,
    nestedValidation: {
      type: { required: true, errorMessage: 'Input type' },
      name: { required: true, errorMessage: 'Input name' },
      default: { required: false },
    },
  },
  dependency_executor_name: { required: false },
  dependencies: {
    required: false,
    nestedValidation: {
      description: { required: true, errorMessage: 'Dependency description' },
      prereq_command: { required: true, errorMessage: 'Dependency check command' },
      get_prereq_command: { required: false },
    },
  },
  executor: {
    required: true,
    nestedValidation: {
      command: { required: true, errorMessage: 'Attack command' },
      cleanup_command: { required: false },
      name: { required: true, errorMessage: 'Attack executor name' },
      elevation_required: { required: false },
    },
  },
};

// Validate Inputs Function
const validateInputs = (data, rules) => {
  const errors = [];
  Object.keys(rules).forEach((key) => {
    const rule = rules[key];
    const value = data[key];

    // Required Field Check
    if (rule.required) {
      if (
        (Array.isArray(value) && value.length === 0) ||
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === "")
      ) {
        errors.push(rule.errorMessage);
      }
    }

    // Nested Validation: Array
    if (rule.nestedValidation && Array.isArray(value)) {
      value.forEach((item, index) => {
        const nestedErrors = validateInputs(item, rule.nestedValidation);
        if (nestedErrors.length > 0) {
          nestedErrors.forEach((error) => {
            errors.push(error);
          });
        }
      });
    }

    // Nested Validation: Object
    if (rule.nestedValidation && typeof value === "object" && !Array.isArray(value)) {
      const nestedErrors = validateInputs(value, rule.nestedValidation);
      if (nestedErrors.length > 0) {
        nestedErrors.forEach((error) => {
          errors.push(error);
        });
      }
    }
  });
  return errors;
};

function App() {
  const [errors, setErrors] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [inputs, setInputs] = useState(base);
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [changed, setChanged] = useState(false);

  // Prevent page reload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (changed) {
        event.preventDefault();
        event.returnValue = "";
      } 
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [changed]);


  // Check screen orientation
  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if inputs are updated
  useEffect(() => {
    if (JSON.stringify(inputs) === JSON.stringify(base)) {
      setUpdated(false);
      setChanged(false);
    } else {
      setUpdated(true);
      setChanged(true);
    }
  }, [inputs]);

  // Validate inputs
  useEffect(() => {
    if (updated) {

      const errors = validateInputs(inputs, validationRules);
      setValidationErrors(errors);
    } else {
      setValidationErrors([]);
    }
  }, [updated, inputs]);

  // Dark Theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: red[700],
        contrastText: '#fff',
      },
      background: {
        paper: "#0a0a0a",
      },
      text: {
        primary: '#fff',
        secondary: grey[500],
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Navbar/>
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid size={isPortrait ? 12 : 6}>
            <Inputs
              changed={changed}
              setChanged={setChanged}
              executor_names={executor_names}
              supported_platforms={supported_platforms}
              inputs={inputs}
              setInputs={setInputs}
              errors={errors}
              setErrors={setErrors}
            />
          </Grid>
          <Grid size={isPortrait ? 12 : 6}>
            <YamlContent
              base={base}
              errors={errors}
              setErrors={setErrors}
              inputs={inputs}
              setInputs={setInputs}
              updated={updated}
              validationErrors={validationErrors}
              setChanged={setChanged}
              changed={changed}
            />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;