import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import yaml from 'js-yaml';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});




export default function UploadButton({ darkMode, setInputs }) {
    const [errorMessage, setErrorMessage] = useState(null);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            if (fileExtension !== "yaml" && fileExtension !== "yml") {
                setErrorMessage("Only yaml files can be uploaded.");
                console.error("Only yaml files can be uploaded.");
                return;
            }
            try {
                // Dosyayı okuma işlemi
                const fileContent = await file.text();

                // YAML parse işlemi
                const parsed = yaml.load(fileContent);
                await setInputs(parsed[0]);

                console.log(JSON.stringify(parsed, null, 4));

            } catch (error) {
                console.error("Error while file processing the yaml file, check format.", error);
            }
        }
    };
    return (
        <Button
            component="label"
            disabled
            role={undefined}
            variant={darkMode ? "outlined" : "contained"} 
            tabIndex={-1}
        >
            Upload YAML
            <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                multiple
            />
        </Button>
    );
}
